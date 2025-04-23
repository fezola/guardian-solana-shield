import { Book, FileText, Code, FileCode, Shield, Settings, Copy, Terminal, Database, Key, Fingerprint, AlertTriangle, User, LayoutDashboard, AppWindow, Lock } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CodeBlock from "./CodeBlock";
import ApiKeySection from "./ApiKeySection";
import SdkIntegrationSection from "./SdkIntegrationSection";
import PlaygroundSection from "./PlaygroundSection";
import ServerSideApiSection from "./ServerSideApiSection";
import DemoAppSection from "./DemoAppSection";
import DocumentationSearch from "./DocumentationSearch";
import AnchorLink from "./AnchorLink";
import FeedbackWidget from "./FeedbackWidget";
import UpdatedTimestamp from "./UpdatedTimestamp";
import CollapsibleSidebar from "./CollapsibleSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDocumentationSections } from "@/hooks/useDocumentationSections";

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
    
    if (risk.level !== 'safe') {
      // Show risk warning to user
      const userConfirmed = await guardian.promptUserWarning(risk);
      
      if (!userConfirmed) {
        return; // Transaction canceled by user
      }
      
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
    lastUpdated: "2025-04-15",
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
    lastUpdated: "2025-04-10",
    content: <SdkIntegrationSection />,
  },
  {
    icon: FileCode,
    title: "zkProof Circuit Explanation",
    id: "zkproof-circuits",
    lastUpdated: "2025-04-18",
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
    lastUpdated: "2025-04-20",
    content: <DemoAppSection />,
  },
  {
    icon: Shield,
    title: "Security Model Overview",
    id: "security-model",
    lastUpdated: "2025-04-12",
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
    lastUpdated: "2025-04-05",
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
    lastUpdated: "2025-04-22",
    content: <ApiKeySection />
  },
  {
    icon: Database,
    title: "Server API",
    id: "server-api",
    lastUpdated: "2025-04-17",
    content: <ServerSideApiSection />
  },
  {
    icon: Terminal,
    title: "Interactive Playground",
    id: "playground",
    lastUpdated: "2025-04-19",
    content: <PlaygroundSection />
  },
];

const DocumentationSection = () => {
  const docRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeSection, setActiveSection] = useState("");
  const isMobile = useIsMobile();
  const { data: dbSections, isLoading, error } = useDocumentationSections();

  const sections = dbSections?.map(dbSection => ({
    ...dbSection,
    content: dbSection.content, // You may need to deserialize if content is stored as JSON
    icon: (() => {
      // Map icon string to imported icon component, fallback to FileText
      const allIcons = {Book, FileText, Code, FileCode, Shield, Settings, Copy, Terminal, Database, Key, Fingerprint, AlertTriangle, User, LayoutDashboard, AppWindow, Lock};
      // @ts-ignore
      return allIcons[dbSection.icon] || FileText;
    })(),
    lastUpdated: dbSection.updated_at ? dbSection.updated_at.split("T")[0] : "",
  })) || [];

  const scrollToSection = (id: string) => {
    docRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
    
    window.history.pushState(null, "", `#${id}`);
  };
  
  useEffect(() => {
    const sectionId = window.location.hash.replace('#', '');
    if (sectionId && sections.some(section => section.id === sectionId)) {
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  }, []);

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading documentation…</div>
  }
  if (error) {
    return <div className="p-12 text-center text-red-600">Error loading documentation.</div>
  }

  return (
    <section id="documentation" className="py-12 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text animate-fade-in">Documentation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Comprehensive guides, tutorials, and technical references for integrating GuardianLayer security features.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {isMobile && (
            <div className="lg:hidden mb-6">
              <DocumentationSearch 
                sections={sections}
                onSelectSection={id => {
                  docRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveSection(id);
                  window.history.pushState(null, "", `#${id}`);
                }}
              />
            </div>
          )}
          
          <CollapsibleSidebar>
            <div className="p-4 pt-6">
              {!isMobile && (
                <DocumentationSearch 
                  sections={sections}
                  onSelectSection={id => {
                    docRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveSection(id);
                    window.history.pushState(null, "", `#${id}`);
                  }}
                />
              )}
              
              <h2 className="text-xl font-bold mb-4">Documentation</h2>
              <nav>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => {
                          docRefs.current[section.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
                          setActiveSection(section.id);
                          window.history.pushState(null, "", `#${section.id}`);
                        }}
                        className={`flex w-full items-center gap-2 py-2 px-3 rounded-md hover:bg-muted transition-colors text-left ${
                          activeSection === section.id
                            ? "bg-primary/10 text-primary font-medium"
                            : ""
                        }`}
                      >
                        <section.icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm">{section.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </CollapsibleSidebar>

          <div className="flex-1">
            <div className="space-y-16">
              {sections.map((section) => (
                <div
                  ref={el => (docRefs.current[section.id] = el)}
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-6 group">
                    <span className="inline-flex p-2.5 rounded-lg bg-primary/10">
                      <section.icon className="h-5 w-5 text-primary" />
                    </span>
                    <h2 className="text-2xl font-bold">
                      {section.title}
                      <AnchorLink id={section.id} />
                    </h2>
                  </div>
                  <UpdatedTimestamp date={section.lastUpdated} />
                  <div className="mt-6">{section.content}</div>
                  <FeedbackWidget sectionId={section.id} sectionTitle={section.title} />
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
