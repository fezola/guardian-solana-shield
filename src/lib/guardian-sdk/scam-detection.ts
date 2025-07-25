/**
 * Scam Detection Engine
 * Real-time scam and malicious contract detection
 */

import { Transaction, PublicKey } from '@solana/web3.js';
import { ScamCheckResult, RiskFactor, ScamDatabase } from './types';

export class ScamDetectionEngine {
  private scamDatabase: ScamDatabase;
  private suspiciousPatterns: RegExp[];
  private knownScamPrograms: Set<string>;

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Known scam addresses (this would be loaded from a real database)
    this.scamDatabase = {
      addresses: new Set([
        // Known scam token mints
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // Fake token program
        '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Known drainer
        'HQ2UUt18uJqKaQFJhgV9zaTdQxUZjNrsKFgoEDquBkcx', // Suspicious program
        // Add more known scam addresses
      ]),
      patterns: [
        /.*drain.*/i,
        /.*scam.*/i,
        /.*fake.*/i,
        /.*phish.*/i,
        /.*steal.*/i,
      ],
      lastUpdated: new Date()
    };

    this.suspiciousPatterns = [
      // Patterns that indicate potential scams
      /approve.*unlimited/i,
      /transfer.*all/i,
      /drain.*wallet/i,
      /emergency.*withdraw/i,
    ];

