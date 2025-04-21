
import { AlertTriangle, Shield, Fingerprint, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const ReactComponentsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(30);

  return (
    <section id="react-components" className="py-24 bg-muted/5">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 gradient-text">React UI Components</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready-made React components to quickly integrate GuardianLayer's security features into your application.
          </p>
        </div>

        <Tabs defaultValue="transaction" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="transaction">Transaction</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
            <TabsTrigger value="biometric">Biometric</TabsTrigger>
            <TabsTrigger value="zklogin">zkLogin</TabsTrigger>
            <TabsTrigger value="progress">Tracking</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transaction" className="space-y-8">
            <div className="border rounded-lg p-6 bg-muted/30">
              <div className="flex items-start mb-6">
                <AlertTriangle className="h-8 w-8 text-amber-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">&lt;TransactionWarning /&gt;</h3>
                  <p className="text-muted-foreground mb-4">
                    A customizable warning component that displays details about potentially risky transactions and requires explicit user confirmation.
                  </p>
                </div>
              </div>

              <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                        <h4 className="font-semibold text-amber-500">High Risk Transaction Detected</h4>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">Details</Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">This transaction contains permissions that could allow the recipient to:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Access all tokens in your wallet</li>
                        <li>Execute future transactions without approval</li>
                      </ul>
                    </div>
                    <div className="pt-2 flex justify-between items-center">
                      <Button variant="outline" size="sm">Cancel</Button>
                      <Button variant="destructive" size="sm">Continue Anyway</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
{`import { TransactionWarning } from "@guardianlayer/react";

// In your component
<TransactionWarning 
  transaction={transaction}
  riskLevel="high"
  riskDetails={riskDetails}
  onCancel={() => cancelTransaction()}
  onConfirm={() => proceedWithTransaction()}
/>`}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recovery" className="space-y-8">
            <div className="border rounded-lg p-6 bg-muted/30">
              <div className="flex items-start mb-6">
                <Shield className="h-8 w-8 text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">&lt;GuardianRecoverySetup /&gt;</h3>
                  <p className="text-muted-foreground mb-4">
                    A multi-step wizard for setting up wallet recovery options, including time-lock, Shamir shares, and guardian selection.
                  </p>
                </div>
              </div>

              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <h4 className="font-semibold">Configure Wallet Recovery</h4>
                    
                    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">Recovery Methods</h4>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {isOpen ? "Hide Options" : "Show Options"}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      
                      <CollapsibleContent className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="timelock" className="mt-1" />
                          <div className="grid gap-1.5">
                            <label
                              htmlFor="timelock"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Time-lock Backup Key (7 days)
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Enable backup key access after a 7-day waiting period.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="shamir" className="mt-1" />
                          <div className="grid gap-1.5">
                            <label
                              htmlFor="shamir"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Shamir Secret Sharing (2 of 3)
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Split recovery across multiple devices. Requires 2 out of 3 shares.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="biometric" className="mt-1" />
                          <div className="grid gap-1.5">
                            <label
                              htmlFor="biometric"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Biometric Recovery
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Link recovery to your device's biometric authentication.
                            </p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <div className="flex justify-end pt-2">
                      <Button>Continue Setup</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
{`import { GuardianRecoverySetup } from "@guardianlayer/react";

// In your component
<GuardianRecoverySetup
  wallet={walletInstance}
  onComplete={handleSetupComplete}
  options={{
    enableTimelock: true,
    enableShamir: true,
    enableBiometric: true,
    timelockDays: 7
  }}
/>`}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="biometric" className="space-y-8">
            <div className="border rounded-lg p-6 bg-muted/30">
              <div className="flex items-start mb-6">
                <Fingerprint className="h-8 w-8 text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">&lt;BiometricAuthButton /&gt;</h3>
                  <p className="text-muted-foreground mb-4">
                    A button component that triggers WebAuthn or device biometric authentication before executing sensitive actions.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 mb-6">
                <Button className="w-full sm:w-auto flex items-center gap-2">
                  <Fingerprint className="h-4 w-4" />
                  Authenticate with Biometrics
                </Button>
                
                <Card className="w-full">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <Fingerprint className="h-12 w-12 text-primary mb-4" />
                    <h4 className="font-semibold mb-2">Touch Sensor</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use your fingerprint or face recognition to authenticate this transaction
                    </p>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
{`import { BiometricAuthButton } from "@guardianlayer/react";

// In your component
<BiometricAuthButton
  onAuthenticated={() => handleAuthSuccess()}
  onCancelled={() => handleCancel()}
  onFailed={(error) => handleAuthError(error)}
>
  Send Transaction Securely
</BiometricAuthButton>`}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="zklogin" className="space-y-8">
            <div className="border rounded-lg p-6 bg-muted/30">
              <div className="flex items-start mb-6">
                <Mail className="h-8 w-8 text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">&lt;EmailLoginWithZk /&gt;</h3>
                  <p className="text-muted-foreground mb-4">
                    A component that handles the zkLogin flow, allowing users to login with email while generating zkProofs for authentication.
                  </p>
                </div>
              </div>

              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-4 py-4">
                    <Mail className="h-10 w-10 text-primary" />
                    <h4 className="font-semibold">Login with Email</h4>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Securely log in with your email using zkProof technology. Your email is never stored and your privacy is protected.
                    </p>
                    <div className="w-full max-w-xs space-y-4 pt-2">
                      <Button className="w-full">Continue with Google</Button>
                      <Button variant="outline" className="w-full">Use Another Email</Button>
                    </div>
                    <p className="text-xs text-muted-foreground pt-4">
                      Zero-knowledge proofs protect your privacy while verifying your identity
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
{`import { EmailLoginWithZk } from "@guardianlayer/react";

// In your component
<EmailLoginWithZk
  onSuccess={(wallet) => handleLogin(wallet)}
  onError={(error) => handleLoginError(error)}
  providers={["google", "email"]}
  zkOptions={{
    generateProof: true,
    storeSession: true
  }}
/>`}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-8">
            <div className="border rounded-lg p-6 bg-muted/30">
              <div className="flex items-start mb-6">
                <Clock className="h-8 w-8 text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">&lt;RecoveryProgressTracker /&gt;</h3>
                  <p className="text-muted-foreground mb-4">
                    A progress tracking component for time-based recovery processes like time-lock keys.
                  </p>
                </div>
              </div>

              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Recovery in Progress</h4>
                        <span className="text-sm text-muted-foreground">3 days remaining</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        Recovery key will be available on April 24, 2025
                      </p>
                    </div>
                    
                    <div className="pt-2 flex justify-between">
                      <Button variant="outline" size="sm">Cancel Recovery</Button>
                      <Button size="sm" disabled>Recovery Key (Locked)</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre className="text-muted-foreground">
{`import { RecoveryProgressTracker } from "@guardianlayer/react";

// In your component
<RecoveryProgressTracker
  startTime={startTimestamp}
  endTime={endTimestamp}
  recoveryType="timelock"
  onCancel={() => cancelRecovery()}
  onComplete={() => handleRecoveryComplete()}
/>`}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ReactComponentsSection;
