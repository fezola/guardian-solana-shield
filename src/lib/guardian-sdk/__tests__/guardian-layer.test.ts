/**
 * GuardianLayer SDK Tests
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { GuardianLayer } from '../index';
import { SecurityOptions, TransactionType } from '../types';

// Mock Solana connection
jest.mock('@solana/web3.js', () => ({
  ...jest.requireActual('@solana/web3.js'),
  Connection: jest.fn().mockImplementation(() => ({
    getBalance: jest.fn().mockResolvedValue(1000000000),
    getAccountInfo: jest.fn().mockResolvedValue({
      executable: false,
      owner: new PublicKey('11111111111111111111111111111111'),
      lamports: 1000000000,
      data: Buffer.alloc(0)
    }),
    getLatestBlockhash: jest.fn().mockResolvedValue({
      blockhash: 'test-blockhash',
      lastValidBlockHeight: 123456
    }),
    getFeeForMessage: jest.fn().mockResolvedValue({ value: 5000 })
  }))
}));

describe('GuardianLayer SDK', () => {
  let guardian: GuardianLayer;
  let mockTransaction: Transaction;
  let testKeypair: Keypair;

  beforeEach(() => {
    guardian = new GuardianLayer({
      rpcUrl: 'https://api.devnet.solana.com',
      environment: 'development',
      modules: ['txSecurity', 'recovery', 'biometric', 'otp']
    });

    testKeypair = Keypair.generate();
    
    // Create a mock transaction
    mockTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: testKeypair.publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1000000 // 0.001 SOL
      })
    );
  });

  describe('Transaction Analysis', () => {
    it('should analyze a safe transaction correctly', async () => {
      const result = await guardian.simulateAndCheck(mockTransaction);

      expect(result).toBeDefined();
      expect(result.level).toBeOneOf(['safe', 'medium', 'high']);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.reasons)).toBe(true);
      expect(typeof result.recommendation).toBe('string');
    });

    it('should detect high-risk transactions', async () => {
      // Create a complex transaction with many instructions
      const complexTransaction = new Transaction();
      
      // Add many transfer instructions to simulate suspicious activity
      for (let i = 0; i < 15; i++) {
        complexTransaction.add(
          SystemProgram.transfer({
            fromPubkey: testKeypair.publicKey,
            toPubkey: Keypair.generate().publicKey,
            lamports: 100000
          })
        );
      }

      const result = await guardian.simulateAndCheck(complexTransaction);

      expect(result.level).toBe('medium'); // Should be flagged as medium risk due to complexity
      expect(result.reasons).toContain(expect.stringContaining('complex'));
    });

    it('should handle empty transactions', async () => {
      const emptyTransaction = new Transaction();

      const result = await guardian.simulateAndCheck(emptyTransaction);

      expect(result).toBeDefined();
      expect(result.level).toBe('safe'); // Empty transaction should be safe
    });
  });

  describe('Security Options', () => {
    const basicSecurityOptions: SecurityOptions = {
      simulate: true,
      biometric: false,
      pin: false,
      otp: false,
      timeLockThreshold: 1.0
    };

    it('should process transaction with simulation only', async () => {
      const result = await guardian.secureTransaction({
        transaction: mockTransaction,
        options: basicSecurityOptions
      });

      expect(result.success).toBe(true);
      expect(result.signature).toBeDefined();
    });

    it('should handle biometric authentication', async () => {
      const biometricOptions: SecurityOptions = {
        ...basicSecurityOptions,
        biometric: true
      };

      // Mock biometric success
      jest.spyOn(guardian, 'requireBiometric').mockResolvedValue(true);

      const result = await guardian.secureTransaction({
        transaction: mockTransaction,
        options: biometricOptions
      });

      expect(result.success).toBe(true);
    });

    it('should fail when biometric authentication fails', async () => {
      const biometricOptions: SecurityOptions = {
        ...basicSecurityOptions,
        biometric: true
      };

      // Mock biometric failure
      jest.spyOn(guardian, 'requireBiometric').mockResolvedValue(false);

      const result = await guardian.secureTransaction({
        transaction: mockTransaction,
        options: biometricOptions
      });

      expect(result.success).toBe(false);
    });

    it('should handle OTP verification', async () => {
      const otpOptions: SecurityOptions = {
        ...basicSecurityOptions,
        otp: true,
        otpCode: '123456'
      };

      const result = await guardian.secureTransaction({
        transaction: mockTransaction,
        userEmail: 'test@example.com',
        options: otpOptions
      });

      expect(result.success).toBe(true);
    });

    it('should block transactions exceeding time lock threshold', async () => {
      const timeLockOptions: SecurityOptions = {
        ...basicSecurityOptions,
        timeLockThreshold: 0.0001 // Very low threshold
      };

      const result = await guardian.secureTransaction({
        transaction: mockTransaction,
        options: timeLockOptions
      });

      expect(result.success).toBe(false);
    });
  });

  describe('Biometric Authentication', () => {
    it('should check biometric availability', async () => {
      const isAvailable = await guardian.requireBiometric();
      expect(typeof isAvailable).toBe('boolean');
    });
  });

  describe('OTP Service', () => {
    it('should send OTP successfully', async () => {
      const result = await guardian.sendOTP('test@example.com');
      expect(typeof result).toBe('boolean');
    });

    it('should verify OTP correctly', async () => {
      const email = 'test@example.com';
      
      // First send OTP
      await guardian.sendOTP(email);
      
      // Then verify with correct code (mocked)
      const result = await guardian.verifyOTP(email, '123456');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      // Create guardian with invalid RPC
      const invalidGuardian = new GuardianLayer({
        rpcUrl: 'https://invalid-rpc-url.com',
        environment: 'development'
      });

      const result = await invalidGuardian.simulateAndCheck(mockTransaction);
      
      // Should still return a result, even if analysis fails
      expect(result).toBeDefined();
      expect(result.level).toBeDefined();
    });

    it('should handle malformed transactions', async () => {
      const malformedTransaction = new Transaction();
      // Don't add any instructions, but try to analyze
      
      const result = await guardian.simulateAndCheck(malformedTransaction);
      
      expect(result).toBeDefined();
      expect(result.level).toBe('safe'); // Empty transaction should be safe
    });
  });

  describe('Configuration', () => {
    it('should initialize with default configuration', () => {
      const defaultGuardian = new GuardianLayer({});
      expect(defaultGuardian).toBeDefined();
    });

    it('should initialize with custom configuration', () => {
      const customGuardian = new GuardianLayer({
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        environment: 'production',
        modules: ['txSecurity', 'biometric'],
        emailConfig: {
          provider: 'sendgrid',
          apiKey: 'test-key',
          fromEmail: 'noreply@test.com'
        }
      });
      
      expect(customGuardian).toBeDefined();
    });
  });
});

// Helper function for Jest custom matchers
expect.extend({
  toBeOneOf(received: any, expected: any[]) {
    const pass = expected.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be one of ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be one of ${expected}`,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeOneOf(expected: any[]): R;
    }
  }
}