    this.knownScamPrograms = new Set([
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // Fake token program
      '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Known malicious program
    ]);
  }

  /**
   * Check transaction for scam indicators
   */
  async checkTransaction(transaction: Transaction): Promise<ScamCheckResult> {
    const risks: RiskFactor[] = [];
    const knownScamAddresses: string[] = [];
    const suspiciousPatterns: string[] = [];

    try {
      // Check all accounts in transaction
      const accounts = this.extractAccountsFromTransaction(transaction);
      
      for (const account of accounts) {
        const accountStr = account.toString();
        
        // Check against known scam database
        if (this.scamDatabase.addresses.has(accountStr)) {
          knownScamAddresses.push(accountStr);
          risks.push({
            type: 'known_scam_address',
            severity: 'high',
            description: `Interaction with known scam address: ${accountStr}`,
            weight: 50
          });
        }

        // Check for suspicious patterns in account address
        for (const pattern of this.scamDatabase.patterns) {
          if (pattern.test(accountStr)) {
            suspiciousPatterns.push(pattern.source);
            risks.push({
              type: 'suspicious_pattern',
              severity: 'medium',
              description: `Address matches suspicious pattern: ${pattern.source}`,
              weight: 25
            });
          }
        }
      }

      // Check program interactions
      const programRisks = await this.checkProgramInteractions(transaction);
      risks.push(...programRisks);

      // Check transaction structure for suspicious patterns
      const structureRisks = this.analyzeTransactionStructure(transaction);
      risks.push(...structureRisks);

      // Check for token approval risks
      const approvalRisks = this.checkTokenApprovals(transaction);
      risks.push(...approvalRisks);

      // Calculate overall scam confidence
      const confidence = this.calculateScamConfidence(risks);
      const isScam = confidence > 0.7; // 70% confidence threshold

      return {
        isScam,
        confidence,
        risks,
        knownScamAddresses,
        suspiciousPatterns
      };

    } catch (error) {
      console.error('Error in scam detection:', error);
      return {
        isScam: false,
        confidence: 0,
        risks: [{
          type: 'analysis_error',
          severity: 'low',
          description: 'Unable to complete scam analysis',
          weight: 5
        }],
        knownScamAddresses: [],
        suspiciousPatterns: []
      };
    }
  }

  /**
   * Update scam database with new threats
   */
  async updateScamDatabase(newScamAddresses: string[], newPatterns: string[]) {
    // Add new scam addresses
    newScamAddresses.forEach(address => {
      this.scamDatabase.addresses.add(address);
    });

    // Add new suspicious patterns
    newPatterns.forEach(pattern => {
      this.scamDatabase.patterns.push(new RegExp(pattern, 'i'));
    });

    this.scamDatabase.lastUpdated = new Date();
  }

  /**
   * Report a new scam address
   */
  async reportScam(address: string, evidence: string): Promise<boolean> {
    try {
      // In a real implementation, this would report to a central database
      this.scamDatabase.addresses.add(address);
      console.log(`Reported scam address: ${address}, Evidence: ${evidence}`);
      return true;
    } catch (error) {
      console.error('Error reporting scam:', error);
      return false;
    }
  }

  private extractAccountsFromTransaction(transaction: Transaction): PublicKey[] {
    const accounts = new Set<string>();
    
    transaction.instructions.forEach(instruction => {
      // Add program ID
      accounts.add(instruction.programId.toString());
      
      // Add all account keys
      instruction.keys.forEach(key => {
        accounts.add(key.pubkey.toString());
      });
    });

    return Array.from(accounts).map(addr => new PublicKey(addr));
  }

  private async checkProgramInteractions(transaction: Transaction): Promise<RiskFactor[]> {
    const risks: RiskFactor[] = [];
    
    transaction.instructions.forEach(instruction => {
      const programId = instruction.programId.toString();
      
      // Check against known malicious programs
      if (this.knownScamPrograms.has(programId)) {
        risks.push({
          type: 'malicious_program',
          severity: 'high',
          description: `Interaction with known malicious program: ${programId}`,
          weight: 40
        });
      }

      // Check for unverified programs with suspicious behavior
      if (this.isUnverifiedProgram(programId)) {
        risks.push({
          type: 'unverified_program',
          severity: 'medium',
          description: `Interaction with unverified program: ${programId}`,
          weight: 20
        });
      }
    });

    return risks;
  }

  private analyzeTransactionStructure(transaction: Transaction): RiskFactor[] {
    const risks: RiskFactor[] = [];
    
    // Check for unusually complex transactions
    if (transaction.instructions.length > 10) {
      risks.push({
        type: 'complex_transaction',
        severity: 'medium',
        description: `Transaction has ${transaction.instructions.length} instructions (unusually complex)`,
        weight: 15
      });
    }

    // Check for suspicious instruction patterns
    const instructionData = transaction.instructions.map(ix => ix.data);
    
    // Look for patterns that might indicate draining behavior
    const hasMultipleTransfers = instructionData.filter(data => 
      this.looksLikeTransferInstruction(data)
    ).length > 5;

    if (hasMultipleTransfers) {
      risks.push({
        type: 'multiple_transfers',
        severity: 'high',
        description: 'Transaction contains multiple transfer instructions (potential draining)',
        weight: 35
      });
    }

    return risks;
  }

  private checkTokenApprovals(transaction: Transaction): RiskFactor[] {
    const risks: RiskFactor[] = [];
    
    transaction.instructions.forEach(instruction => {
      // Check for unlimited token approvals
      if (this.looksLikeUnlimitedApproval(instruction.data)) {
        risks.push({
          type: 'unlimited_approval',
          severity: 'high',
          description: 'Transaction contains unlimited token approval',
          weight: 45
        });
      }
    });

    return risks;
  }

  private calculateScamConfidence(risks: RiskFactor[]): number {
    if (risks.length === 0) return 0;
    
    const totalWeight = risks.reduce((sum, risk) => sum + risk.weight, 0);
    const maxPossibleWeight = 100; // Normalize to 0-1 scale
    
    return Math.min(totalWeight / maxPossibleWeight, 1);
  }

  private isUnverifiedProgram(programId: string): boolean {
    // List of known verified programs
    const verifiedPrograms = new Set([
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // SPL Token
      '11111111111111111111111111111111', // System Program
      'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL', // Associated Token
      // Add more verified programs
    ]);

    return !verifiedPrograms.has(programId);
  }

  private looksLikeTransferInstruction(data: Buffer): boolean {
    // Simple heuristic - in a real implementation, this would parse instruction data
    return data.length > 0 && data[0] === 3; // Transfer instruction discriminator
  }

  private looksLikeUnlimitedApproval(data: Buffer): boolean {
    // Check for patterns that indicate unlimited approvals
    // This is a simplified check - real implementation would parse the instruction
    if (data.length < 8) return false;
    
    // Check for max uint64 value (unlimited approval)
    const amount = data.readBigUInt64LE(0);
    return amount === BigInt('18446744073709551615'); // Max uint64
  }
}
