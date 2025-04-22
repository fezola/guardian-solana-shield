
import { Book, FileText, Code, FileCode, Shield, Settings, Copy, Terminal, Database, Key, Fingerprint, AlertTriangle } from "lucide-react";
import { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CodeBlock from "./CodeBlock";
import ApiKeySection from "./ApiKeySection";

// Demo app section
const DemoAppSection = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSecure, setIsSecure] = useState(false);
  const [requiresBiometric, setRequiresBiometric] = useState(false);
  const [needsOtp, setNeedsOtp] = useState(false);
  const [risk, setRisk] = useState<'low' | 'medium' | 'high' | null>(null);
  const [otp, setOtp] = useState('');

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Simulate transaction risk analysis
      const risks = ['low', 'medium', 'high'] as const;
      const simulatedRisk = risks[Math.floor(Math.random() * risks.length)];
      setRisk(simulatedRisk);
      setIsSimulating(false);

      if (simulatedRisk === 'high') {
        setRequiresBiometric(true);
        setNeedsOtp(true);
      } else if (simulatedRisk === 'medium') {
        setRequiresBiometric(true);
        setNeedsOtp(false);
      } else {
        setRequiresBiometric(false);
        setNeedsOtp(false);
        setIsSecure(true);
      }
    }, 2000);
  };

  const handleBiometricAuth = () => {
    setTimeout(() => {
      setRequiresBiometric(false);
      if (needsOtp) {
        // For high-risk transactions, we still need OTP
      } else {
        setIsSecure(true);
      }
    }, 1000);
  };

  const handleOtpVerify = () => {
    if (otp === '123456') {
      setNeedsOtp(false);
      setIsSecure(true);
    }
  };

  const resetDemo = () => {
    setIsSimulating(false);
    setIsSecure(false);
    setRequiresBiometric(false);
    setNeedsOtp(false);
    setRisk(null);
    setOtp('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">Interactive Demo: Transaction Security Flow</h3>
        <p className="text-muted-foreground mb-6">
          Experience how GuardianLayer evaluates and protects transactions through a simulated transaction flow.
        </p>

        <div className="space-y-6">
          {!isSimulating && !risk && !isSecure && (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/30">
                <h4 className="font-semibold mb-2">Demo Transaction</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-semibold">Token Transfer</span>
                  </div>
                  <div className="flex justify-between">
                    <span>From:</span>
                    <span className="font-mono">myWallet.eth</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span className="font-mono">unknown.eth</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">1500 SOL</span>
                  </div>
                </div>
              </div>
              <Button onClick={runSimulation} className="w-full">Simulate & Check Transaction</Button>
            </div>
          )}

          {isSimulating && (
            <div className="text-center py-10 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mx-auto"></div>
              <p>Simulating transaction and analyzing risk...</p>
            </div>
          )}

          {risk && !isSecure && (
            <div className="space-y-4">
              <div className={`p-4 border rounded-md ${risk === 'high' ? 'bg-red-500/10 border-red-500/30' :
                  risk === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                    'bg-green-500/10 border-green-500/30'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Risk Analysis Results</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${risk === 'high' ? 'bg-red-500 text-white' :
                      risk === 'medium' ? 'bg-amber-500 text-white' :
                        'bg-green-500 text-white'
                    }`}>
                    {risk.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-sm">
                  {risk === 'high' && 'This transaction was flagged as high risk. Multiple verification required.'}
                  {risk === 'medium' && 'This transaction has some risk factors. Additional verification required.'}
                  {risk === 'low' && 'This transaction appears to be safe. Minimal verification required.'}
                </p>
              </div>

              {requiresBiometric && (
                <div className="p-4 border rounded-md bg-blue-500/10 border-blue-500/30">
                  <div className="flex items-center mb-2">
                    <Fingerprint className="h-5 w-5 mr-2 text-blue-500" />
                    <h4 className="font-semibold">Biometric Authentication Required</h4>
                  </div>
                  <p className="text-sm mb-3">Please verify your identity to proceed with this transaction.</p>
                  <Button onClick={handleBiometricAuth} variant="outline" className="w-full">
                    Authenticate with Biometrics
                  </Button>
                </div>
              )}

              {needsOtp && !requiresBiometric && (
                <div className="p-4 border rounded-md bg-purple-500/10 border-purple-500/30">
                  <div className="flex items-center mb-2">
                    <Key className="h-5 w-5 mr-2 text-purple-500" />
                    <h4 className="font-semibold">Email OTP Verification</h4>
                  </div>
                  <p className="text-sm mb-3">
                    A verification code has been sent to your email. Please enter it below.
                  </p>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="flex-1 px-3 py-2 border rounded"
                      maxLength={6}
                    />
                    <Button onClick={handleOtpVerify} disabled={otp.length !== 6}>
                      Verify
                    </Button>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">For demo, use code: 123456</p>
                </div>
              )}
            </div>
          )}

          {isSecure && (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-green-500/10 border-green-500/30">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  <h4 className="font-semibold">Transaction Secured</h4>
                </div>
                <p className="text-sm mb-3">
                  All security checks passed. Your transaction has been successfully verified and secured.
                </p>
              </div>
              <Button onClick={resetDemo} variant="outline" className="w-full">
                Start New Demo
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">How This Demo Works</h3>
        <p className="text-muted-foreground mb-4">
          The demo simulates GuardianLayer's multi-layered security approach:
        </p>
        <ol className="list-decimal ml-5 space-y-2 text-sm">
          <li>Transaction simulation to analyze and classify risk</li>
          <li>Adaptive security based on risk level</li>
          <li>Biometric authentication for medium/high risk transactions</li>
          <li>Email OTP verification for high risk transactions</li>
          <li>Final transaction approval and execution</li>
        </ol>
        <div className="mt-4 p-4 bg-muted/30 rounded-md">
          <h4 className="font-semibold mb-2 text-sm">Implementation Example:</h4>
          <CodeBlock
            code={`// This is how the demo is implemented in your app
const securedTx = await guardian.secureTransaction(tx, {
  simulate: true,            // Run simulation first
  biometric: riskLevel > 1,  // For medium/high risk
  otp: riskLevel > 2,        // For high risk only
  emailAddress: user.email
});`}
            language="javascript"
          />
        </div>
      </div>
    </div>
  );
};

// Code examples for each language
const codeExamples = {
  javascript: {
    installation: `npm install @guardianlayer/sdk @guardianlayer/react`,
    initialization: `import { GuardianLayer } from '@guardianlayer/sdk';

// Initialize with your wallet provider
const guardian = new GuardianLayer({
  wallet: yourWalletProvider,
  modules: ['txSecurity', 'recovery', 'biometric']
});`,
    simulateAndCheck: `// Check transaction risk before execution
const tx = createYourTransaction();
const result = await guardian.simulateAndCheck(tx);

if (result.risk !== 'safe') {
  // Show risk warning to user
  const userConfirmed = await guardian.promptUserWarning(result);
  
  if (!userConfirmed) {
    return; // Transaction canceled by user
  }
}

// Proceed with transaction if confirmed
await wallet.sendTransaction(tx);`,
    biometricAuth: `// Require biometric authentication
try {
  const authenticated = await guardian.requireBiometric();
  if (authenticated) {
    // User has been verified
    await wallet.sendTransaction(tx);
  }
} catch (error) {
  console.error("Authentication failed", error);
}`,
    fullImplementation: `import { GuardianLayer } from '@guardianlayer/sdk';

// Initialize the SDK
const guardian = new GuardianLayer({
  wallet: yourWalletProvider,
  apiKey: "YOUR_API_KEY",
  modules: ['txSecurity', 'recovery', 'biometric', 'otp']
});

// Complete transaction protection flow
async function secureAndSendTransaction(tx) {
  try {
    // 1. Simulate and check risk
    const risk = await guardian.simulateAndCheck(tx);
    
    if (risk.level === 'high') {
      // 2. Get user confirmation for risky tx
      const confirmed = await guardian.promptUserWarning(risk);
      if (!confirmed) return;
      
      // 3. Require biometric for high risk
      const biometricVerified = await guardian.requireBiometric();
      if (!biometricVerified) return;
      
      // 4. Require OTP for high risk
      const otpVerified = await guardian.verifyOTP();
      if (!otpVerified) return;
    }
    else if (risk.level === 'medium') {
      // Less stringent for medium risk
      const biometricVerified = await guardian.requireBiometric();
      if (!biometricVerified) return;
    }
    
    // 5. Execute transaction
    await wallet.sendTransaction(tx);
    
    // 6. Log for audit trail
    guardian.logSecureTransaction({
      txHash: tx.hash,
      risk: risk.level,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Transaction security failed", error);
  }
}`
  },
  python: {
    installation: `pip install guardianlayer-sdk`,
    initialization: `from guardianlayer import GuardianLayer

# Initialize with your wallet provider
guardian = GuardianLayer(
    wallet=your_wallet_provider,
    modules=['txSecurity', 'recovery', 'biometric']
)`,
    simulateAndCheck: `# Check transaction risk before execution
tx = create_your_transaction()
result = guardian.simulate_and_check(tx)

if result.risk != 'safe':
    # Show risk warning to user
    user_confirmed = guardian.prompt_user_warning(result)
    
    if not user_confirmed:
        return  # Transaction canceled by user

# Proceed with transaction if confirmed
wallet.send_transaction(tx)`,
    biometricAuth: `# Require biometric authentication
try:
    authenticated = guardian.require_biometric()
    if authenticated:
        # User has been verified
        wallet.send_transaction(tx)
except Exception as error:
    print("Authentication failed", error)`,
    fullImplementation: `from guardianlayer import GuardianLayer
import time

# Initialize the SDK
guardian = GuardianLayer(
    wallet=your_wallet_provider,
    api_key="YOUR_API_KEY",
    modules=['txSecurity', 'recovery', 'biometric', 'otp']
)

# Complete transaction protection flow
def secure_and_send_transaction(tx):
    try:
        # 1. Simulate and check risk
        risk = guardian.simulate_and_check(tx)
        
        if risk.level == 'high':
            # 2. Get user confirmation for risky tx
            confirmed = guardian.prompt_user_warning(risk)
            if not confirmed:
                return
            
            # 3. Require biometric for high risk
            biometric_verified = guardian.require_biometric()
            if not biometric_verified:
                return
            
            # 4. Require OTP for high risk
            otp_verified = guardian.verify_otp()
            if not otp_verified:
                return
        elif risk.level == 'medium':
            # Less stringent for medium risk
            biometric_verified = guardian.require_biometric()
            if not biometric_verified:
                return
        
        # 5. Execute transaction
        wallet.send_transaction(tx)
        
        # 6. Log for audit trail
        guardian.log_secure_transaction({
            'tx_hash': tx.hash,
            'risk': risk.level,
            'timestamp': int(time.time())
        })
    except Exception as error:
        print("Transaction security failed", error)`
  },
  rust: {
    installation: `cargo add guardianlayer-sdk`,
    initialization: `use guardianlayer_sdk::GuardianLayer;

// Initialize with your wallet provider
let guardian = GuardianLayer::new()
    .with_wallet(your_wallet_provider)
    .with_modules(vec!["txSecurity", "recovery", "biometric"])
    .build();`,
    simulateAndCheck: `// Check transaction risk before execution
let tx = create_your_transaction();
let result = guardian.simulate_and_check(&tx).await?;

if result.risk != "safe" {
    // Show risk warning to user
    let user_confirmed = guardian.prompt_user_warning(&result).await?;
    
    if !user_confirmed {
        return Ok(()); // Transaction canceled by user
    }
}

// Proceed with transaction if confirmed
wallet.send_transaction(tx).await?;`,
    biometricAuth: `// Require biometric authentication
match guardian.require_biometric().await {
    Ok(true) => {
        // User has been verified
        wallet.send_transaction(tx).await?;
    },
    Ok(false) => println!("Authentication declined"),
    Err(e) => println!("Authentication error: {}", e),
}`,
    fullImplementation: `use guardianlayer_sdk::{GuardianLayer, TransactionRisk, Error};
use std::collections::HashMap;
use chrono::Utc;

// Initialize the SDK
let guardian = GuardianLayer::new()
    .with_wallet(your_wallet_provider)
    .with_api_key("YOUR_API_KEY")
    .with_modules(vec!["txSecurity", "recovery", "biometric", "otp"])
    .build();

// Complete transaction protection flow
async fn secure_and_send_transaction(tx: Transaction) -> Result<(), Error> {
    // 1. Simulate and check risk
    let risk = guardian.simulate_and_check(&tx).await?;
    
    if risk.level == "high" {
        // 2. Get user confirmation for risky tx
        let confirmed = guardian.prompt_user_warning(&risk).await?;
        if !confirmed {
            return Ok(());
        }
        
        // 3. Require biometric for high risk
        let biometric_verified = guardian.require_biometric().await?;
        if !biometric_verified {
            return Ok(());
        }
        
        // 4. Require OTP for high risk
        let otp_verified = guardian.verify_otp().await?;
        if !otp_verified {
            return Ok(());
        }
    } else if risk.level == "medium" {
        // Less stringent for medium risk
        let biometric_verified = guardian.require_biometric().await?;
        if !biometric_verified {
            return Ok(());
        }
    }
    
    // 5. Execute transaction
    wallet.send_transaction(tx).await?;
    
    // 6. Log for audit trail
    let mut log_data = HashMap::new();
    log_data.insert("tx_hash", tx.hash);
    log_data.insert("risk", risk.level);
    log_data.insert("timestamp", Utc::now().timestamp().to_string());
    
    guardian.log_secure_transaction(log_data).await?;
    
    Ok(())
}`
  }
};

const sections = [
  {
    icon: FileText,
    title: "API Reference",
    id: "api-reference",
    content: (
      <div>
        <h3 className="text-lg font-bold mb-4">Core API Functions</h3>
        <p className="mb-4">The GuardianLayer SDK provides a comprehensive API for securing transactions and managing user authentication:</p>

        <Tabs defaultValue="javascript">
          <TabsList className="mb-4">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="rust">Rust</TabsTrigger>
          </TabsList>

          <TabsContent value="javascript">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Installation</h4>
                <CodeBlock code={codeExamples.javascript.installation} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Initialization</h4>
                <CodeBlock code={codeExamples.javascript.initialization} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Transaction Risk Assessment</h4>
                <CodeBlock code={codeExamples.javascript.simulateAndCheck} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Biometric Authentication</h4>
                <CodeBlock code={codeExamples.javascript.biometricAuth} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Complete Implementation</h4>
                <CodeBlock code={codeExamples.javascript.fullImplementation} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="python">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Installation</h4>
                <CodeBlock code={codeExamples.python.installation} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Initialization</h4>
                <CodeBlock code={codeExamples.python.initialization} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Transaction Risk Assessment</h4>
                <CodeBlock code={codeExamples.python.simulateAndCheck} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Biometric Authentication</h4>
                <CodeBlock code={codeExamples.python.biometricAuth} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Complete Implementation</h4>
                <CodeBlock code={codeExamples.python.fullImplementation} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rust">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Installation</h4>
                <CodeBlock code={codeExamples.rust.installation} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Initialization</h4>
                <CodeBlock code={codeExamples.rust.initialization} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Transaction Risk Assessment</h4>
                <CodeBlock code={codeExamples.rust.simulateAndCheck} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Biometric Authentication</h4>
                <CodeBlock code={codeExamples.rust.biometricAuth} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Complete Implementation</h4>
                <CodeBlock code={codeExamples.rust.fullImplementation} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    ),
  },
  {
    icon: Code,
    title: "Integration Guides",
    id: "integration-guides",
    content: (
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Step-by-Step Integration Guide</h3>
          <p className="text-muted-foreground mb-4">
            Follow these steps to integrate GuardianLayer security features into your application:
          </p>

          <ol className="space-y-4 ml-5 list-decimal">
            <li>
              <h4 className="font-semibold">Install the SDK</h4>
              <CodeBlock
                code={`npm install @guardianlayer/sdk @guardianlayer/react`}
              />
            </li>

            <li>
              <h4 className="font-semibold">Initialize the SDK</h4>
              <CodeBlock
                code={`import { GuardianLayer } from '@guardianlayer/sdk';

// Initialize with your wallet provider
const guardian = new GuardianLayer({
  wallet: yourWalletProvider,
  apiKey: "YOUR_API_KEY", // Obtain from dashboard
  modules: [
    'txSecurity',  // Transaction risk assessment
    'recovery',    // Wallet recovery options
    'biometric',   // Biometric authentication
    'otp'          // One-time password verification
  ]
});`}
              />
            </li>

            <li>
              <h4 className="font-semibold">Add Transaction Protection</h4>
              <CodeBlock
                code={`// In your transaction handler:
async function handleSendTransaction(tx) {
  try {
    // Analyze transaction risk
    const risk = await guardian.simulateAndCheck(tx);
    
    // If risky, warn user
    if (risk.level !== 'safe') {
      const proceed = await guardian.promptUserWarning(risk);
      if (!proceed) return;
    }
    
    // Add biometric check for all transactions
    const verified = await guardian.requireBiometric();
    if (!verified) return;
    
    // Execute the transaction
    await wallet.sendTransaction(tx);
    
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}`}
              />
            </li>

            <li>
              <h4 className="font-semibold">For React Applications</h4>
              <CodeBlock
                code={`import { GuardianProvider, SecureButton } from '@guardianlayer/react';

function App() {
  return (
    <GuardianProvider
      wallet={yourWalletProvider}
      apiKey="YOUR_API_KEY"
    >
      <YourApp />
    </GuardianProvider>
  );
}

// Then in your component:
function SendButton() {
  const handleSuccess = (result) => {
    console.log("Transaction successful:", result);
  };
  
  return (
    <SecureButton
      transaction={yourTransaction}
      securityLevel="high" // 'low', 'medium', or 'high'
      onSuccess={handleSuccess}
      onError={(error) => console.error(error)}
    >
      Send Securely
    </SecureButton>
  );
}`}
              />
            </li>

            <li>
              <h4 className="font-semibold">Configure Recovery Options</h4>
              <CodeBlock
                code={`// Set up wallet recovery methods
await guardian.setupRecovery({
  method: 'shamir', // 'shamir', 'timelock', 'guardians'
  threshold: 2,     // Number of shares needed for recovery
  shares: 3,        // Total number of shares to generate
  emails: [         // Optional: Send shares to emails
    'backup1@example.com',
    'backup2@example.com',
    'backup3@example.com'
  ]
});`}
              />
            </li>
          </ol>
        </div>

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <h4 className="font-semibold flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
            Best Practices
          </h4>
          <ul className="list-disc ml-5 space-y-2">
            <li>Always initialize GuardianLayer as early as possible in your app lifecycle</li>
            <li>Store API keys securely on your server, not in client-side code</li>
            <li>Implement proper error handling for all security operations</li>
            <li>Test thoroughly in sandbox environment before going to production</li>
            <li>Use the React components when possible for simplified integration</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    icon: FileCode,
    title: "zkProof Circuit Explanation",
    id: "zkproof-circuits",
    content: (
      <div>
        <p className="mb-4">
          GuardianLayer uses zkSNARK circuits for privacy-preserving identity and biometric/credential proofs. Common circuits supported:
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Biometric Template Verification</h3>
            <p className="text-muted-foreground mb-4">
              Verify biometric data like fingerprints without exposing the actual biometric data:
            </p>
            <CodeBlock
              code={`// Generate a biometric commitment
const biometricTemplate = await guardian.generateBiometricTemplate();
              
// Create a zk-proof of the biometric data
const proof = await guardian.createBiometricProof({
  template: biometricTemplate,
  challenge: serverChallenge
});

// Send only the proof to the server for verification
const verified = await guardian.verifyBiometricProof(proof);`}
            />
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Email Ownership Proof</h3>
            <p className="text-muted-foreground mb-4">
              Prove you own an email address without revealing the actual address:
            </p>
            <CodeBlock
              code={`// Create a hash of the email with a salt
const emailHash = await guardian.hashCredential({
  type: 'email',
  value: userEmail,
  salt: userSalt
});

// Generate a zk-proof of email ownership
const proof = await guardian.generateZkProof({
  emailHash: emailHash,
  salt: userSalt,
  // The actual email is never included in the proof
});

// The verifier can check the proof without seeing the email
const isValid = await verifier.verifyEmailProof(proof);`}
            />
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Device Fingerprinting Circuit</h3>
            <p className="text-muted-foreground mb-4">
              Create a privacy-preserving device identification system:
            </p>
            <CodeBlock
              code={`// Generate a device fingerprint
const deviceFingerprint = await guardian.generateDeviceFingerprint();

// Create a zk-proof that this is a known device
const proof = await guardian.createDeviceProof({
  fingerprint: deviceFingerprint,
  knownDevices: userDevicesRegistry,
  // The actual device details are never exposed
});

// Verify it's a recognized device without exposing device details
const isKnownDevice = await verifier.verifyDeviceProof(proof);`}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted border border-border">
            <h4 className="font-semibold mb-2">Technical Deep Dive</h4>
            <p className="text-sm mb-3">
              Our zkSNARK circuit implementation uses the Groth16 proving system for efficient verification with the following properties:
            </p>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              <li>Constant-size proofs (~200 bytes) regardless of computation complexity</li>
              <li>Sub-millisecond verification time on modern hardware</li>
              <li>Perfect zero-knowledge (no information leakage)</li>
              <li>Non-interactive verification (no back-and-forth communication needed)</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Terminal,
    title: "Demo App",
    id: "demo-app",
    content: <DemoAppSection />,
  },
  {
    icon: Shield,
    title: "Security Model Overview",
    id: "security-model",
    content: (
      <div>
        <p className="mb-4">
          GuardianLayer applies a multi-layer approach to secure transactions and wallet operations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-md bg-muted/20">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              <h3 className="font-semibold">Transaction Simulation</h3>
            </div>
            <p className="text-sm">
              Analyzes transaction before execution to identify potential scams, hidden approvals, and other risky behaviors.
              Uses a combination of on-chain simulation and pattern recognition.
            </p>
          </div>

          <div className="p-4 border rounded-md bg-muted/20">
            <div className="flex items-center mb-2">
              <Fingerprint className="h-5 w-5 mr-2 text-blue-500" />
              <h3 className="font-semibold">Biometric Authentication</h3>
            </div>
            <p className="text-sm">
              Uses device biometrics (FaceID/TouchID) or WebAuthn passkeys for secure, phishing-resistant authentication
              without storing actual biometric data.
            </p>
          </div>

          <div className="p-4 border rounded-md bg-muted/20">
            <div className="flex items-center mb-2">
              <Key className="h-5 w-5 mr-2 text-purple-500" />
              <h3 className="font-semibold">PIN/Passphrase</h3>
            </div>
            <p className="text-sm">
              Optional secondary factor using user-memorized PIN or passphrase. Client-side hashing ensures the
              PIN/passphrase is never transmitted in plaintext.
            </p>
          </div>

          <div className="p-4 border rounded-md bg-muted/20">
            <div className="flex items-center mb-2">
              <Database className="h-5 w-5 mr-2 text-indigo-500" />
              <h3 className="font-semibold">Email/Device OTP</h3>
            </div>
            <p className="text-sm">
              One-time codes delivered via email or SMS for high-risk operations.
              Time-limited tokens provide an additional verification channel.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3">Security Levels and Risk Adaptation</h3>
          <p className="text-muted-foreground mb-4">
            GuardianLayer adjusts security requirements based on transaction risk assessment:
          </p>

          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-20 text-green-500 font-medium">Low Risk</div>
              <div className="flex-1 bg-gray-200 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <div className="w-36 text-sm ml-3">Basic checks only</div>
            </div>

            <div className="flex items-center">
              <div className="w-20 text-amber-500 font-medium">Medium Risk</div>
              <div className="flex-1 bg-gray-200 h-2 rounded-full">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <div className="w-36 text-sm ml-3">+Biometric verification</div>
            </div>

            <div className="flex items-center">
              <div className="w-20 text-red-500 font-medium">High Risk</div>
              <div className="flex-1 bg-gray-200 h-2 rounded-full">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="w-36 text-sm ml-3">+Biometric, PIN & OTP</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <h4 className="font-semibold mb-2">Security Certification</h4>
          <p className="text-sm">
            GuardianLayer has undergone rigorous third-party security audits by leading blockchain security firms.
            Our protocols have been tested for resistance against common attack vectors including:
          </p>
          <ul className="list-disc ml-5 mt-2 text-sm space-y-1">
            <li>Man-in-the-middle attacks</li>
            <li>Replay attacks</li>
            <li>Social engineering</li>
            <li>Phishing attempts</li>
            <li>Cryptographic vulnerabilities</li>
          </ul>
          <div className="mt-3 text-sm">
            <a href="#" className="text-primary hover:underline">View Security Audit Reports →</a>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Settings,
    title: "Recovery Configuration",
    id: "recovery-config",
    content: (
      <div>
        <h3 className="text-lg font-bold mb-4">Wallet Recovery Options</h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Shamir Secret Sharing</h4>
            <p className="text-muted-foreground mb-3">
              Split your wallet recovery key into multiple shares, requiring a threshold number to recover:
            </p>
            <CodeBlock
              code={`// Generate recovery shares
const recovery = await guardian.setupRecovery({
  method: 'shamir',
  threshold: 2,  // Number of shares needed for recovery
  shares: 3,     // Total number of shares
  // Optional: where to deliver the shares
  delivery: [
    { type: 'email', destination: 'backup1@example.com' },
    { type: 'email', destination: 'backup2@example.com' },
    { type: 'download', destination: 'local' } // Save locally
  ]
});

// To recover with 2 or more shares later:
const wallet = await guardian.recoverWallet({
  method: 'shamir',
  shares: [share1, share2] // The collected shares
});`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">Time-locked Recovery</h4>
            <p className="text-muted-foreground mb-3">
              Set up a backup key that can only be used after a security delay window:
            </p>
            <CodeBlock
              code={`// Set up time-locked recovery
await guardian.setupRecovery({
  method: 'timelock',
  waitPeriod: 7 * 24 * 60 * 60, // 7 days in seconds
  notificationEmail: 'your@email.com', // For recovery attempt alerts
});

// Start recovery process (initiates waiting period)
await guardian.initiateRecovery({
  method: 'timelock',
  backupKey: yourBackupKey
});

// After wait period expires:
const wallet = await guardian.completeRecovery({
  method: 'timelock',
  backupKey: yourBackupKey,
  recoveryId: recoveryId // From initiateRecovery
});`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">Social Recovery (Guardians)</h4>
            <p className="text-muted-foreground mb-3">
              Designate trusted contacts as guardians who can help recover your wallet:
            </p>
            <CodeBlock
              code={`// Set up social recovery with guardians
await guardian.setupRecovery({
  method: 'guardians',
  threshold: 3, // Number of guardians required
  guardians: [
    { email: 'guardian1@example.com', name: 'Alice' },
    { email: 'guardian2@example.com', name: 'Bob' },
    { email: 'guardian3@example.com', name: 'Charlie' },
    { email: 'guardian4@example.com', name: 'Dave' },
    { email: 'guardian5@example.com', name: 'Eve' }
  ]
});

// To recover (will email verification requests to guardians):
const recoveryId = await guardian.initiateRecovery({
  method: 'guardians',
  userEmail: 'your@email.com'
});

// Guardians approve via links in their emails
// Once threshold is met, complete recovery:
const wallet = await guardian.completeRecovery({
  method: 'guardians',
  recoveryId: recoveryId
});`}
            />
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-border">
          <h4 className="font-semibold mb-3">Recovery Best Practices</h4>
          <ul className="list-disc ml-5 space-y-2">
            <li>
              <strong>Combine methods:</strong> Use multiple recovery methods for added security
            </li>
            <li>
              <strong>Test recovery:</strong> Regularly test your recovery process in a safe environment
            </li>
            <li>
              <strong>Update guardians:</strong> Periodically review and update your guardian list
            </li>
            <li>
              <strong>Secure your backup:</strong> Store recovery shares in different physical locations
            </li>
            <li>
              <strong>Use reliable guardians:</strong> Choose guardians who are security-conscious and reachable
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    icon: Key,
    title: "API Key Management",
    id: "api-key",
    content: <ApiKeySection />
  },
];

const DocumentationSection = () => {
  const docRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeSection, setActiveSection] = useState(sections[0].id);

  // For smooth scroll to section
  const scrollToSection = (id: string) => {
    docRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <section id="documentation" className="py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text animate-fade-in">Documentation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Comprehensive guides, tutorials, and technical references for integrating GuardianLayer security features.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar navigation */}
          <div className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-4 py-2.5 rounded-lg w-full text-left flex items-center transition ${activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                    }`}
                >
                  <section.icon className="h-5 w-5 mr-2.5" />
                  <span>{section.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1">
            <div className="space-y-16">
              {sections.map((section) => (
                <div
                  ref={el => (docRefs.current[section.id] = el)}
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="inline-flex p-2.5 rounded-lg bg-primary/10">
                      <section.icon className="h-5 w-5 text-primary" />
                    </span>
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  </div>
                  <div>{section.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentationSection;
