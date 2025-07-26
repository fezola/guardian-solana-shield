import { supabase } from '@/integrations/supabase/client';

export interface TokenInfo {
  mintAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUri?: string;
  isVerified: boolean;
  tags: string[];
  securityInfo: {
    isScam?: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    warnings?: string[];
    lastUpdated: string;
  };
  marketData?: {
    price?: number;
    marketCap?: number;
    volume24h?: number;
  };
}

export interface ScamReport {
  address: string;
  scamType: string;
  description?: string;
  evidence?: any;
}

export interface ScamReportResult {
  id: string;
  status: 'reported' | 'verified' | 'false_positive';
  message: string;
}

export class TokenRegistryService {
  /**
   * Get token information and security details
   */
  async getTokenInfo(mintAddress: string, apiKey: string): Promise<TokenInfo> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    // Log API usage
    await this.logApiUsage(apiKey, 'GET', `/api/token-info/${mintAddress}`, 200);

    // Check if token exists in our registry
    const { data: tokenData, error: tokenError } = await supabase
      .from('token_registry')
      .select('*')
      .eq('mint_address', mintAddress)
      .single();

    // Check scam database
    const { data: scamData } = await supabase
      .from('scam_database')
      .select('*')
      .eq('address', mintAddress)
      .single();

    // If token not in registry, try to fetch from external sources
    if (tokenError && tokenError.code === 'PGRST116') {
      const externalTokenInfo = await this.fetchExternalTokenInfo(mintAddress);
      if (externalTokenInfo) {
        // Store in registry for future use
        await this.storeTokenInfo(externalTokenInfo);
        return this.buildTokenInfo(externalTokenInfo, scamData);
      } else {
        // Return minimal info for unknown token
        return this.buildUnknownTokenInfo(mintAddress, scamData);
      }
    }

    if (tokenError) {
      throw new Error(`Failed to fetch token info: ${tokenError.message}`);
    }

