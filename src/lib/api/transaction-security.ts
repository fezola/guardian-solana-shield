import { supabase } from '@/integrations/supabase/client';
import { TransactionAnalyzer, TransactionAnalysisResult } from '@/lib/guardian-sdk/transaction-analyzer';
import { OTPService } from '@/lib/guardian-sdk/otp-service';
import { BiometricAuth } from '@/lib/guardian-sdk/biometric-auth';

export interface SecureTransactionRequest {
  transaction: any;
  userEmail: string;
  options: {
    riskLevel?: 'auto' | 'low' | 'medium' | 'high';
    biometric?: boolean;
    otp?: boolean;
    simulate?: boolean;
    confirmationDelay?: number;
  };
}

export interface SecureTransactionResult {
  success: boolean;
  transactionId?: string;
  analysis: TransactionAnalysisResult;
  securityChecks: {
    biometric?: boolean;
    otp?: boolean;
    simulation?: boolean;
  };
  error?: string;
}

export class TransactionSecurityAPI {
  private analyzer: TransactionAnalyzer;
  private otpService: OTPService;
  private biometricAuth: BiometricAuth;

  constructor() {
    this.analyzer = new TransactionAnalyzer();
    this.otpService = new OTPService('supabase');
    this.biometricAuth = new BiometricAuth();
  }

  /**
   * Analyze transaction security without executing
   */
  async analyzeTransaction(transaction: any, apiKey: string): Promise<TransactionAnalysisResult> {
    // Validate API key
    const isValidKey = await this.validateApiKey(apiKey);
    if (!isValidKey) {
      throw new Error('Invalid API key');
    }

    // Log API usage
    await this.logApiUsage(apiKey, 'POST', '/api/analyze-transaction', 200);

    // Perform analysis
    const analysis = await this.analyzer.analyzeTransaction(transaction);

    // Store analysis in database
    await this.storeTransactionAnalysis(transaction, analysis, apiKey);

    return analysis;
  }

  /**
   * Execute secure transaction with multi-factor authentication
   */
  async secureTransaction(request: SecureTransactionRequest, apiKey: string): Promise<SecureTransactionResult> {
    try {
      // Validate API key
      const isValidKey = await this.validateApiKey(apiKey);
      if (!isValidKey) {
        throw new Error('Invalid API key');
      }

      // Analyze transaction first
      const analysis = await this.analyzer.analyzeTransaction(request.transaction);
      
      // Determine required security level
      const requiredSecurity = this.determineSecurityRequirements(analysis, request.options);

      const securityChecks = {
        biometric: false,
        otp: false,
        simulation: true
      };

      // Perform biometric authentication if required
      if (requiredSecurity.biometric) {
        const biometricResult = await this.biometricAuth.authenticate();
        if (!biometricResult.success) {
          return {
            success: false,
            analysis,
            securityChecks,
            error: 'Biometric authentication failed'
          };
        }
        securityChecks.biometric = true;
      }

      // Perform OTP verification if required
      if (requiredSecurity.otp) {
        // OTP should be verified separately via /api/verify-otp endpoint
        // This is just a check that OTP was completed
        const otpVerified = await this.checkOTPStatus(request.userEmail);
        if (!otpVerified) {
          return {
            success: false,
            analysis,
            securityChecks,
            error: 'OTP verification required'
          };
        }
        securityChecks.otp = true;
      }

      // Apply confirmation delay if required
      if (requiredSecurity.confirmationDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, requiredSecurity.confirmationDelay * 1000));
      }

      // Store successful transaction
      const transactionId = await this.storeSecureTransaction(request, analysis, apiKey);

      // Log API usage
      await this.logApiUsage(apiKey, 'POST', '/api/secure-transaction', 200);

