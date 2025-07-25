# GuardianLayer SDK Documentation

## Overview

GuardianLayer is a comprehensive security SDK for Solana applications that provides real-time transaction analysis, scam detection, biometric authentication, and multi-factor security features. This SDK transforms your Solana wallet or dApp into a fortress against malicious activities while maintaining the decentralized nature of blockchain interactions.

## 🚀 Quick Start

### Installation

```bash
npm install @guardianlayer/sdk
# or
yarn add @guardianlayer/sdk
```

### Basic Setup

```typescript
import { GuardianLayer } from '@guardianlayer/sdk';

const guardian = new GuardianLayer({
  rpcUrl: 'https://api.mainnet-beta.solana.com',
  environment: 'production',
  modules: ['txSecurity', 'recovery', 'biometric', 'otp']
});
```

## 🛡️ Core Features

### 1. Transaction Security Analysis

Real-time analysis of Solana transactions to detect:
- Known scam contracts and addresses
- Suspicious transaction patterns
- Unlimited token approvals
- Complex multi-instruction attacks
- Unverified program interactions

```typescript
// Analyze transaction before execution
const transaction = createYourTransaction();
const analysis = await guardian.simulateAndCheck(transaction);

if (analysis.level === 'high') {
  console.log('⚠️ High risk detected:', analysis.recommendation);
  // Block or warn user
}
```

### 2. Multi-Factor Authentication

#### Biometric Authentication (WebAuthn)
```typescript
// Register biometric credential
const biometricResult = await guardian.biometricAuth.register({
  username: 'user@example.com',
  displayName: 'John Doe',
  userId: 'user-123'
});

// Authenticate with biometrics
const authenticated = await guardian.requireBiometric();
```

#### OTP (One-Time Password)
```typescript
// Send OTP via email
await guardian.sendOTP('user@example.com');

// Verify OTP
const isValid = await guardian.verifyOTP('user@example.com', '123456');
```

### 3. Secure Transaction Execution

```typescript
const result = await guardian.secureTransaction({
  transaction: yourTransaction,
  userEmail: 'user@example.com',
  options: {
    simulate: true,
    biometric: true,
    otp: true,
    timeLockThreshold: 10.0 // SOL
  }
});

if (result.success) {
  console.log('✅ Transaction secured:', result.signature);
}
```

## 📋 Configuration Options

### GuardianConfig

```typescript
interface GuardianConfig {
  apiKey?: string;                    // Your GuardianLayer API key
  rpcUrl?: string;                    // Solana RPC endpoint
  environment?: 'development' | 'staging' | 'production';
  modules?: string[];                 // Enabled security modules
  emailConfig?: EmailConfig;          // Email provider configuration
}
```

### Security Options

```typescript
interface SecurityOptions {
  simulate: boolean;                  // Enable transaction simulation
  biometric: boolean;                 // Require biometric auth
  pin: boolean;                      // Require PIN verification
  otp: boolean;                      // Require OTP verification
  timeLockThreshold?: number;        // Time lock threshold in SOL
  emailAddress?: string;             // User email for OTP
  bypassWarnings?: boolean;          // Allow bypassing medium risk warnings
}
```

## 🔧 Advanced Usage

### Custom Scam Detection

```typescript
// Report new scam address
await guardian.scamDetector.reportScam(
  'ScamAddress123...',
  'Token drainer contract'
);

// Update scam database
await guardian.scamDetector.updateScamDatabase(
  ['NewScamAddress1...', 'NewScamAddress2...'],
  ['.*phishing.*', '.*fake.*']
);
```

### Token Security Analysis

```typescript
import { TokenService } from '@guardianlayer/sdk';

const tokenService = new TokenService(connection);

// Get token security information
const security = await tokenService.getTokenSecurity('TokenMintAddress...');

console.log('Token risks:', security.risks);
console.log('Risk level:', security.riskLevel);
```

### Transaction Analysis Details

```typescript
const analysis = await guardian.simulateAndCheck(transaction);

// Access detailed analysis
console.log('Scam check:', analysis.details.scamCheck);
console.log('Program interactions:', analysis.details.transactionAnalysis.programInteractions);
console.log('Account risks:', analysis.details.accountRisks);
```

