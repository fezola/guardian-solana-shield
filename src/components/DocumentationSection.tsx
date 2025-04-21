
import { Book, FileText, Code, FileCode, Shield, Settings } from "lucide-react";
import { useRef } from "react";

const sections = [
  {
    icon: FileText,
    title: "API Reference",
    id: "api-reference",
    content: (
      <div>
        <h4 className="font-semibold mb-2">SDK API Examples</h4>
        <div className="mb-4">
          <code className="block whitespace-pre p-3 rounded-md bg-muted/20 mb-2 text-xs">
{`import { simulateAndCheck, requireBiometric, verifyPIN, sendEmailOTP, verifyOTP, scheduleTimeLock, secureTransaction } from '@guardianlayer/core';

// Securely send transaction
const result = await guardian.simulateAndCheck(tx);
if (result.risk === 'high') {
  await guardian.promptUserApproval(result);
}
await guardian.secureTransaction(tx, {
  simulate: true,
  biometric: true,
  pin: true,
  otp: true,
  timeLockThreshold: 1000,
});`}
          </code>
        </div>
        <hr className="my-4 border-secondary" />
        <h4 className="font-semibold mb-2">Secure Transaction Lifecycle</h4>
        <code className="block whitespace-pre p-3 rounded-md bg-muted/20 text-xs">
{`interface SecureTransactionOptions {
  simulate?: boolean;
  biometric?: boolean;
  pin?: boolean;
  otp?: boolean;
  timeLockThreshold?: number;
  userEmail?: string;
  userPIN?: string;
}
export async function secureTransaction(
  tx: Transaction,
  options: SecureTransactionOptions
): Promise<void> {
  // ...Logic for full security lifecycle as detailed in docs...
}
`}
        </code>
      </div>
    ),
  },
  {
    icon: Code,
    title: "Integration Guides",
    id: "integration-guides",
    content: (
      <div>
        <h4 className="font-semibold mb-2">Install & Integrate</h4>
        <div className="mb-3">
          <div className="mb-1 text-sm font-bold">NPM Install</div>
          <code className="block whitespace-pre p-3 rounded-md bg-muted/20 mb-2 text-xs">
{`npm install @guardianlayer/core @guardianlayer/react`}
          </code>
        </div>
        <div className="mb-3">
          <div className="mb-1 text-sm font-bold">Basic Integration</div>
          <code className="block whitespace-pre p-3 rounded-md bg-muted/20 text-xs">
{`import { GuardianLayer } from '@guardianlayer/core';

const guardian = new GuardianLayer({
  wallet: yourWalletProvider,
  modules: ['txSecurity', 'recovery', 'biometric']
});

// In transaction handler:
const tx = createYourTransaction();
const result = await guardian.simulateAndCheck(tx);
if (result.risk !== 'safe') await guardian.promptUser(result);
await sendAndConfirmTransaction(connection, tx, [payer]);
`}
          </code>
        </div>
        <div className="mb-3">
          <div className="mb-1 text-sm font-bold">Biometric Gating</div>
          <code className="block whitespace-pre p-3 rounded-md bg-muted/20 text-xs">
{`await guardian.requireBiometric();`}
          </code>
        </div>
        <div>
          <div className="mb-1 text-sm font-bold">zkLogin Integration</div>
          <code className="block whitespace-pre p-3 rounded-md bg-muted/20 text-xs">
{`const user = await guardian.zkLogin({ email });`}
          </code>
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
        <p>
          GuardianLayer uses zkSNARK circuits for privacy-preserving identity and biometric/credential proofs. Common circuits supported:
        </p>
        <ul className="list-disc ml-6 my-3 text-sm">
          <li>Email hash + salt proof</li>
          <li>Biometric template commitments</li>
          <li>Device fingerprinting</li>
        </ul>
        <code className="block whitespace-pre p-3 rounded-md bg-muted/20 text-xs">
{`// Example: Proving email ownership without revealing plaintext
const proof = await guardian.generateZkProof({
  emailHash: hashedEmail,
  salt: userSalt
});`}
        </code>
      </div>
    ),
  },
  {
    icon: Book,
    title: "Demo App Tutorial",
    id: "demo-tutorial",
    content: (
      <div>
        <ol className="list-decimal ml-7 mb-3 text-sm">
          <li>Install SDK and React integration</li>
          <li>Configure wallet connection and GuardianLayer</li>
          <li>Implement transaction screening with <span className="font-mono text-xs">simulateAndCheck</span></li>
          <li>Add biometric/PIN/OTP flows as needed</li>
        </ol>
        <div>
          <div className="text-xs mt-2 mb-1 font-bold">Starter code example:</div>
          <code className="block whitespace-pre p-3 rounded-md bg-muted/20 text-xs">
{`import { GuardianProvider, SecureTransactionButton } from '@guardianlayer/react';

function App() {
  return (
    <GuardianProvider walletProvider={yourWalletProvider}>
      <SecureTransactionButton
        transaction={yourTransaction}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        Send Transaction Securely
      </SecureTransactionButton>
    </GuardianProvider>
  );
}
`}
          </code>
        </div>
      </div>
    ),
  },
  {
    icon: Shield,
    title: "Security Model Overview",
    id: "security-model",
    content: (
      <div>
        <p className="mb-2">
          GuardianLayer applies a multi-layer approach:
        </p>
        <ul className="list-disc ml-6 mb-2 text-sm">
          <li>Transaction Simulation (scan & risk classification)</li>
          <li>Biometric / Passkey auth (WebAuthn)</li>
          <li>User PIN/Passphrase</li>
          <li>Email/device OTP for sensitive/risky transfers</li>
          <li>24h time-lock for high-amount or flagged tx</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Audited, modular and extensible—wallets can use only the layers they want, or bundle all for maximal security.
        </p>
      </div>
    ),
  },
  {
    icon: Settings,
    title: "Recovery Configuration",
    id: "recovery-config",
    content: (
      <div>
        <h4 className="mb-2 font-semibold">Best Practices</h4>
        <ul className="list-disc ml-6 mb-2 text-sm">
            <li>
              <strong>Time-lock Key:</strong> Backup keys can be used after a security delay window.
            </li>
            <li>
              <strong>Shamir Secret Sharing:</strong> Split secret among devices, require threshold to recover.
            </li>
            <li>
              <strong>Biometric Recovery:</strong> Rebind cryptographic secrets to biometrically-verified device.
            </li>
            <li>
              <strong>GuardianLayer:</strong> Optionally configure trustless guardian signers for additional recovery safety, with customizable timeouts.
            </li>
          </ul>
        <code className="block whitespace-pre p-3 rounded-md bg-muted/20 text-xs">
{`await guardian.setupRecovery({
  method: 'shamir',
  threshold: 2,
  shares: 3
});`}
        </code>
      </div>
    ),
  },
];


