
import React, { useState } from 'react';
import { Key, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const ApiKeySection = () => {
  const [apiKey, setApiKey] = useState('gls_k1_73f89a1cb8d54e6fb9c283d7b9e12f36');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({
      title: "API key copied to clipboard",
      description: "Your API key has been copied to clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    setRegenerating(true);
    // Simulate API call to regenerate key
    setTimeout(() => {
      const newKey = 'gls_k1_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setApiKey(newKey);
      setRegenerating(false);
      toast({
        title: "API key regenerated",
        description: "Your API key has been regenerated. Make sure to update it in your applications."
      });
    }, 1000);
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">API Key Management</h2>
        <p className="text-muted-foreground mb-6">
          Use your API key to authenticate requests to the GuardianLayer API. Keep your API key secure and do not expose it in client-side code.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5 text-primary" />
            Your API Key
          </CardTitle>
          <CardDescription>
            Use this key to authenticate your API requests to GuardianLayer services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                readOnly
                className="pr-10 font-mono text-sm"
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center"
              onClick={handleCopyKey}
              disabled={copied}
            >
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Last regenerated: April 22, 2025
          </p>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleRegenerateKey}
            disabled={regenerating}
          >
            {regenerating ? "Regenerating..." : "Regenerate Key"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Key Usage Example</CardTitle>
          <CardDescription>
            Here's how to use your API key in various programming languages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">JavaScript/TypeScript</h4>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
              <code className="text-foreground">
{`import { GuardianLayer } from '@guardianlayer/sdk';

// Initialize with API key
const guardian = new GuardianLayer({
  apiKey: '${apiKey}', // Your API key
  environment: 'production' // Or 'sandbox' for testing
});

// Now you can use the SDK
const result = await guardian.secureTx(transaction);`}
              </code>
            </pre>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Python</h4>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
              <code className="text-foreground">
{`from guardianlayer import GuardianLayer

# Initialize with API key
guardian = GuardianLayer(
    api_key="${apiKey}", # Your API key
    environment="production" # Or 'sandbox' for testing
)

# Now you can use the SDK
result = guardian.secure_tx(transaction)`}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ApiKeySection;
