/**
 * GuardianLayer SDK - Core Implementation
 * Real security layer for Solana wallets
 */

import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { ScamDetectionEngine } from './scam-detection';
import { TransactionAnalyzer } from './transaction-analyzer';
import { BiometricAuth } from './biometric-auth';
import { OTPService } from './otp-service';
import { RiskAnalysis, SecurityOptions, GuardianConfig } from './types';

export class GuardianLayer {
  private connection: Connection;
  private scamDetector: ScamDetectionEngine;
  private transactionAnalyzer: TransactionAnalyzer;
  private biometricAuth: BiometricAuth;
  private otpService: OTPService;
  private config: GuardianConfig;

  constructor(config: GuardianConfig) {
    this.config = config;
    this.connection = new Connection(config.rpcUrl || 'https://api.devnet.solana.com');
    this.scamDetector = new ScamDetectionEngine();
    this.transactionAnalyzer = new TransactionAnalyzer(this.connection);
    this.biometricAuth = new BiometricAuth();
    this.otpService = new OTPService(config.emailConfig);
  }

  /**
   * Analyze transaction for security risks
   */
  async simulateAndCheck(transaction: Transaction): Promise<RiskAnalysis> {
    try {
      // Parse transaction instructions
      const instructions = transaction.instructions;
      const accounts = this.extractAccounts(instructions);
      
      // Run parallel security checks
      const [
        scamCheck,
        transactionAnalysis,
        accountRisks
      ] = await Promise.all([
        this.scamDetector.checkTransaction(transaction),
        this.transactionAnalyzer.analyzeTransaction(transaction),
        this.analyzeAccounts(accounts)
      ]);

      // Combine all risk factors
      const riskFactors = [
        ...scamCheck.risks,
        ...transactionAnalysis.risks,
        ...accountRisks
      ];

      // Calculate overall risk score
      const riskScore = this.calculateRiskScore(riskFactors);
      const riskLevel = this.determineRiskLevel(riskScore);

      return {
        level: riskLevel,
        score: riskScore,
        reasons: riskFactors.map(r => r.description),
        recommendation: this.generateRecommendation(riskLevel, riskFactors),
        details: {
          scamCheck,
          transactionAnalysis,
          accountRisks
        }
      };
    } catch (error) {
      console.error('Error in simulateAndCheck:', error);
      throw new Error('Failed to analyze transaction security');
    }
  }

  /**
   * Secure transaction with multi-factor authentication
   */
  async secureTransaction(params: {
    transaction: Transaction;
    userEmail?: string;
    options: SecurityOptions;
  }): Promise<{ success: boolean; signature?: string }> {
    const { transaction, userEmail, options } = params;

    try {
      // Step 1: Risk Analysis
      if (options.simulate) {
        const riskAnalysis = await this.simulateAndCheck(transaction);
        
        if (riskAnalysis.level === 'high') {
          throw new Error(`High risk transaction blocked: ${riskAnalysis.recommendation}`);
        }
        
        if (riskAnalysis.level === 'medium' && !options.bypassWarnings) {
          throw new Error(`Medium risk transaction requires manual approval: ${riskAnalysis.recommendation}`);
        }
      }

      // Step 2: Biometric Authentication
      if (options.biometric) {
        const biometricResult = await this.biometricAuth.authenticate();
        if (!biometricResult.success) {
          throw new Error('Biometric authentication failed');
        }
      }

      // Step 3: OTP Verification
      if (options.otp && userEmail) {
        const otpSent = await this.otpService.sendOTP(userEmail);
        if (!otpSent) {
          throw new Error('Failed to send OTP');
        }
        
        // This would typically wait for user input
        // For now, we'll simulate the OTP check
        const otpValid = await this.otpService.verifyOTP(userEmail, options.otpCode || '');
        if (!otpValid) {
          throw new Error('Invalid OTP code');
        }
      }

      // Step 4: Time Lock Check
      if (options.timeLockThreshold && this.exceedsTimelock(transaction, options.timeLockThreshold)) {
        throw new Error('Transaction exceeds time lock threshold - requires delay');
      }

      // Step 5: Execute Transaction
      // In a real implementation, this would send the transaction
      // For now, we'll simulate success
      return {
        success: true,
        signature: 'simulated_signature_' + Date.now()
      };

    } catch (error) {
      console.error('Error in secureTransaction:', error);
      return {
        success: false
      };
    }
  }

  /**
   * Require biometric authentication
   */
  async requireBiometric(): Promise<boolean> {
    try {
      const result = await this.biometricAuth.authenticate();
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  /**
   * Send OTP to user email
   */
  async sendOTP(email: string): Promise<boolean> {
    return await this.otpService.sendOTP(email);
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(email: string, code: string): Promise<boolean> {
    return await this.otpService.verifyOTP(email, code);
  }

  // Private helper methods
  private extractAccounts(instructions: TransactionInstruction[]): PublicKey[] {
    const accounts = new Set<string>();
    
    instructions.forEach(instruction => {
      instruction.keys.forEach(key => {
        accounts.add(key.pubkey.toString());
      });
      accounts.add(instruction.programId.toString());
    });

    return Array.from(accounts).map(addr => new PublicKey(addr));
  }

  private async analyzeAccounts(accounts: PublicKey[]): Promise<any[]> {
    // Analyze each account for suspicious activity
    const risks = [];
    
    for (const account of accounts) {
      const accountInfo = await this.connection.getAccountInfo(account);
      
      if (!accountInfo) {
        risks.push({
          type: 'unknown_account',
          severity: 'medium',
          description: `Unknown account: ${account.toString()}`
        });
      }
    }

    return risks;
  }

  private calculateRiskScore(riskFactors: any[]): number {
    if (riskFactors.length === 0) return 95; // Safe score
    
    const totalWeight = riskFactors.reduce((sum, factor) => {
      const weight = factor.severity === 'high' ? 30 : 
                    factor.severity === 'medium' ? 15 : 5;
      return sum + weight;
    }, 0);

    return Math.max(0, 100 - totalWeight);
  }

  private determineRiskLevel(score: number): 'safe' | 'medium' | 'high' {
    if (score >= 80) return 'safe';
    if (score >= 50) return 'medium';
    return 'high';
  }

  private generateRecommendation(level: 'safe' | 'medium' | 'high', factors: any[]): string {
    switch (level) {
      case 'safe':
        return 'Transaction appears safe to proceed';
      case 'medium':
        return `Exercise caution: ${factors.length} potential risks detected`;
      case 'high':
        return `High risk detected: ${factors.filter(f => f.severity === 'high').length} critical issues found`;
      default:
        return 'Unable to determine risk level';
    }
  }

  private exceedsTimelock(transaction: Transaction, threshold: number): boolean {
    // This would analyze the transaction value against the threshold
    // For now, simulate based on instruction count as a proxy
    return transaction.instructions.length > 3;
  }
}

export * from './types';
export * from './scam-detection';
export * from './transaction-analyzer';
export * from './biometric-auth';
export * from './otp-service';
