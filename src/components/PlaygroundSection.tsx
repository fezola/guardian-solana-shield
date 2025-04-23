import { 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  XCircle, 
  Fingerprint, 
  Key,
  Clock
} from "lucide-react";

const PlaygroundSection = () => {
  const [activeTab, setActiveTab] = useState("transaction-security");
  const [transactionSimulation, setTransactionSimulation] = useState({
    type: "transfer",
    from: "0x1234...5678",
    to: "0xabcd...ef01",
    amount: "5",
    token: "ETH",
    recipientType: "unknown",
  });
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [apiKeyTestType, setApiKeyTestType] = useState("verification");
  const [apiKeyTestResult, setApiKeyTestResult] = useState(null);
  const [apiKeyTestLoading, setApiKeyTestLoading] = useState(false);
  
  const handleTransactionTypeChange = (value) => {
    setTransactionSimulation({
      ...transactionSimulation,
      type: value,
      recipientType: value === "approval" ? "contract" : "unknown"
    });
  };
  
  const handleTransactionChange = (field, value) => {
    setTransactionSimulation({
      ...transactionSimulation,
      [field]: value
    });
  };
  
  const runTransactionSimulation = () => {
    setSimulationLoading(true);
    
    setTimeout(() => {
      let risk;
      let warnings = [];
      
      if (transactionSimulation.type === "approval") {
        risk = "high";
        warnings = ["Unlimited token approval requested", "Contract has not been audited"];
      } else if (transactionSimulation.type === "transfer" && parseFloat(transactionSimulation.amount) > 3 && transactionSimulation.recipientType === "unknown") {
        risk = "medium";
        warnings = ["Large transaction to an unknown address", "Address not in your contacts"];
      } else if (transactionSimulation.type === "swap" && parseFloat(transactionSimulation.amount) > 1) {
        risk = "medium";
        warnings = ["High slippage detected (12%)", "Price impact over 5%"];
      } else {
        risk = "low";
        warnings = transactionSimulation.recipientType === "unknown" ? ["Address not in your contacts"] : [];
      }
      
      setSimulationResult({
        risk,
        warnings,
        timestamp: new Date().toISOString(),
        securityRecommendations: {
          biometric: risk !== "low",
          otp: risk === "high",
          confirmationDelay: risk === "high" ? 30 : 0
        }
      });
      setSimulationLoading(false);
    }, 1500);
  };
  
  const runApiKeyTest = () => {
    setApiKeyTestLoading(true);
    
    setTimeout(() => {
      const results = {
        verification: {
          valid: true,
          keyType: "Public Test API Key",
          permissions: ["tx.simulate", "auth.basic", "recovery.read"],
          projects: ["My Solana dApp"],
          environment: "test",
          lastUsed: "2 hours ago"
        },
        rateLimit: {
          valid: true,
          currentUsage: 280,
          limit: 1000,
          resetTime: "2023-11-16T00:00:00Z",
          ratePerMinute: 60
        },
        permissions: {
          valid: true,
          allowedOperations: ["tx.simulate", "tx.secure", "auth.basic", "auth.biometric", "recovery.read"],
          deniedOperations: ["admin.*", "billing.*"]
        }
      };
      
      setApiKeyTestResult(results[apiKeyTestType]);
      setApiKeyTestLoading(false);
    }, 1000);
  };
  
  const transactionCodeExample = `// GuardianLayer secure transaction example
import { GuardianLayer } from '@guardianlayer/sdk';

// Initialize the SDK
const guardian = new GuardianLayer({
  apiKey: "YOUR_API_KEY"
});

// Security wrapper for transactions
async function secureSendTransaction(tx) {
  try {
    const result = await guardian.secureTransaction({
      transaction: tx,
      options: {
        simulate: true,
        biometric: ${simulationResult?.securityRecommendations?.biometric || false},
        otp: ${simulationResult?.securityRecommendations?.otp || false},
        userEmail: "user@example.com",
        confirmationDelay: ${simulationResult?.securityRecommendations?.confirmationDelay || 0}
      }
    });
    
    console.log("Transaction secured:", result);
    return result;
    
  } catch (error) {
    console.error("Transaction rejected:", error);
    throw error;
  }
}`;

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">Developer Playground</h3>
        <p className="text-muted-foreground mb-6">
          Interactive tools to test and understand GuardianLayer security features.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="transaction-security">Transaction Security</TabsTrigger>
            <TabsTrigger value="api-key-test">API Key Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transaction-security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Simulator</CardTitle>
                  <CardDescription>Test transaction security and risk assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Transaction Type</label>
                      <Select value={transactionSimulation.type} onValueChange={handleTransactionTypeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transfer">Transfer</SelectItem>
                          <SelectItem value="swap">Token Swap</SelectItem>
                          <SelectItem value="approval">Token Approval</SelectItem>
                          <SelectItem value="nft">NFT Purchase</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <Input 
                          type="number"
                          value={transactionSimulation.amount}
                          onChange={(e) => handleTransactionChange('amount', e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Token</label>
                        <Select value={transactionSimulation.token} onValueChange={(value) => handleTransactionChange('token', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select token" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ETH">ETH</SelectItem>
                            <SelectItem value="SOL">SOL</SelectItem>
                            <SelectItem value="USDC">USDC</SelectItem>
                            <SelectItem value="USDT">USDT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">From Address</label>
                      <Input 
                        value={transactionSimulation.from} 
                        onChange={(e) => handleTransactionChange('from', e.target.value)} 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">To Address</label>
                      <Input 
                        value={transactionSimulation.to} 
                        onChange={(e) => handleTransactionChange('to', e.target.value)} 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Recipient Type</label>
                      <Select 
                        value={transactionSimulation.recipientType} 
                        onValueChange={(value) => handleTransactionChange('recipientType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipient type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="known">Known Contact</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="exchange">Exchange</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={runTransactionSimulation} disabled={simulationLoading}>
                    {simulationLoading ? "Simulating..." : "Run Simulation"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis Results</CardTitle>
                  <CardDescription>
                    Security assessment and recommendations for your transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {simulationResult ? (
                    <div className="space-y-4">
                      <div className={`p-4 border rounded-md ${
                        simulationResult.risk === 'high' ? 'bg-red-500/10 border-red-500/30' :
                        simulationResult.risk === 'medium' ? 'bg-amber-500/10 border-amber-500/30' :
                        'bg-green-500/10 border-green-500/30'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Risk Assessment</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            simulationResult.risk === 'high' ? 'bg-red-500 text-white' :
                            simulationResult.risk === 'medium' ? 'bg-amber-500 text-white' :
                            'bg-green-500 text-white'
                          }`}>
                            {simulationResult.risk.toUpperCase()} RISK
                          </span>
                        </div>
                        <div className="space-y-2">
                          {simulationResult.warnings.map((warning, index) => (
                            <div key={index} className="flex items-start">
                              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                              <p className="text-sm">{warning}</p>
                            </div>
                          ))}
                          {simulationResult.warnings.length === 0 && (
                            <div className="flex items-start">
                              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                              <p className="text-sm">No warnings detected for this transaction</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold">Security Recommendations</h4>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/10 mr-3">
                            <Fingerprint className="h-4 w-4 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-medium">Biometric Authentication</div>
                            <div className="text-sm text-muted-foreground">
                              {simulationResult.securityRecommendations.biometric ? 
                                "Recommended for this transaction" : 
                                "Not required for this transaction"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/10 mr-3">
                            <Key className="h-4 w-4 text-purple-500" />
                          </div>
                          <div>
                            <div className="font-medium">Email OTP Verification</div>
                            <div className="text-sm text-muted-foreground">
                              {simulationResult.securityRecommendations.otp ? 
                                "Recommended for this transaction" : 
                                "Not required for this transaction"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-500/10 mr-3">
                            <Clock className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <div className="font-medium">Confirmation Delay</div>
                            <div className="text-sm text-muted-foreground">
                              {simulationResult.securityRecommendations.confirmationDelay > 0 ? 
                                `${simulationResult.securityRecommendations.confirmationDelay} second delay recommended` : 
                                "No delay required"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      {simulationLoading ? (
                        <div className="space-y-4">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mx-auto"></div>
                          <p>Analyzing transaction...</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Shield className="h-16 w-16 mx-auto text-muted-foreground/50" />
                          <p>Configure a transaction and run the simulation to see risk analysis</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {simulationResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Example</CardTitle>
                  <CardDescription>Code sample for implementing security check</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={transactionCodeExample} language="javascript" />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="api-key-test" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Key Tester</CardTitle>
                  <CardDescription>Test your API key functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">API Key</label>
                      <Input type="text" placeholder="gl_live_xxxxxxxxxxxxxxxxxxxx" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Note: This is a demo simulation only. No actual API requests are made.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Test Type</label>
                      <Select value={apiKeyTestType} onValueChange={setApiKeyTestType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select test type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verification">Key Verification</SelectItem>
                          <SelectItem value="rateLimit">Rate Limiting</SelectItem>
                          <SelectItem value="permissions">Permissions Check</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={runApiKeyTest} disabled={apiKeyTestLoading}>
                    {apiKeyTestLoading ? "Testing..." : "Test API Key"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                  <CardDescription>Results of your API key test</CardDescription>
                </CardHeader>
                <CardContent>
                  {apiKeyTestResult ? (
                    <div className="space-y-4">
                      <div className={`p-4 border rounded-md ${
                        apiKeyTestResult.valid ? 'bg-green-500/10 border-green-500/30' : 
                        'bg-red-500/10 border-red-500/30'
                      }`}>
                        <div className="flex items-center mb-2">
                          {apiKeyTestResult.valid ? (
                            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 mr-2 text-red-500" />
                          )}
                          <h4 className="font-semibold">
                            {apiKeyTestResult.valid ? "Valid API Key" : "Invalid API Key"}
                          </h4>
                        </div>
                      </div>
                      
                      {apiKeyTestType === "verification" && apiKeyTestResult.valid && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 text-sm">
                            <div className="font-medium">Key Type:</div>
                            <div>{apiKeyTestResult.keyType}</div>
                          </div>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="font-medium">Environment:</div>
                            <div>{apiKeyTestResult.environment}</div>
                          </div>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="font-medium">Projects:</div>
                            <div>{apiKeyTestResult.projects.join(", ")}</div>
                          </div>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="font-medium">Last Used:</div>
                            <div>{apiKeyTestResult.lastUsed}</div>
                          </div>
                          <div>
                            <div className="font-medium text-sm mb-1">Permissions:</div>
                            <div className="flex flex-wrap gap-1">
                              {apiKeyTestResult.permissions.map((perm, idx) => (
                                <Badge key={idx} variant="outline">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {apiKeyTestType === "rateLimit" && apiKeyTestResult.valid && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 text-sm">
                            <div className="font-medium">Current Usage:</div>
                            <div>{apiKeyTestResult.currentUsage} requests</div>
                          </div>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="font-medium">Limit:</div>
                            <div>{apiKeyTestResult.limit} requests</div>
                          </div>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="font-medium">Rate:</div>
                            <div>{apiKeyTestResult.ratePerMinute} req/min</div>
                          </div>
                          <div className="grid grid-cols-2 text-sm">
                            <div className="font-medium">Reset Time:</div>
                            <div>{new Date(apiKeyTestResult.resetTime).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="font-medium text-sm mb-1">Usage:</div>
                            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-full transition-all duration-500" 
                                style={{ 
                                  width: `${Math.min(100, (apiKeyTestResult.currentUsage / apiKeyTestResult.limit) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-right mt-1">
                              {apiKeyTestResult.currentUsage} / {apiKeyTestResult.limit} requests
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {apiKeyTestType === "permissions" && apiKeyTestResult.valid && (
                        <div className="space-y-3">
                          <div>
                            <div className="font-medium text-sm mb-1">Allowed Operations:</div>
                            <div className="flex flex-wrap gap-1">
                              {apiKeyTestResult.allowedOperations.map((op, idx) => (
                                <Badge key={idx} variant="outline" className="bg-green-500/10">
                                  {op}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-sm mb-1">Denied Operations:</div>
                            <div className="flex flex-wrap gap-1">
                              {apiKeyTestResult.deniedOperations.map((op, idx) => (
                                <Badge key={idx} variant="outline" className="bg-red-500/10">
                                  {op}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      {apiKeyTestLoading ? (
                        <div className="space-y-4">
                          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mx-auto"></div>
                          <p>Testing API key...</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Key className="h-16 w-16 mx-auto text-muted-foreground/50" />
                          <p>Enter your API key and run a test to see results</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

import { Clock, Badge } from "lucide-react";
export default PlaygroundSection;