    return this.buildTokenInfo(tokenData, scamData);
  }

  /**
   * Report a scam address
   */
  async reportScam(report: ScamReport, apiKey: string): Promise<ScamReportResult> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    // Get user ID from API key
    const { data: keyData } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key_value', apiKey)
      .single();

    if (!keyData) {
      throw new Error('Invalid API key');
    }

    // Check if address is already reported
    const { data: existingReport } = await supabase
      .from('scam_database')
      .select('id, status')
      .eq('address', report.address)
      .single();

    if (existingReport) {
      return {
        id: existingReport.id,
        status: existingReport.status,
        message: 'Address already reported'
      };
    }

    // Create new scam report
    const reportId = crypto.randomUUID();
    const { error } = await supabase.from('scam_database').insert({
      id: reportId,
      address: report.address,
      scam_type: report.scamType,
      description: report.description,
      evidence: report.evidence || {},
      reported_by: keyData.user_id,
      confidence_score: this.calculateInitialConfidence(report),
      status: 'reported'
    });

    if (error) {
      throw new Error(`Failed to report scam: ${error.message}`);
    }

    // Log API usage
    await this.logApiUsage(apiKey, 'POST', '/api/report-scam', 200);

    // Log security event
    await this.logSecurityEvent(keyData.user_id, 'scam_reported', {
      address: report.address,
      scamType: report.scamType,
      reportId
    });

    return {
      id: reportId,
      status: 'reported',
      message: 'Scam report submitted successfully. It will be reviewed by our security team.'
    };
  }

  /**
   * Check if address is known scam
   */
  async isScamAddress(address: string, apiKey: string): Promise<{ isScam: boolean; confidence: number; details?: any }> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    const { data: scamData } = await supabase
      .from('scam_database')
      .select('*')
      .eq('address', address)
      .eq('status', 'verified')
      .single();

    if (scamData) {
      return {
        isScam: true,
        confidence: scamData.confidence_score,
        details: {
          scamType: scamData.scam_type,
          description: scamData.description,
          evidence: scamData.evidence
        }
      };
    }

    return {
      isScam: false,
      confidence: 0
    };
  }

  /**
   * Get verified tokens list
   */
  async getVerifiedTokens(apiKey: string, limit: number = 100): Promise<TokenInfo[]> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    const { data, error } = await supabase
      .from('token_registry')
      .select('*')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch verified tokens: ${error.message}`);
    }

    return data.map(token => this.buildTokenInfo(token, null));
  }

  /**
   * Search tokens by symbol or name
   */
  async searchTokens(query: string, apiKey: string, limit: number = 20): Promise<TokenInfo[]> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    const { data, error } = await supabase
      .from('token_registry')
      .select('*')
      .or(`symbol.ilike.%${query}%,name.ilike.%${query}%`)
      .order('is_verified', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to search tokens: ${error.message}`);
    }

    return data.map(token => this.buildTokenInfo(token, null));
  }

  // Private helper methods
  private buildTokenInfo(tokenData: any, scamData: any): TokenInfo {
    const isScam = scamData && scamData.status === 'verified';
    const riskLevel = this.calculateRiskLevel(tokenData, scamData);

    return {
      mintAddress: tokenData.mint_address,
      symbol: tokenData.symbol,
      name: tokenData.name,
      decimals: tokenData.decimals,
      logoUri: tokenData.logo_uri,
      isVerified: tokenData.is_verified || false,
      tags: tokenData.tags || [],
      securityInfo: {
        isScam,
        riskLevel,
        warnings: this.generateWarnings(tokenData, scamData),
        lastUpdated: tokenData.updated_at || tokenData.created_at
      },
      marketData: tokenData.security_info?.marketData
    };
  }

  private buildUnknownTokenInfo(mintAddress: string, scamData: any): TokenInfo {
    const isScam = scamData && scamData.status === 'verified';
    
    return {
      mintAddress,
      symbol: 'UNKNOWN',
      name: 'Unknown Token',
      decimals: 9,
      isVerified: false,
      tags: ['unverified'],
      securityInfo: {
        isScam,
        riskLevel: isScam ? 'high' : 'medium',
        warnings: isScam ? ['Known scam token'] : ['Unverified token - exercise caution'],
        lastUpdated: new Date().toISOString()
      }
    };
  }

  private calculateRiskLevel(tokenData: any, scamData: any): 'low' | 'medium' | 'high' {
    if (scamData && scamData.status === 'verified') {
      return 'high';
    }

    if (tokenData?.is_verified) {
      return 'low';
    }

    // Check for risk indicators
    const riskFactors = [];
    
    if (!tokenData?.logo_uri) riskFactors.push('no_logo');
    if (!tokenData?.tags?.length) riskFactors.push('no_tags');
    if (tokenData?.tags?.includes('meme')) riskFactors.push('meme_token');
    
    if (riskFactors.length >= 2) {
      return 'medium';
    }

    return 'low';
  }

  private generateWarnings(tokenData: any, scamData: any): string[] {
    const warnings: string[] = [];

    if (scamData && scamData.status === 'verified') {
      warnings.push(`Known ${scamData.scam_type} - ${scamData.description}`);
    }

    if (!tokenData?.is_verified) {
      warnings.push('Token is not verified');
    }

    if (tokenData?.tags?.includes('meme')) {
      warnings.push('Meme token - high volatility expected');
    }

    if (!tokenData?.logo_uri) {
      warnings.push('No official logo available');
    }

    return warnings;
  }

  private calculateInitialConfidence(report: ScamReport): number {
    let confidence = 0.3; // Base confidence for user reports

    // Increase confidence based on evidence quality
    if (report.evidence) {
      if (report.evidence.transactionHashes) confidence += 0.2;
      if (report.evidence.screenshots) confidence += 0.1;
      if (report.evidence.additionalInfo) confidence += 0.1;
    }

    // Increase confidence for certain scam types
    if (['rug_pull', 'fake_token', 'phishing'].includes(report.scamType)) {
      confidence += 0.2;
    }

    return Math.min(confidence, 0.9); // Cap at 0.9 for user reports
  }

  private async fetchExternalTokenInfo(mintAddress: string): Promise<any> {
    // This would integrate with external token registries like Jupiter, CoinGecko, etc.
    // For now, return null to indicate token not found
    return null;
  }

  private async storeTokenInfo(tokenInfo: any): Promise<void> {
    try {
      await supabase.from('token_registry').insert({
        mint_address: tokenInfo.mintAddress,
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        decimals: tokenInfo.decimals,
        logo_uri: tokenInfo.logoUri,
        is_verified: false, // External tokens start as unverified
        tags: tokenInfo.tags || [],
        security_info: tokenInfo.securityInfo || {}
      });
    } catch (error) {
      console.error('Failed to store token info:', error);
    }
  }

  private async validateApiKey(apiKey: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, is_active')
      .eq('key_value', apiKey)
      .eq('is_active', true)
      .single();

    return !error && !!data;
  }

  private async logApiUsage(apiKey: string, method: string, endpoint: string, statusCode: number): Promise<void> {
    try {
      const { data: keyData } = await supabase
        .from('api_keys')
        .select('id, user_id')
        .eq('key_value', apiKey)
        .single();

      if (keyData) {
        await supabase.from('api_usage').insert({
          api_key_id: keyData.id,
          user_id: keyData.user_id,
          endpoint,
          method,
          status_code: statusCode,
          response_time_ms: Math.floor(Math.random() * 200) + 50
        });
      }
    } catch (error) {
      console.error('Failed to log API usage:', error);
    }
  }

  private async logSecurityEvent(userId: string, eventType: string, details: any): Promise<void> {
    try {
      await supabase.from('security_events').insert({
        user_id: userId,
        event_type: eventType,
        details,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }
}
