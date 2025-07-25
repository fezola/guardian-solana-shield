/**
 * Transaction Analyzer
 * Analyzes Solana transactions for security risks and patterns
 */

import { Connection, Transaction, PublicKey, AccountInfo } from '@solana/web3.js';
import { TransactionAnalysisResult, RiskFactor, TransactionType, ProgramInteraction } from './types';

export class TransactionAnalyzer {
  private connection: Connection;
  private programRegistry: Map<string, ProgramInfo>;

  constructor(connection: Connection) {
    this.connection = connection;
    this.initializeProgramRegistry();
  }

  private initializeProgramRegistry() {
    this.programRegistry = new Map([
      ['11111111111111111111111111111111', {
        name: 'System Program',
        verified: true,
        riskLevel: 'low',
        description: 'Core Solana system program'
      }],
      ['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', {
        name: 'SPL Token Program',
        verified: true,
        riskLevel: 'low',
        description: 'Standard token program'
      }],
      ['ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL', {
        name: 'Associated Token Program',
        verified: true,
        riskLevel: 'low',
        description: 'Associated token account program'
      }],
      ['9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', {
        name: 'Jupiter Aggregator',
        verified: true,
        riskLevel: 'low',
        description: 'DEX aggregator for token swaps'
      }],
      // Add more known programs
    ]);
  }

  /**
   * Analyze transaction for security risks and patterns
   */
  async analyzeTransaction(transaction: Transaction): Promise<TransactionAnalysisResult> {
    try {
      const risks: RiskFactor[] = [];
      const programInteractions: ProgramInteraction[] = [];

      // Determine transaction type
      const transactionType = this.determineTransactionType(transaction);

      // Analyze program interactions
      for (const instruction of transaction.instructions) {
        const programId = instruction.programId.toString();
        const programInfo = this.programRegistry.get(programId);
        
        const interaction: ProgramInteraction = {
          programId,
          programName: programInfo?.name || 'Unknown Program',
          isVerified: programInfo?.verified || false,
          riskLevel: programInfo?.riskLevel || 'medium',
          description: programInfo?.description || 'Unverified program interaction'
        };

        programInteractions.push(interaction);

        // Add risk factors for unverified programs
        if (!programInfo?.verified) {
          risks.push({
            type: 'unverified_program',
            severity: 'medium',
            description: `Interaction with unverified program: ${programId}`,
            weight: 20
          });
        }
      }

      // Analyze account access patterns
      const accountRisks = await this.analyzeAccountAccess(transaction);
      risks.push(...accountRisks);

      // Analyze transaction size and complexity
      const complexityRisks = this.analyzeComplexity(transaction);
      risks.push(...complexityRisks);

      // Estimate fees
      const estimatedFees = await this.estimateFees(transaction);

      // Calculate slippage for swap transactions
      let slippage: number | undefined;
      if (transactionType === TransactionType.SWAP) {
        slippage = await this.calculateSlippage(transaction);
      }

      return {
        type: transactionType,
        estimatedFees,
        slippage,
        risks,
        programInteractions
      };

    } catch (error) {
      console.error('Error analyzing transaction:', error);
      return {
        type: TransactionType.UNKNOWN,
        estimatedFees: 0,
        risks: [{
          type: 'analysis_error',
          severity: 'low',
          description: 'Failed to analyze transaction',
          weight: 5
        }],
        programInteractions: []
      };
    }
  }

  /**
   * Determine the type of transaction based on instructions
   */
  private determineTransactionType(transaction: Transaction): TransactionType {
    const instructions = transaction.instructions;
    
    // Check for system program transfers
    const hasSystemTransfer = instructions.some(ix => 
      ix.programId.toString() === '11111111111111111111111111111111' &&
      ix.data.length > 0 && ix.data[0] === 2 // Transfer instruction
    );

    if (hasSystemTransfer) {
      return TransactionType.TRANSFER;
    }

    // Check for token transfers
    const hasTokenTransfer = instructions.some(ix =>
      ix.programId.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' &&
      ix.data.length > 0 && ix.data[0] === 3 // Transfer instruction
    );

    if (hasTokenTransfer) {
      return TransactionType.TOKEN_TRANSFER;
    }

    // Check for swap patterns (multiple token operations)
    const tokenInstructions = instructions.filter(ix =>
      ix.programId.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );

    if (tokenInstructions.length >= 2) {
      return TransactionType.SWAP;
    }

    // Check for staking operations
    const hasStakeProgram = instructions.some(ix =>
      ix.programId.toString() === 'Stake11111111111111111111111111111111111111'
    );

    if (hasStakeProgram) {
      return TransactionType.STAKE;
    }

    return TransactionType.UNKNOWN;
  }

