
import { PublicKey, Transaction } from '@solana/web3.js';

export interface WalletToken {
  mint: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  logoURI?: string;
}

export interface TransactionRecord {
  signature: string;
  timestamp: number;
  type: 'send' | 'receive';
  amount: number;
  token: string;
  from: string;
  to: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface SecurityOptions {
  simulate: boolean;
  biometric: boolean;
  pin: boolean;
  otp: boolean;
  timeLockThreshold?: number;
  emailAddress?: string;
}

export interface RiskAnalysis {
  level: 'safe' | 'medium' | 'high';
  score: number;
  reasons: string[];
  recommendation: string;
}

export interface GuardianTransaction extends Transaction {
  guardianMetadata?: {
    riskAnalysis?: RiskAnalysis;
    securityChecks?: string[];
    scheduledAt?: Date;
  };
}
