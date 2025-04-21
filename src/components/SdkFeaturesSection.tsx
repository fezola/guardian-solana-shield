import { Shield, Fingerprint, Key, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const SdkFeaturesSection = () => {
  return (
    <section id="sdk-features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Core SDK Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our SDK provides a comprehensive security layer with flexible integration options
            for Solana wallets and dApps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <FeatureCard
            icon={Shield}
            title="Transaction Guard + Risk Engine"
            description="Intercepts outgoing transactions and scans for known scam contracts, token drainers, hidden approvals, and high-risk operations."
            apiExample="const result = await guardian.simulateAndCheck(tx);
if (result.risk === 'high') {
  guardian.promptUserApproval(result);
}"
          />

          <FeatureCard
            icon={Fingerprint}
            title="Biometric / Passkey Authentication"
            description="Passwordless login with WebAuthn and device-stored biometric verification for secure wallet access and transaction authorization."
            apiExample="await guardian.authenticateBiometric();
guardian.executeTransaction(tx);"
          />

          <FeatureCard
            icon={Key}
            title="zkLogin with Full zkProofs"
            description="Use zkSNARKs to validate user identity without revealing personal data, generating deterministic wallet addresses from secure inputs."
            apiExample="const proof = await guardian.generateZkProof({
  emailHash: hashedEmail,
  salt: userSalt
});"
          />

          <FeatureCard
            icon={Lock}
            title="Recovery Options"
            description="Self-custody safe recovery options including time-lock keys, Shamir Secret Sharing, biometric recovery, and optional guardians."
            apiExample="await guardian.setupRecovery({
  method: 'shamir',
  threshold: 2,
  shares: 3
});"
          />

          <FeatureCard
            icon={Clock}
            title="Session Monitoring + Wallet Lock"
            description="Inactivity detection with automatic wallet locking and re-authentication requirements for sensitive operations."
            apiExample="guardian.enableSessionMonitoring({
  timeout: 15, // minutes
  lockOnInactivity: true
});"
          />
          
          <Dialog>
            <DialogTrigger asChild>
              <div className="feature-card flex flex-col items-center justify-center text-center cursor-pointer">
                <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                  <div className="h-6 w-6 text-primary">+</div>
                </div>
                <h3 className="text-lg font-bold mb-2">Custom Integration</h3>
                <p className="text-muted-foreground">
                  Need a custom security solution? Our SDK is fully modular and can be tailored to your specific needs.
                </p>
                <Button variant="outline" className="mt-4">Learn More</Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Custom SDK Integration</DialogTitle>
                <DialogDescription>
                  GuardianLayer SDK is designed to be modular and flexible. You can integrate only the features you need, or work with our team to develop custom security solutions for your specific use case.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>Examples of custom integrations:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Custom risk assessment rules for your specific application</li>
                  <li>Integration with your existing authentication system</li>
                  <li>Custom recovery methods for your users</li>
                  <li>Enterprise-grade security features for institutional clients</li>
                </ul>
                <div className="bg-muted/50 p-4 rounded-md">
                  <p className="font-medium">Contact our team to discuss your security needs:</p>
                  <p className="text-primary">contact@guardianlayer.io</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default SdkFeaturesSection;
