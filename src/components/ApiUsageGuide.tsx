
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Key, Zap, Shield, ExternalLink } from "lucide-react";
import CodeBlock from "./CodeBlock";

const ApiUsageGuide = () => {

  const sdkExample = `import { GuardianShield } from '@guardian-shield/sdk';

// Initialize the SDK
const guardian = new GuardianShield({
  apiKey: 'gl_live_your_api_key_here',
  environment: 'production'
});

// Secure transaction with multiple protection layers
await guardian.secureTransaction(transaction, {
  biometric: true,
  pin: true,
  otp: true,
  simulate: true,
  timeLockThreshold: 1000
});`;

  const apiExample = `// REST API Usage
const response = await fetch('https://api.guardian-shield.com/v1/transactions/secure', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer gl_live_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    transaction: encodedTransaction,
    security_options: {
      biometric: true,
      pin: true,
      otp: true,
      simulate: true
    }
  })
});

const result = await response.json();`;

  const reactComponentExample = `import { GuardianProvider, SecureWallet } from '@guardian-shield/react';

function App() {
  return (
    <GuardianProvider apiKey="gl_live_your_api_key_here">
      <SecureWallet 
        onTransaction={(tx) => console.log('Secured transaction:', tx)}
        securityLevel="high"
      />
    </GuardianProvider>
  );
}`;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Implementation Guide</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the integration method that best fits your project. Compare our SDK integration 
          with direct API usage to find the perfect approach for your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SDK Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-500" />
              <CardTitle>SDK Integration</CardTitle>
            </div>
            <CardDescription>
              Direct codebase integration with our React SDK
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                Recommended for React Apps
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="text-sm">Easy React integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm">Type-safe components</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-green-500" />
                <span className="text-sm">Built-in UI components</span>
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Installation</h4>
              </div>
              <code className="text-xs">npm install @guardian-shield/react</code>
            </div>
          </CardContent>
        </Card>

        {/* API Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-purple-500" />
              <CardTitle>API Integration</CardTitle>
            </div>
            <CardDescription>
              Direct API calls using your API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-700">
                Universal Compatibility
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Framework agnostic</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="text-sm">RESTful endpoints</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Custom implementation</span>
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Base URL</h4>
              </div>
              <code className="text-xs">https://api.guardian-shield.com/v1</code>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sdk" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sdk">SDK Usage</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
          <TabsTrigger value="react">React Components</TabsTrigger>
        </TabsList>

        <TabsContent value="sdk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SDK Implementation Example</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={sdkExample} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>REST API Implementation Example</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={apiExample} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="react" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>React Component Example</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={reactComponentExample} language="javascript" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <ExternalLink className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Need Help Getting Started?</h3>
              <p className="text-sm text-muted-foreground">
                Check out our comprehensive documentation and interactive examples.
              </p>
            </div>
            <Button variant="outline">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiUsageGuide;
