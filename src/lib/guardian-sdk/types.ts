/**
 * GuardianLayer SDK Types
 */

import { PublicKey, Transaction } from '@solana/web3.js';

export interface GuardianConfig {
  apiKey?: string;
  rpcUrl?: string;
  environment?: 'development' | 'staging' | 'production';
  modules?: string[];
  emailConfig?: EmailConfig;
}

export interface EmailConfig {
  provider: 'supabase' | 'sendgrid' | 'resend';
  apiKey?: string;
  fromEmail?: string;
}

export interface SecurityOptions {
  simulate: boolean;
  biometric: boolean;
  pin: boolean;
  otp: boolean;
  otpCode?: string;
  timeLockThreshold?: number;
  emailAddress?: string;
  bypassWarnings?: boolean;
}

export interface RiskAnalysis {
  level: 'safe' | 'medium' | 'high';
  score: number;
  reasons: string[];
  recommendation: string;
  details?: {
    scamCheck: ScamCheckResult;
    transactionAnalysis: TransactionAnalysisResult;
    accountRisks: AccountRisk[];
  };
}

export interface ScamCheckResult {
  isScam: boolean;
  confidence: number;
  risks: RiskFactor[];
  knownScamAddresses: string[];
  suspiciousPatterns: string[];
}

export interface TransactionAnalysisResult {
  type: TransactionType;
  estimatedFees: number;
  slippage?: number;
  risks: RiskFactor[];
  programInteractions: ProgramInteraction[];
}

export interface AccountRisk {
  address: string;
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
  isKnownScam: boolean;
  lastActivity?: Date;
}

export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  weight: number;
}

export interface ProgramInteraction {
  programId: string;
  programName?: string;
  isVerified: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}

export interface BiometricResult {
  success: boolean;
  error?: string;
  credentialId?: string;
}

export interface OTPResult {
  sent: boolean;
  expiresAt?: Date;
  error?: string;
}

export enum TransactionType {
  TRANSFER = 'transfer',
  TOKEN_TRANSFER = 'token_transfer',
  SWAP = 'swap',
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  NFT_MINT = 'nft_mint',
  NFT_TRANSFER = 'nft_transfer',
  PROGRAM_INTERACTION = 'program_interaction',
  UNKNOWN = 'unknown'
}

export interface ScamDatabase {
  addresses: Set<string>;
  patterns: RegExp[];
  lastUpdated: Date;
}

export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  verified: boolean;
  tags?: string[];
}

export interface WalletToken {
  mint: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  logoURI?: string;
  usdValue?: number;
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
  fees?: number;
  riskLevel?: 'safe' | 'medium' | 'high';
}

export interface GuardianTransaction {
  transaction: Transaction;
  metadata: {
    type: TransactionType;
    amount?: number;
    token?: string;
    recipient?: string;
    estimatedFees: number;
  };
}

// WebAuthn Types
export interface WebAuthnCredential {
  id: string;
  publicKey: ArrayBuffer;
  algorithm: number;
}

export interface AuthenticationOptions {
  challenge: ArrayBuffer;
  timeout?: number;
  userVerification?: 'required' | 'preferred' | 'discouraged';
}

export interface RegistrationOptions {
  challenge: ArrayBuffer;
  user: {
    id: ArrayBuffer;
    name: string;
    displayName: string;
  };
  timeout?: number;
}

// Error Types
export class GuardianError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GuardianError';
  }
}

export class SecurityError extends GuardianError {
  constructor(message: string, details?: any) {
    super(message, 'SECURITY_ERROR', details);
    this.name = 'SecurityError';
  }
}

export class BiometricError extends GuardianError {
  constructor(message: string, details?: any) {
    super(message, 'BIOMETRIC_ERROR', details);
    this.name = 'BiometricError';
  }
}

export class OTPError extends GuardianError {
  constructor(message: string, details?: any) {
    super(message, 'OTP_ERROR', details);
    this.name = 'OTPError';
  }
}

// Configuration Types
export interface GuardianModuleConfig {
  txSecurity: {
    enabled: boolean;
    riskThreshold: number;
    autoBlock: boolean;
  };
  recovery: {
    enabled: boolean;
    guardians: string[];
    threshold: number;
  };
  biometric: {
    enabled: boolean;
    requireForHighValue: boolean;
    valueThreshold: number;
  };
  otp: {
    enabled: boolean;
    provider: 'email' | 'sms';
    expiryMinutes: number;
  };
}

export interface SecurityEvent {
  id: string;
  type: 'risk_detected' | 'auth_failed' | 'suspicious_activity' | 'scam_blocked';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  walletAddress?: string;
  transactionHash?: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: Record<string, any>;
}