## 🧪 Testing

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Example Test

```typescript
import { GuardianLayer } from '@guardianlayer/sdk';
import { Transaction, SystemProgram, Keypair } from '@solana/web3.js';

describe('GuardianLayer', () => {
  it('should analyze safe transactions correctly', async () => {
    const guardian = new GuardianLayer({
      environment: 'development'
    });

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: Keypair.generate().publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1000000
      })
    );

    const result = await guardian.simulateAndCheck(transaction);
    
    expect(result.level).toBe('safe');
    expect(result.score).toBeGreaterThan(80);
  });
});
```

## 🔌 Integration Examples

### React Hook

```typescript
import { useGuardian } from '@guardianlayer/react';

function SecureWallet() {
  const { guardian, analyzeTransaction, secureTransaction } = useGuardian({
    rpcUrl: 'https://api.mainnet-beta.solana.com'
  });

  const handleSendTransaction = async (transaction) => {
    const analysis = await analyzeTransaction(transaction);
    
    if (analysis.level === 'safe') {
      await secureTransaction(transaction, {
        simulate: true,
        biometric: true
      });
    }
  };

  return (
    <div>
      {/* Your wallet UI */}
    </div>
  );
}
```

### Next.js API Route

```typescript
// pages/api/analyze-transaction.ts
import { GuardianLayer } from '@guardianlayer/sdk';

const guardian = new GuardianLayer({
  apiKey: process.env.GUARDIAN_API_KEY,
  environment: 'production'
});

export default async function handler(req, res) {
  const { transaction } = req.body;
  
  try {
    const analysis = await guardian.simulateAndCheck(transaction);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

## 🚨 Error Handling

```typescript
import { GuardianError, SecurityError, BiometricError, OTPError } from '@guardianlayer/sdk';

try {
  await guardian.secureTransaction(transaction, options);
} catch (error) {
  if (error instanceof SecurityError) {
    console.log('Security check failed:', error.message);
  } else if (error instanceof BiometricError) {
    console.log('Biometric auth failed:', error.message);
  } else if (error instanceof OTPError) {
    console.log('OTP verification failed:', error.message);
  }
}
```

## 📊 Monitoring and Analytics

### Security Events

```typescript
// Listen for security events
guardian.on('securityEvent', (event) => {
  console.log('Security event:', event.type, event.severity);
  
  // Send to your analytics service
  analytics.track('guardian_security_event', {
    type: event.type,
    severity: event.severity,
    walletAddress: event.walletAddress
  });
});
```

### Performance Metrics

```typescript
// Get analysis performance metrics
const metrics = await guardian.getMetrics();

console.log('Average analysis time:', metrics.averageAnalysisTime);
console.log('Blocked transactions:', metrics.blockedTransactions);
console.log('False positive rate:', metrics.falsePositiveRate);
```

## 🔒 Security Best Practices

1. **Never expose service keys** in client-side code
2. **Implement Row Level Security** in your database
3. **Use environment variables** for sensitive configuration
4. **Regularly update** the scam database
5. **Monitor security events** and respond to threats
6. **Test your integration** thoroughly before production

## 📚 API Reference

### Core Methods

- `simulateAndCheck(transaction)` - Analyze transaction security
- `secureTransaction(params)` - Execute secure transaction with MFA
- `requireBiometric()` - Require biometric authentication
- `sendOTP(email)` - Send OTP to email
- `verifyOTP(email, code)` - Verify OTP code

### Utility Methods

- `isTokenVerified(mintAddress)` - Check if token is verified
- `getTokenSecurity(mintAddress)` - Get token security info
- `reportScam(address, evidence)` - Report scam address

## 🤝 Support

- **Documentation**: [docs.guardianlayer.com](https://docs.guardianlayer.com)
- **Discord**: [discord.gg/guardianlayer](https://discord.gg/guardianlayer)
- **Email**: support@guardianlayer.com
- **GitHub**: [github.com/guardianlayer/sdk](https://github.com/guardianlayer/sdk)

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for the Solana ecosystem**
