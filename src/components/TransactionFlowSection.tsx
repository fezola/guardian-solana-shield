
import { AlertTriangle, Fingerprint, Lock, Mail, Clock, Shield } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const TransactionFlowSection = () => {
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [showTimeLock, setShowTimeLock] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRiskCheck = () => {
    setStep(1);
  };

  const handleBiometricCheck = () => {
    setStep(2);
  };

  const handlePinCheck = () => {
    if (pin === "123456") {
      setStep(3);
    }
  };

  const handleOtpCheck = () => {
    if (otp === "654321") {
      setStep(4);
    }
  };

  const handleTimeLock = () => {
    setShowTimeLock(true);
  };

  const resetFlow = () => {
    setStep(0);
    setPin("");
    setOtp("");
    setShowTimeLock(false);
    setProgress(0);
  };

  const steps = [
    {
      title: "Transaction Simulation & Risk Analysis",
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      description: "Detect drainers, phishing attempts, or hidden approvals before execution.",
      code: `const risk = await guardian.simulateAndCheck(tx);
if (risk.level !== 'safe') {
  await guardian.promptRiskModal(risk);
}`,
      action: handleRiskCheck,
      actionText: "Simulate Transaction"
    },
    {
      title: "Biometric Verification",
      icon: Fingerprint,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Require biometric authentication (FaceID/TouchID) or WebAuthn passkey.",
      code: `await guardian.requireBiometric(); // webauthn or device check`,
      action: handleBiometricCheck,
      actionText: "Authenticate"
    },
    {
      title: "PIN Verification",
      icon: Lock,
      color: "text-indigo-500", 
      bgColor: "bg-indigo-500/10",
      description: "Require user PIN or passphrase to proceed with transaction.",
      code: `const success = await guardian.verifyPIN(userInputPin);
if (!success) throw new Error("PIN incorrect");`,
      action: handlePinCheck,
      actionText: "Verify PIN",
      input: true,
      inputType: "pin"
    },
    {
      title: "Email OTP Verification",
      icon: Mail,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Send and verify a temporary 6-digit code to user's registered email.",
      code: `await guardian.sendEmailOTP();
const confirmed = await guardian.verifyOTP(userInputCode);
if (!confirmed) throw new Error("OTP validation failed");`,
      action: handleOtpCheck,
      actionText: "Verify OTP",
      input: true,
      inputType: "otp"
    },
    {
      title: "Time Delay for Large Transfers",
      icon: Clock,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      description: "Enable optional 24-hour delay for risky or large transactions.",
      code: `if (tx.amount > threshold || risk.level === 'high') {
  await guardian.scheduleTimeLock(tx, delayHours = 24);
}`,
      action: handleTimeLock,
      actionText: "Schedule Transaction"
    }
  ];

  const currentStep = steps[step];

  return (
    <section id="transaction-flow" className="py-24 bg-muted/5">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            Secure Transaction Flow
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Multi-layered transaction protection system with simulation, biometric verification, PIN, OTP, and time-lock features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Multi-Factor Protection Layers</h3>
              <div className="space-y-4">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className={`flex items-center p-4 rounded-lg border ${
                      i === step ? "border-primary" : "border-border/50"
                    } ${i === step ? s.bgColor : "bg-muted/30"}`}
                  >
                    <div className={`mr-4 p-2 rounded-full ${i === step ? s.bgColor : "bg-muted/50"}`}>
                      <s.icon className={`h-5 w-5 ${i === step ? s.color : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h4 className={`font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                        {i + 1}. {s.title}
                      </h4>
                    </div>
                    {i < step && (
                      <div className="ml-auto">
                        <div className="p-1 rounded-full bg-green-500/20">
                          <Shield className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4">Master Transaction Wrapper</h4>
                <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre className="text-muted-foreground whitespace-pre-wrap">
{`await guardian.secureTransaction(tx, {
  biometric: true,
  pin: true,
  otp: true,
  simulate: true,
  timeLockThreshold: 1000, // For txs > 1000 tokens
});`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-full ${currentStep.bgColor} mr-3`}>
                    <currentStep.icon className={`h-5 w-5 ${currentStep.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{currentStep.title}</h3>
                </div>

                <p className="text-muted-foreground mb-6">{currentStep.description}</p>

                <div className="bg-secondary/50 p-4 rounded-md font-mono text-xs overflow-x-auto mb-6">
                  <pre className="text-muted-foreground">
                    <code>{currentStep.code}</code>
                  </pre>
                </div>

                {step === 0 && (
                  <div className="mb-6">
                    <Alert variant="destructive" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Risk Detected</AlertTitle>
                      <AlertDescription>
                        This transaction attempts to request token approvals beyond what's required.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Level</span>
                        <span className="text-amber-500 font-medium">High</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Contract Address</span>
                        <span className="text-muted-foreground">drainer.8xk...9p3k.sol</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Transaction Type</span>
                        <span className="text-muted-foreground">Token Approval</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="pin" className="block text-sm font-medium mb-1">
                        Enter 6-digit PIN
                      </label>
                      <div className="flex gap-2">
                        {Array(6)
                          .fill(0)
                          .map((_, i) => (
                            <input
                              key={i}
                              type="password"
                              maxLength={1}
                              className="w-10 h-10 text-center border rounded-md bg-background"
                              value={pin[i] || ""}
                              onChange={(e) => {
                                const newPin = pin.split("");
                                newPin[i] = e.target.value;
                                setPin(newPin.join(""));
                              }}
                            />
                          ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        For demo purposes, use PIN: 123456
                      </p>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="mb-6">
                    <div className="mb-4">
                      <label htmlFor="otp" className="block text-sm font-medium mb-1">
                        Enter OTP from Email
                      </label>
                      <div className="flex gap-2">
                        {Array(6)
                          .fill(0)
                          .map((_, i) => (
                            <input
                              key={i}
                              type="text"
                              maxLength={1}
                              className="w-10 h-10 text-center border rounded-md bg-background"
                              value={otp[i] || ""}
                              onChange={(e) => {
                                const newOtp = otp.split("");
                                newOtp[i] = e.target.value;
                                setOtp(newOtp.join(""));
                              }}
                            />
                          ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        For demo purposes, use OTP: 654321
                      </p>
                    </div>
                  </div>
                )}

                {showTimeLock ? (
                  <div className="mb-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Time Delay</span>
                          <span>24 hours remaining</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Transaction has been scheduled due to high risk level or amount. You can cancel
                        it anytime within 24 hours.
                      </p>
                      <div className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={resetFlow}>
                          Cancel Transaction
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">View Details</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Transaction Details</DialogTitle>
                              <DialogDescription>
                                This transaction has been scheduled with a 24-hour delay due to security policies.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">Transaction Type</span>
                                  <span>Token Transfer</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">Amount</span>
                                  <span>2,500 SOL</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">Recipient</span>
                                  <span>unknown.8px3...m29k.sol</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">Risk Level</span>
                                  <span className="text-amber-500">High</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">Scheduled</span>
                                  <span>April 21, 2025 14:30 UTC</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">Execution</span>
                                  <span>April 22, 2025 14:30 UTC</span>
                                </div>
                              </div>
                              <Button variant="destructive" onClick={resetFlow} className="w-full">
                                Cancel Transaction
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      className="mb-2 w-full"
                      onClick={currentStep.action}
                      disabled={
                        (currentStep.inputType === "pin" && pin.length !== 6) ||
                        (currentStep.inputType === "otp" && otp.length !== 6)
                      }
                    >
                      {currentStep.actionText}
                    </Button>
                    {step > 0 && (
                      <Button variant="outline" className="w-full" onClick={resetFlow}>
                        Reset Flow
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/50">
              <CardContent className="pt-6">
                <h4 className="text-lg font-semibold mb-4">SDK Implementation</h4>
                <div className="bg-secondary/50 p-4 rounded-md font-mono text-xs overflow-x-auto">
                  <pre className="text-muted-foreground whitespace-pre-wrap">
{`export async function secureTransaction(
  tx: Transaction,
  options: SecureTransactionOptions
): Promise<void> {
  // 1. Simulation check
  if (options.simulate) {
    const risk = await simulateAndCheck(tx);
    if (risk.level !== 'safe') {
      throw new Error(\`Transaction flagged: \${risk.reason}\`);
    }
  }

  // 2. Biometric / passkey verification
  if (options.biometric) {
    const auth = await requireBiometric();
    if (!auth) throw new Error("Biometric verification failed");
  }

  // 3. PIN check
  if (options.pin && options.userPIN) {
    const valid = await verifyPIN(options.userPIN);
    if (!valid) throw new Error("Incorrect PIN");
  }

  // 4. Email OTP
  if (options.otp && options.userEmail) {
    await sendEmailOTP(options.userEmail);
    const inputCode = await promptOTP();
    const verified = await verifyOTP(inputCode);
    if (!verified) throw new Error("OTP verification failed");
  }

  // 5. Time-lock for large/risky tx
  const amount = extractTransferAmount(tx);
  if (options.timeLockThreshold && amount > options.timeLockThreshold) {
    await scheduleTimeLock(tx, 24); // 24-hour hold
    throw new Error("Transaction scheduled with 24h lock for review");
  }

  // Finally: return control to wallet to sign/send transaction
  console.log("GuardianLayer: All security checks passed.");
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionFlowSection;