  /**
   * Analyze account access patterns for suspicious behavior
   */
  private async analyzeAccountAccess(transaction: Transaction): Promise<RiskFactor[]> {
    const risks: RiskFactor[] = [];
    const accountsAccessed = new Set<string>();

    // Collect all accounts accessed
    transaction.instructions.forEach(instruction => {
      instruction.keys.forEach(key => {
        accountsAccessed.add(key.pubkey.toString());
      });
    });

    // Check for excessive account access
    if (accountsAccessed.size > 20) {
      risks.push({
        type: 'excessive_account_access',
        severity: 'medium',
        description: `Transaction accesses ${accountsAccessed.size} accounts (potentially suspicious)`,
        weight: 15
      });
    }

    // Check for write access to many accounts
    const writableAccounts = new Set<string>();
    transaction.instructions.forEach(instruction => {
      instruction.keys.forEach(key => {
        if (key.isSigner || key.isWritable) {
          writableAccounts.add(key.pubkey.toString());
        }
      });
    });

    if (writableAccounts.size > 10) {
      risks.push({
        type: 'excessive_write_access',
        severity: 'high',
        description: `Transaction has write access to ${writableAccounts.size} accounts`,
        weight: 25
      });
    }

    return risks;
  }

  /**
   * Analyze transaction complexity
   */
  private analyzeComplexity(transaction: Transaction): RiskFactor[] {
    const risks: RiskFactor[] = [];
    const instructionCount = transaction.instructions.length;

    // Check for unusually complex transactions
    if (instructionCount > 15) {
      risks.push({
        type: 'high_complexity',
        severity: 'medium',
        description: `Transaction has ${instructionCount} instructions (high complexity)`,
        weight: 20
      });
    }

    // Check for very simple transactions that might be suspicious
    if (instructionCount === 1) {
      const instruction = transaction.instructions[0];
      if (instruction.data.length > 1000) {
        risks.push({
          type: 'large_instruction_data',
          severity: 'medium',
          description: 'Single instruction with large data payload',
          weight: 15
        });
      }
    }

    return risks;
  }

  /**
   * Estimate transaction fees
   */
  private async estimateFees(transaction: Transaction): Promise<number> {
    try {
      // Get recent blockhash for fee calculation
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // Estimate fees based on transaction size and current fee rates
      const message = transaction.compileMessage();
      const feeCalculator = await this.connection.getFeeForMessage(message);
      
      return feeCalculator?.value || 5000; // Default to 5000 lamports if estimation fails
    } catch (error) {
      console.error('Error estimating fees:', error);
      return 5000; // Default fee
    }
  }

  /**
   * Calculate slippage for swap transactions
   */
  private async calculateSlippage(transaction: Transaction): Promise<number> {
    try {
      // This is a simplified slippage calculation
      // In a real implementation, this would analyze the specific DEX and token pair
      
      // For now, return a mock slippage based on transaction complexity
      const instructionCount = transaction.instructions.length;
      
      if (instructionCount > 10) {
        return 0.05; // 5% slippage for complex swaps
      } else if (instructionCount > 5) {
        return 0.02; // 2% slippage for medium complexity
      } else {
        return 0.01; // 1% slippage for simple swaps
      }
    } catch (error) {
      console.error('Error calculating slippage:', error);
      return 0.03; // Default 3% slippage
    }
  }

  /**
   * Get detailed program information
   */
  async getProgramInfo(programId: string): Promise<ProgramInfo | null> {
    try {
      // Check local registry first
      const localInfo = this.programRegistry.get(programId);
      if (localInfo) {
        return localInfo;
      }

      // Fetch program account info
      const accountInfo = await this.connection.getAccountInfo(new PublicKey(programId));
      
      if (!accountInfo) {
        return null;
      }

      // Analyze program account to determine if it's executable, etc.
      const isExecutable = accountInfo.executable;
      
      return {
        name: 'Unknown Program',
        verified: false,
        riskLevel: isExecutable ? 'medium' : 'high',
        description: `${isExecutable ? 'Executable' : 'Non-executable'} program account`
      };

    } catch (error) {
      console.error('Error getting program info:', error);
      return null;
    }
  }
}

interface ProgramInfo {
  name: string;
  verified: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}
