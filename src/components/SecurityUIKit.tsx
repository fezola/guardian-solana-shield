
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Code2, 
  Palette,
  Fingerprint,
  Lock,
  Mail,
  AlertTriangle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SecurityUIKit = () => {
  const { toast } = useToast();
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');

  const copyComponentCode = (code: string, componentName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedComponent(componentName);
    setTimeout(() => setCopiedComponent(null), 2000);
    toast({
      title: "Component copied",
      description: `${componentName} code has been copied to your clipboard`,
    });
  };

  const securityModalCode = `import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield } from "lucide-react";

interface SecurityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  onApprove: () => void;
  onReject: () => void;
}

export function SecurityModal({ open, onOpenChange, riskLevel, description, onApprove, onReject }: SecurityModalProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'critical': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>Security Alert</DialogTitle>
          </div>
          <DialogDescription>
            A potential security risk has been detected in this transaction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className={\`p-4 rounded-lg \${getRiskColor(riskLevel)}\`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">Risk Level</span>
              <span className="font-bold uppercase">{riskLevel}</span>
            </div>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm">{description}</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="destructive" onClick={onReject} className="flex-1">
              Block Transaction
            </Button>
            <Button variant="outline" onClick={onApprove} className="flex-1">
              Proceed Anyway
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}`;

  const biometricPromptCode = `import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fingerprint, Loader2 } from "lucide-react";

interface BiometricPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function BiometricPrompt({ open, onOpenChange, onSuccess, onError }: BiometricPromptProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      onError("Biometric authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Fingerprint className="h-5 w-5" />
            <span>Biometric Authentication</span>
          </DialogTitle>
          <DialogDescription>
            Please authenticate using your biometric sensor to proceed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-6">
          <div className="p-6 bg-primary/10 rounded-full">
            {isAuthenticating ? (
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            ) : (
              <Fingerprint className="h-12 w-12 text-primary" />
            )}
          </div>
          
          <Button 
            onClick={handleAuthenticate} 
            disabled={isAuthenticating}
            className="w-full"
          >
            {isAuthenticating ? "Authenticating..." : "Authenticate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}`;

  const pinInputCode = `import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface PinInputProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (pin: string) => void;
  onError: (error: string) => void;
}

export function PinInput({ open, onOpenChange, onSuccess, onError }: PinInputProps) {
  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = pin.split("");
    newPin[index] = value;
    setPin(newPin.join(""));
  };

  const handleVerify = async () => {
    if (pin.length !== 6) return;
    setIsVerifying(true);
    
    try {
      // Simulate PIN verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess(pin);
      setPin("");
      onOpenChange(false);
    } catch (error) {
      onError("Invalid PIN");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Enter Security PIN</span>
          </DialogTitle>
          <DialogDescription>
            Please enter your 6-digit security PIN to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-center space-x-2">
            {Array(6).fill(0).map((_, i) => (
              <input
                key={i}
                type="password"
                maxLength={1}
                className="w-12 h-12 text-center border rounded-md bg-background text-lg font-bold"
                value={pin[i] || ""}
                onChange={(e) => handlePinChange(i, e.target.value)}
              />
            ))}
          </div>
          
          <Button 
            onClick={handleVerify} 
            disabled={pin.length !== 6 || isVerifying}
            className="w-full"
          >
            {isVerifying ? "Verifying..." : "Verify PIN"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}`;

  const components = [
    {
      name: "Security Alert Modal",
      description: "Modal component for displaying security risks and warnings",
      code: securityModalCode,
      icon: AlertTriangle,
      color: "text-amber-500"
    },
    {
      name: "Biometric Prompt",
      description: "UI component for biometric authentication prompts",
      code: biometricPromptCode,
      icon: Fingerprint,
      color: "text-blue-500"
    },
    {
      name: "PIN Input",
      description: "Secure PIN input component with verification",
      code: pinInputCode,
      icon: Lock,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Guardian Security UI Kit</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Pre-built, customizable security components that you can integrate directly into your project. 
          Built with shadcn/ui and fully customizable to match your design system.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="secondary">React Components</Badge>
        <Badge variant="secondary">TypeScript</Badge>
        <Badge variant="secondary">Tailwind CSS</Badge>
        <Badge variant="secondary">shadcn/ui</Badge>
      </div>

      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-500/20 rounded-full">
              <Download className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Installation</h3>
              <code className="text-sm text-muted-foreground">npm install @guardian-shield/ui-kit</code>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Kit
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((component, index) => (
          <Card key={index} className="relative group">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <component.icon className={`h-5 w-5 ${component.color}`} />
                <CardTitle className="text-lg">{component.name}</CardTitle>
              </div>
              <CardDescription>{component.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyComponentCode(component.code, component.name)}
                  className="flex-1"
                >
                  {copiedComponent === component.name ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy Code
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usage">Usage Guide</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
          <TabsTrigger value="examples">Live Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>
                Get started with Guardian Security UI components in your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Install the package</h4>
                <div className="bg-muted/50 p-3 rounded-md">
                  <code className="text-sm">npm install @guardian-shield/ui-kit</code>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">2. Import components</h4>
                <div className="bg-muted/50 p-3 rounded-md">
                  <code className="text-sm">import {`{ SecurityModal, BiometricPrompt, PinInput }`} from '@guardian-shield/ui-kit';</code>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">3. Use in your app</h4>
                <div className="bg-muted/50 p-3 rounded-md">
                  <pre className="text-sm">
{`<SecurityModal 
  open={showModal}
  riskLevel="high"
  description="Suspicious transaction detected"
  onApprove={() => console.log('Approved')}
  onReject={() => console.log('Rejected')}
/>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Customization Options</span>
              </CardTitle>
              <CardDescription>
                Customize components to match your brand and design system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Code2 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">CSS Custom Properties for theming</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Tailwind CSS classes for styling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Component prop overrides</span>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Example: Custom Colors</h4>
                <pre className="text-sm">
{`:root {
  --guardian-primary: #your-brand-color;
  --guardian-danger: #your-danger-color;
  --guardian-warning: #your-warning-color;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Examples</CardTitle>
              <CardDescription>
                See the components in action with live previews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Live Preview Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive examples and component playground will be available in the next release.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityUIKit;
