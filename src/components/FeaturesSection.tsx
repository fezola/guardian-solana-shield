import FeatureCard from "./FeatureCard";
import { Shield, Key, Fingerprint, ShieldAlert } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-muted/5">
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Security Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            GuardianLayer provides a complete security suite that can be integrated as a whole or as individual modules,
            giving developers the flexibility they need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <FeatureCard
            icon={ShieldAlert}
            title="Smart Transaction Risk Detection"
            description="Real-time simulation and risk classification for all transactions before execution, flagging potential scams."
          />
          <FeatureCard
            icon={Key}
            title="Self-Custodial Recovery"
            description="Multiple recovery methods including time-lock keys and Shamir Secret Sharing without compromising security."
          />
          <FeatureCard
            icon={Fingerprint}
            title="Biometric Authentication"
            description="Add an extra layer of security with biometric verification and passkey authentication."
          />
          <FeatureCard
            icon={Shield}
            title="Anti-Scam Protection"
            description="Identify and block malicious transactions and contracts before they can access your assets."
          />
        </div>

        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            All features are designed to be modular and can be enabled or disabled based on your specific needs,
            providing full control over your security implementation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
