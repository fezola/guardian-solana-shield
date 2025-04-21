
import { Button } from "@/components/ui/button";

const IntegrationSection = () => {
  return (
    <section id="integration" className="py-24 bg-muted/5">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple Integration</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Add GuardianLayer to your Solana wallet application in just a few steps,
            with flexible integration options to suit your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Integrate with Just a Few Lines of Code</h3>
              <p className="text-muted-foreground mb-4">
                Our SDK is designed to be easy to integrate, with comprehensive documentation and
                examples to help you get started quickly.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                <h4 className="text-sm font-bold mb-2">1. Install the package</h4>
                <div className="bg-secondary p-3 rounded-md overflow-x-auto">
                  <pre className="text-sm text-muted-foreground">
                    <code>npm install @guardianlayer/sdk</code>
                  </pre>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                <h4 className="text-sm font-bold mb-2">2. Initialize the SDK</h4>
                <div className="bg-secondary p-3 rounded-md overflow-x-auto">
                  <pre className="text-sm text-muted-foreground">
                    <code>{`import { GuardianLayer } from '@guardianlayer/sdk';

// Initialize with your wallet provider
const guardian = new GuardianLayer({
  wallet: yourWalletProvider,
  modules: ['txSecurity', 'recovery', 'biometric']
});`}</code>
                  </pre>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                <h4 className="text-sm font-bold mb-2">3. Secure your transactions</h4>
                <div className="bg-secondary p-3 rounded-md overflow-x-auto">
                  <pre className="text-sm text-muted-foreground">
                    <code>{`// Wrap your transaction with GuardianLayer protection
const secureTransaction = async () => {
  const tx = createYourTransaction();
  
  // GuardianLayer will analyze and protect the transaction
  const securedTx = await guardian.secureTx(tx);
  
  // Proceed with the transaction if it passes security checks
  if (securedTx.safe) {
    await wallet.sendTransaction(securedTx.transaction);
  }
};`}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button className="button-glow">View Full Documentation</Button>
              <Button variant="outline">See Example Projects</Button>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border/50 bg-muted/30 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">Or Use Our React Components</h3>
            <p className="text-muted-foreground mb-6">
              For even faster integration, use our pre-built React components that handle all the security
              logic for you with minimal configuration.
            </p>

            <div className="bg-secondary p-3 rounded-md overflow-x-auto mb-6">
              <pre className="text-sm text-muted-foreground">
                <code>{`import { GuardianProvider, SecureTransactionButton } from '@guardianlayer/react';

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
}`}</code>
              </pre>
            </div>

            <Button variant="outline" className="w-full">Explore React Components</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;
