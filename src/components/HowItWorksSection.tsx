
import { Shield, LockKeyhole, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-feature-gradient z-0" />
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How GuardianLayer Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our SDK integrates seamlessly with any Solana wallet application, providing multiple layers
            of security while maintaining full decentralization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          <div className="p-6 rounded-xl border border-border/50 bg-muted/30 backdrop-blur-sm text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Transaction Screening</h3>
            <p className="text-muted-foreground">
              Every transaction is simulated and analyzed in real-time before execution, identifying potential risks 
              and allowing users to make informed decisions.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/50 bg-muted/30 backdrop-blur-sm text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
              <LockKeyhole className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Key Management</h3>
            <p className="text-muted-foreground">
              Multiple recovery options including time-locked keys, social recovery via Shamir Secret Sharing, 
              and biometric authentication for seamless access.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/50 bg-muted/30 backdrop-blur-sm text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">User Control</h3>
            <p className="text-muted-foreground">
              All security features are opt-in and configurable, giving users complete control over their security 
              while maintaining a smooth user experience.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button className="button-glow">Learn More About Our Technology</Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
