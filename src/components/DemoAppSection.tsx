
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Fingerprint, Key, AlertTriangle } from "lucide-react";
import CodeBlock from "./CodeBlock";

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

export default DemoAppSection;
