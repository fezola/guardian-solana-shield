import { useState } from "react";
import { Key, Shield, Lock, Fingerprint, Mail, Smartphone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CodeBlock from "./CodeBlock";

const AuthSection = () => {
  const [email, setEmail] = useState("");
  const [authMethod, setAuthMethod] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("login"); // login, verify, setup-mfa, complete
  const [verificationCode, setVerificationCode] = useState("");
  
  const handleLogin = () => {
    if (!email) return;
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
    }, 1500);
  };
  
  const handleVerify = () => {
    if (!verificationCode) return;
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("setup-mfa");
    }, 1500);
  };
  
  const handleSetupMFA = (skipSetup = false) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("complete");
    }, 1500);
  };
  
  return (
    <div className="max-w-md mx-auto space-y-6">
      {step === "login" && (
        <Card>
          <CardHeader>
            <CardTitle>Sign In Securely</CardTitle>
            <CardDescription>
              Access your GuardianLayer dashboard with passwordless authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="email" onValueChange={setAuthMethod}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="passkey">
                  <Key className="h-4 w-4 mr-2" />
                  Passkey
                </TabsTrigger>
                <TabsTrigger value="zklogin">
                  <Fingerprint className="h-4 w-4 mr-2" />
                  zkLogin
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <Button 
                  onClick={handleLogin} 
                  disabled={!email || isLoading} 
                  className="w-full"
                >
                  {isLoading ? "Sending Link..." : "Send Magic Link"}
                </Button>
              </TabsContent>
              
              <TabsContent value="passkey" className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/30 text-center">
                  <Fingerprint className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Use your device's biometric authentication or security key
                  </p>
                </div>
                <Button className="w-full">
                  Continue with Passkey
                </Button>
              </TabsContent>
              
              <TabsContent value="zklogin" className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/30 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Zero-knowledge proof login with your Solana wallet
                  </p>
                </div>
                <Button className="w-full">
                  Connect Wallet
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-xs text-muted-foreground">
              Don't have an account? <a href="#" className="text-primary">Sign up</a>
            </p>
          </CardFooter>
        </Card>
      )}
      
      {step === "verify" && (
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Identity</CardTitle>
            <CardDescription>
              Enter the verification code sent to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input 
                id="code" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            <Button 
              onClick={handleVerify} 
              disabled={verificationCode.length !== 6 || isLoading} 
              className="w-full"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-xs text-muted-foreground">
              Didn't receive a code? <a href="#" className="text-primary">Resend</a>
            </p>
          </CardFooter>
        </Card>
      )}
      
      {step === "setup-mfa" && (
        <Card>
          <CardHeader>
            <CardTitle>Set Up Multi-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/30">
              <div className="flex items-center mb-2">
                <Smartphone className="h-5 w-5 mr-2 text-primary" />
                <h4 className="font-semibold">Authenticator App</h4>
              </div>
              <p className="text-sm mb-3">
                Scan this QR code with your authenticator app
              </p>
              <div className="bg-white p-4 mx-auto w-48 h-48 flex items-center justify-center mb-3">
                <div className="text-xs text-center text-muted-foreground">
                  [QR Code Placeholder]
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Or enter this code manually: <code className="bg-muted px-2 py-1 rounded">ABCD EFGH IJKL</code>
                </p>
              </div>
            </div>
            <Button 
              onClick={() => handleSetupMFA()} 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? "Setting Up..." : "Complete Setup"}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => handleSetupMFA(true)}
            >
              Skip for now
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {step === "complete" && (
        <Card>
          <CardHeader>
            <CardTitle>Login Successful</CardTitle>
            <CardDescription>
              You're now securely logged into your GuardianLayer dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="p-4">
              <Shield className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <p>Welcome back! You're now being redirected to your dashboard.</p>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => window.location.href = "/profile"}>
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="p-4 border rounded-md bg-amber-500/10 border-amber-500/30">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          <h4 className="font-semibold">Recovery Options</h4>
        </div>
        <p className="text-sm">
          We recommend setting up a recovery phrase or backup passkey after logging in to ensure you never lose access to your account.
        </p>
      </div>
    </div>
  );
};

export default AuthSection;