const DocumentationSection = () => {
  const docRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // For smooth scroll to section
  const scrollToSection = (id: string) => {
    docRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="documentation" className="py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text animate-fade-in">Documentation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Comprehensive guides, tutorials, and technical references—find exactly what you need below.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-4 animate-fade-in">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 font-medium transition cursor-pointer"
              aria-label={`Jump to ${section.title}`}
            >
              <span className="align-middle"><section.icon className="inline h-5 w-5 mr-2" /></span>
              {section.title}
            </button>
          ))}
        </div>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <div
              ref={el => (docRefs.current[section.id] = el)}
              key={section.id}
              id={section.id}
              className={`bg-card/80 px-6 py-8 rounded-xl shadow-lg animate-fade-in`}
              style={{ animationDelay: `${0.08 * (index + 1)}s`, animationFillMode: "backwards" }}
            >
              <div className="flex items-center gap-4 mb-2">
                <span className="inline-flex p-3 rounded-lg bg-primary/10">
                  <section.icon className="h-7 w-7 text-primary" />
                </span>
                <h3 className="text-xl font-bold">{section.title}</h3>
              </div>
              <div className="text-muted-foreground">{section.content}</div>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center animate-fade-in">
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Full documentation and developer resources are updated regularly. Contact <span className="text-primary">contact@guardianlayer.io</span>{" "}
            for enterprise, custom solutions, or questions about integration.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DocumentationSection;
