import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserProfileSection from "@/components/UserProfileSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Key, Settings, Activity, FileText, Code, Database } from "lucide-react";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-card p-4 rounded-xl shadow-md border border-border/50 sticky top-24">
                <h2 className="font-bold text-lg mb-4">Developer Dashboard</h2>
                <nav className="space-y-1">
                  {/* Wrap TabsList in a Tabs component */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="flex flex-col w-full h-auto space-y-1">
                      <TabsTrigger 
                        value="dashboard" 
                        className="justify-start w-full"
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </TabsTrigger>
                      <TabsTrigger 
                        value="projects" 
                        className="justify-start w-full"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Projects
                      </TabsTrigger>
                      <TabsTrigger 
                        value="api-keys" 
                        className="justify-start w-full"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        API Keys
                      </TabsTrigger>
                      <TabsTrigger 
                        value="usage" 
                        className="justify-start w-full"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Usage & Logs
                      </TabsTrigger>
                      <TabsTrigger 
                        value="docs" 
                        className="justify-start w-full"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Documentation
                      </TabsTrigger>
                      <TabsTrigger 
                        value="sdks" 
                        className="justify-start w-full"
                      >
                        <Code className="h-4 w-4 mr-2" />
                        SDKs & Tools
                      </TabsTrigger>
                      <TabsTrigger 
                        value="settings" 
                        className="justify-start w-full"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </nav>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center mb-2">
                      <Database className="h-4 w-4 mr-2" />
                      <span>Plan: Developer</span>
                    </div>
                    <div className="text-xs">
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden mb-1">
                        <div className="bg-primary h-full" style={{ width: "45%" }}></div>
                      </div>
                      <span>4,500 / 10,000 requests</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <UserProfileSection activeTab={activeTab} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;