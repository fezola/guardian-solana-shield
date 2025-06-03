
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Key, Shield, Palette } from "lucide-react";
import ApiUsageGuide from "@/components/ApiUsageGuide";
import SecurityUIKit from "@/components/SecurityUIKit";

const DeveloperTools = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Developer Tools & Resources
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to integrate Guardian Shield into your project. 
              From API keys to pre-built UI components, we've got you covered.
            </p>
          </div>

          <Tabs defaultValue="api-guide" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="api-guide" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>API Integration</span>
              </TabsTrigger>
              <TabsTrigger value="ui-kit" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>UI Components</span>
              </TabsTrigger>
              <TabsTrigger value="playground" className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Playground</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="api-guide">
              <ApiUsageGuide />
            </TabsContent>

            <TabsContent value="ui-kit">
              <SecurityUIKit />
            </TabsContent>

            <TabsContent value="playground">
              <div className="text-center py-16">
                <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Test our security features with real transactions and see how our 
                  protection layers work in a safe environment.
                </p>
                <div className="mt-8">
                  <span className="text-sm text-muted-foreground">Coming Soon</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeveloperTools;
