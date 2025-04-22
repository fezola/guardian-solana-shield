
import { useState } from "react";
import { Key, Copy, Shield, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeBlock from "./CodeBlock";
import { useNavigate } from "react-router-dom";

const ApiKeySection = () => {
  const [apiKey, setApiKey] = useState("gl_live_xxxxxxxxxxxxxxxxxxxx");
  const [environment, setEnvironment] = useState("production");
  const [showKey, setShowKey] = useState(false);
  const [projectName, setProjectName] = useState("My Solana dApp");
  const navigate = useNavigate();
  
  // Generate a new API key
  const generateNewKey = () => {
    const newKey = `gl_${environment === "production" ? "live" : "test"}_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
  };

  // Copy API key to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    // You could add a toast notification here
  };

  // Masked API key for display
  const maskedKey = showKey ? apiKey : apiKey.substring(0, 8) + "•".repeat(apiKey.length - 8);

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">API Key Management</h3>
        <p className="text-muted-foreground mb-6">
          Generate and manage API keys to integrate GuardianLayer with your applications.
        </p>

        <div className="space-y-6">
          <div className="p-4 border rounded-md bg-muted/30">
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input 
                  id="project-name" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Solana dApp"
                />
              </div>
              <div>
                <Label htmlFor="environment">Environment</Label>
                <select 
                  id="environment"
                  className="w-full p-2 rounded-md border"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                >
                  <option value="development">Development</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <div className="flex items-center mb-2">
              <Key className="h-5 w-5 mr-2 text-primary" />
              <h4 className="font-semibold">Your API Key</h4>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <code className="bg-muted px-3 py-2 rounded text-sm font-mono flex-1">
                {maskedKey}
              </code>
              <Button variant="ghost" size="sm" onClick={() => setShowKey(!showKey)}>
                {showKey ? "Hide" : "Show"}
              </Button>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={generateNewKey} className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Key
              </Button>
              <Button variant="default" onClick={() => navigate("/profile")}>
                Manage All Keys
              </Button>
            </div>
          </div>

          <div className="p-4 border rounded-md bg-amber-500/10 border-amber-500/30">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              <h4 className="font-semibold">API Key Security</h4>
            </div>
            <p className="text-sm">
              Keep your API keys secure and never expose them in client-side code. Use environment variables
              or secure vaults to store your keys in production environments.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">Implementation Guide</h3>
        <Tabs defaultValue="javascript">
          <TabsList className="mb-4">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="rust">Rust</TabsTrigger>
          </TabsList>

          <TabsContent value="javascript">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Initialize with API Key</h4>
                <CodeBlock
                  code={`import { GuardianLayer } from '@guardianlayer/sdk';

// Initialize with your API key
const guardian = new GuardianLayer({
  apiKey: "${maskedKey}", // Your API key
  wallet: yourWalletProvider,
  modules: ['txSecurity', 'recovery', 'biometric']
});`}
                  language="javascript"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="python">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Initialize with API Key</h4>
                <CodeBlock
                  code={`from guardianlayer import GuardianLayer

# Initialize with your API key
guardian = GuardianLayer(
    api_key="${maskedKey}", # Your API key
    wallet=your_wallet_provider,
    modules=['txSecurity', 'recovery', 'biometric']
)`}
                  language="python"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rust">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Initialize with API Key</h4>
                <CodeBlock
                  code={`use guardianlayer_sdk::GuardianLayer;

// Initialize with your API key
let guardian = GuardianLayer::new()
    .with_api_key("${maskedKey}") // Your API key
    .with_wallet(your_wallet_provider)
    .with_modules(vec!["txSecurity", "recovery", "biometric"])
    .build();`}
                  language="rust"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">Need More API Keys?</h3>
        <p className="text-muted-foreground mb-4">
          Create and manage multiple API keys for different projects and environments.
        </p>
        <Button onClick={() => window.location.href = "/profile"} className="w-full">
          Go to User Profile
        </Button>
      </div>
    </div>
  );
};

export default ApiKeySection;
