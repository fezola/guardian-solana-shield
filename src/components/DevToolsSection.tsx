
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, FileText, Settings } from "lucide-react";

const DevToolsSection = () => {
  return (
    <section id="dev-tools" className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Developer & Power User Tools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for developers to simulate, test, and configure GuardianLayer's security features.
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dev Dashboard</TabsTrigger>
            <TabsTrigger value="logs">Security Logs</TabsTrigger>
            <TabsTrigger value="recovery">Recovery Configurator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="p-6 border rounded-lg bg-muted/30">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Developer Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  A comprehensive interface to simulate transactions, test security features, and adjust GuardianLayer settings.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Transaction Simulation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Simulate various transaction types and risk levels to test your application's response.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Security Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Fine-tune security parameters and risk thresholds for your specific application needs.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="p-6 border rounded-lg bg-muted/30">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Security Logs</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive logging of all security-related events, decisions, and actions within your application.
                </p>
                <div className="bg-secondary/50 p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                  <div className="mb-2 text-muted-foreground border-b pb-1 border-muted">
                    <span className="text-primary mr-2">2025-04-21 14:32:05</span>
                    <span className="bg-yellow-500/20 text-yellow-300 px-1 rounded">WARN</span>
                    <span className="ml-2">Transaction simulation detected high-risk pattern #A247</span>
                  </div>
                  <div className="mb-2 text-muted-foreground border-b pb-1 border-muted">
                    <span className="text-primary mr-2">2025-04-21 14:30:18</span>
                    <span className="bg-green-500/20 text-green-300 px-1 rounded">INFO</span>
                    <span className="ml-2">Biometric authentication successful for wallet wH7z...j6Ks</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="text-primary mr-2">2025-04-21 14:28:52</span>
                    <span className="bg-red-500/20 text-red-300 px-1 rounded">ALERT</span>
                    <span className="ml-2">Multiple failed recovery attempts from IP 193.68.x.x</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recovery" className="p-6 border rounded-lg bg-muted/30">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Advanced Recovery Configurator</h3>
                <p className="text-muted-foreground mb-4">
                  Fine-tune recovery options and set up sophisticated recovery mechanisms for maximum security and accessibility.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md bg-secondary/20">
                    <h4 className="font-medium mb-2">Time-lock Configuration</h4>
                    <p className="text-sm text-muted-foreground">Set up time-delayed backup key activation with customizable waiting periods.</p>
                  </div>
                  <div className="p-4 border rounded-md bg-secondary/20">
                    <h4 className="font-medium mb-2">Shamir Secret Sharing</h4>
                    <p className="text-sm text-muted-foreground">Configure threshold schemes (2-of-3, 3-of-5, etc.) for distributed key recovery.</p>
                  </div>
                  <div className="p-4 border rounded-md bg-secondary/20">
                    <h4 className="font-medium mb-2">Guardian Management</h4>
                    <p className="text-sm text-muted-foreground">Add, remove, and manage trusted guardians for recovery assistance.</p>
                  </div>
                  <div className="p-4 border rounded-md bg-secondary/20">
                    <h4 className="font-medium mb-2">Biometric Recovery</h4>
                    <p className="text-sm text-muted-foreground">Link recovery keys to biometric verification for enhanced security.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default DevToolsSection;