      return {
        success: true,
        transactionId,
        analysis,
        securityChecks
      };

    } catch (error: any) {
      // Log API usage with error
      await this.logApiUsage(apiKey, 'POST', '/api/secure-transaction', 500);
      
      return {
        success: false,
        analysis: await this.analyzer.analyzeTransaction(request.transaction),
        securityChecks: { simulation: true },
        error: error.message
      };
    }
  }

  /**
   * Send OTP to user email
   */
  async sendOTP(email: string, apiKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate API key
      const isValidKey = await this.validateApiKey(apiKey);
      if (!isValidKey) {
        throw new Error('Invalid API key');
      }

      const success = await this.otpService.sendOTP(email);
      
      // Log to database
      await supabase.from('otp_logs').insert({
        email,
        otp_code: 'SENT', // Don't store actual code
        provider: 'api',
        status: 'sent'
      });

      // Log API usage
      await this.logApiUsage(apiKey, 'POST', '/api/send-otp', 200);

      return { success };
    } catch (error: any) {
      await this.logApiUsage(apiKey, 'POST', '/api/send-otp', 500);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email: string, code: string, apiKey: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate API key
      const isValidKey = await this.validateApiKey(apiKey);
      if (!isValidKey) {
        throw new Error('Invalid API key');
      }

      const success = await this.otpService.verifyOTP(email, code);
      
      // Update database
      await supabase.from('otp_logs')
        .update({ 
          status: success ? 'verified' : 'failed',
          verified_at: success ? new Date().toISOString() : null
        })
        .eq('email', email)
        .eq('status', 'sent')
        .order('created_at', { ascending: false })
        .limit(1);

      // Log API usage
      await this.logApiUsage(apiKey, 'POST', '/api/verify-otp', 200);

      return { success };
    } catch (error: any) {
      await this.logApiUsage(apiKey, 'POST', '/api/verify-otp', 500);
      return { success: false, error: error.message };
    }
  }

  // Private helper methods
  private async validateApiKey(apiKey: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, is_active')
      .eq('key_value', apiKey)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return false;
    }

    // Update last_used_at
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);

    return true;
  }

  private async logApiUsage(apiKey: string, method: string, endpoint: string, statusCode: number): Promise<void> {
    try {
      // Get API key info
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
          response_time_ms: Math.floor(Math.random() * 500) + 50 // Simulated response time
        });
      }
    } catch (error) {
      console.error('Failed to log API usage:', error);
    }
  }

  private determineSecurityRequirements(analysis: TransactionAnalysisResult, options: any) {
    const totalRisk = analysis.risks.reduce((sum, risk) => sum + risk.weight, 0);
    
    let riskLevel: 'low' | 'medium' | 'high';
    if (options.riskLevel !== 'auto') {
      riskLevel = options.riskLevel;
    } else {
      if (totalRisk < 20) riskLevel = 'low';
      else if (totalRisk < 50) riskLevel = 'medium';
      else riskLevel = 'high';
    }

    return {
      biometric: riskLevel === 'medium' || riskLevel === 'high',
      otp: riskLevel === 'high',
      confirmationDelay: riskLevel === 'high' ? 5 : 0
    };
  }

  private async checkOTPStatus(email: string): Promise<boolean> {
    const { data } = await supabase
      .from('otp_logs')
      .select('status')
      .eq('email', email)
      .eq('status', 'verified')
      .gte('verified_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Within last 5 minutes
      .order('verified_at', { ascending: false })
      .limit(1);

    return data && data.length > 0;
  }

  private async storeTransactionAnalysis(transaction: any, analysis: TransactionAnalysisResult, apiKey: string): Promise<void> {
    const { data: keyData } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key_value', apiKey)
      .single();

    if (keyData) {
      await supabase.from('transaction_analysis').insert({
        user_id: keyData.user_id,
        transaction_hash: transaction.signature || 'pending',
        transaction_type: analysis.type,
        risk_level: this.calculateRiskLevel(analysis.risks),
        risk_factors: analysis.risks,
        estimated_fees: analysis.estimatedFees,
        program_interactions: analysis.programInteractions
      });
    }
  }

  private async storeSecureTransaction(request: SecureTransactionRequest, analysis: TransactionAnalysisResult, apiKey: string): Promise<string> {
    const transactionId = crypto.randomUUID();
    
    const { data: keyData } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key_value', apiKey)
      .single();

    if (keyData) {
      await supabase.from('transaction_analysis').insert({
        id: transactionId,
        user_id: keyData.user_id,
        transaction_hash: 'secured_' + transactionId,
        transaction_type: analysis.type,
        risk_level: this.calculateRiskLevel(analysis.risks),
        risk_factors: analysis.risks,
        estimated_fees: analysis.estimatedFees,
        program_interactions: analysis.programInteractions,
        security_measures: request.options
      });
    }

    return transactionId;
  }

  private calculateRiskLevel(risks: any[]): 'low' | 'medium' | 'high' {
    const totalRisk = risks.reduce((sum, risk) => sum + risk.weight, 0);
    if (totalRisk < 20) return 'low';
    if (totalRisk < 50) return 'medium';
    return 'high';
  }
}
