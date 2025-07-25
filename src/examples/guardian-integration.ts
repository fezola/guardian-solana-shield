/**
 * GuardianLayer SDK Integration Examples
 * Complete examples showing how to integrate GuardianLayer into your Solana application
 */

import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { GuardianLayer } from '@/lib/guardian-sdk';
import { SecurityOptions, TransactionType } from '@/lib/guardian-sdk/types';

// Example 1: Basic Setup and Configuration
export async function basicSetup() {
  console.log('🛡️ GuardianLayer Basic Setup Example');
  
  // Initialize GuardianLayer with configuration
  const guardian = new GuardianLayer({
    rpcUrl: 'https://api.devnet.solana.com',
    environment: 'development',
    modules: ['txSecurity', 'recovery', 'biometric', 'otp'],
    emailConfig: {
      provider: 'supabase',
      fromEmail: 'noreply@yourapp.com'
    }
  });

  console.log('✅ GuardianLayer initialized successfully');
  return guardian;
}

// Example 2: Simple Transaction with Security Analysis
export async function secureSimpleTransfer() {
  console.log('🔒 Secure Simple Transfer Example');
  
  const guardian = await basicSetup();
  const connection = new Connection('https://api.devnet.solana.com');
  
  // Create wallet keypairs
  const fromKeypair = Keypair.generate();
  const toKeypair = Keypair.generate();
  
  // Create a simple transfer transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: 1000000 // 0.001 SOL
    })
  );

  try {
    // Step 1: Analyze transaction for security risks
    console.log('🔍 Analyzing transaction security...');
    const riskAnalysis = await guardian.simulateAndCheck(transaction);
    
    console.log(`Risk Level: ${riskAnalysis.level}`);
    console.log(`Risk Score: ${riskAnalysis.score}/100`);
    console.log(`Recommendation: ${riskAnalysis.recommendation}`);
    
    if (riskAnalysis.reasons.length > 0) {
      console.log('Risk Factors:');
      riskAnalysis.reasons.forEach((reason, index) => {
        console.log(`  ${index + 1}. ${reason}`);
      });
    }

    // Step 2: Proceed based on risk level
    if (riskAnalysis.level === 'high') {
      console.log('❌ Transaction blocked due to high risk');
      return;
    }

    // Step 3: Execute transaction if safe
    console.log('✅ Transaction appears safe, proceeding...');
    
  } catch (error) {
    console.error('❌ Security analysis failed:', error);
  }
}

// Example 3: Multi-Factor Authentication Flow
export async function multiFactorAuthFlow() {
  console.log('🔐 Multi-Factor Authentication Example');
  
  const guardian = await basicSetup();
  const userEmail = 'user@example.com';
  
  // Create a high-value transaction
  const fromKeypair = Keypair.generate();
  const toKeypair = Keypair.generate();
  
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: 10000000000 // 10 SOL - high value
    })
  );

  // Security options for high-value transaction
  const securityOptions: SecurityOptions = {
    simulate: true,
    biometric: true,
    pin: false,
    otp: true,
    timeLockThreshold: 5.0, // 5 SOL threshold
    emailAddress: userEmail
  };

  try {
    console.log('🔒 Executing secure transaction with MFA...');
    
    const result = await guardian.secureTransaction({
      transaction,
      userEmail,
      options: securityOptions
    });

    if (result.success) {
      console.log('✅ Transaction secured and executed successfully');
      console.log(`Transaction signature: ${result.signature}`);
    } else {
      console.log('❌ Transaction was blocked by security measures');
    }
    
  } catch (error) {
    console.error('❌ Secure transaction failed:', error);
  }
}

// Example 4: Biometric Authentication Setup
export async function biometricSetup() {
  console.log('👆 Biometric Authentication Setup Example');
  
  const guardian = await basicSetup();
  
  try {
    // Check if biometric authentication is available
    const isAvailable = await guardian.requireBiometric();
    
    if (!isAvailable) {
      console.log('❌ Biometric authentication not available on this device');
      return;
    }

    console.log('✅ Biometric authentication is available');
    
    // In a real app, you would register the user's biometric credential
    // This is typically done during account setup
    console.log('📝 Biometric credential would be registered here');
    
    // Test biometric authentication
    console.log('🔍 Testing biometric authentication...');
    const authResult = await guardian.requireBiometric();
    
    if (authResult) {
      console.log('✅ Biometric authentication successful');
    } else {
      console.log('❌ Biometric authentication failed');
    }
    
  } catch (error) {
    console.error('❌ Biometric setup failed:', error);
  }
}

// Example 5: OTP Verification Flow
export async function otpVerificationFlow() {
  console.log('📧 OTP Verification Flow Example');
  
  const guardian = await basicSetup();
  const userEmail = 'user@example.com';
  
  try {
    // Step 1: Send OTP
    console.log(`📤 Sending OTP to ${userEmail}...`);
    const otpSent = await guardian.sendOTP(userEmail);
    
    if (!otpSent) {
      console.log('❌ Failed to send OTP');
      return;
    }
    
    console.log('✅ OTP sent successfully');
    
    // Step 2: Simulate user entering OTP
    // In a real app, you would get this from user input
    const userEnteredOTP = '123456'; // This would come from user input
    
    console.log('🔍 Verifying OTP...');
    const otpValid = await guardian.verifyOTP(userEmail, userEnteredOTP);
    
    if (otpValid) {
      console.log('✅ OTP verification successful');
    } else {
      console.log('❌ OTP verification failed');
    }
    
  } catch (error) {
    console.error('❌ OTP verification flow failed:', error);
  }
}

// Example 6: Complete Integration Example
export async function completeIntegrationExample() {
  console.log('🚀 Complete GuardianLayer Integration Example');
  
  const guardian = await basicSetup();
  const connection = new Connection('https://api.devnet.solana.com');
  
  // User configuration
  const userEmail = 'user@example.com';
  const fromKeypair = Keypair.generate();
  const toKeypair = Keypair.generate();
  
  // Create transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: 2000000000 // 2 SOL
    })
  );

  // Configure security based on transaction value
  const securityOptions: SecurityOptions = {
    simulate: true,
    biometric: true, // Require biometric for transactions > 1 SOL
    pin: false,
    otp: true, // Require OTP for transactions > 1 SOL
    timeLockThreshold: 10.0, // Time lock for transactions > 10 SOL
    emailAddress: userEmail
  };

  try {
    console.log('🔍 Step 1: Risk Analysis');
    const riskAnalysis = await guardian.simulateAndCheck(transaction);
    console.log(`  Risk Level: ${riskAnalysis.level}`);
    console.log(`  Risk Score: ${riskAnalysis.score}/100`);
    
    console.log('🔐 Step 2: Multi-Factor Authentication');
    const result = await guardian.secureTransaction({
      transaction,
      userEmail,
      options: securityOptions
    });

    if (result.success) {
      console.log('✅ Step 3: Transaction Execution');
      console.log(`  Transaction secured and ready for execution`);
      console.log(`  Signature: ${result.signature}`);
      
      // In a real app, you would now send the transaction to the network
      console.log('📡 Transaction would be sent to Solana network here');
      
    } else {
      console.log('❌ Transaction blocked by security measures');
    }
    
  } catch (error) {
    console.error('❌ Complete integration failed:', error);
  }
}

// Example 7: Error Handling and Recovery
export async function errorHandlingExample() {
  console.log('⚠️ Error Handling and Recovery Example');
  
  const guardian = await basicSetup();
  
  try {
    // Simulate various error scenarios
    console.log('🧪 Testing error scenarios...');
    
    // Test 1: Invalid transaction
    const invalidTransaction = new Transaction();
    const result1 = await guardian.simulateAndCheck(invalidTransaction);
    console.log(`Empty transaction result: ${result1.level}`);
    
    // Test 2: Network error handling
    const guardianWithBadRPC = new GuardianLayer({
      rpcUrl: 'https://invalid-rpc-url.com'
    });
    
    const testTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: Keypair.generate().publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1000000
      })
    );
    
    const result2 = await guardianWithBadRPC.simulateAndCheck(testTransaction);
    console.log(`Bad RPC result: ${result2.level}`);
    
    console.log('✅ Error handling tests completed');
    
  } catch (error) {
    console.error('❌ Error handling test failed:', error);
  }
}

// Run all examples
export async function runAllExamples() {
  console.log('🎯 Running all GuardianLayer examples...\n');
  
  await secureSimpleTransfer();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await multiFactorAuthFlow();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await biometricSetup();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await otpVerificationFlow();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await completeIntegrationExample();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await errorHandlingExample();
  
  console.log('\n🎉 All examples completed!');
}

// Export for use in other files
export {
  basicSetup,
  secureSimpleTransfer,
  multiFactorAuthFlow,
  biometricSetup,
  otpVerificationFlow,
  completeIntegrationExample,
  errorHandlingExample
};
