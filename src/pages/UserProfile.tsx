
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserProfileSection from "@/components/UserProfileSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Shield, 
  Key, 
  Settings, 
  Activity, 
  FileText, 
  Code, 
  Database, 
  ChartBar 
} from "lucide-react";
import DashboardSection from "@/components/DashboardSection";
import LogsSection from "@/components/LogsSection";
import ApiKeySection from "@/components/ApiKeySection";
import AuditLogsSection from "@/components/AuditLogsSection";
import SdkIntegrationSection from "@/components/SdkIntegrationSection";
import PlaygroundSection from "@/components/PlaygroundSection";
import ServerSideApiSection from "@/components/ServerSideApiSection";

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
                        <ChartBar className="h-4 w-4 mr-2" />
                        Dashboard
                      </TabsTrigger>
                      <TabsTrigger 
                        value="profile" 
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
                        value="logs" 
                        className="justify-start w-full"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Logs & Activity
                      </TabsTrigger>
                      <TabsTrigger 
                        value="audit" 
                        className="justify-start w-full"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Audit Logs
                      </TabsTrigger>
                      <TabsTrigger 
                        value="sdk" 
                        className="justify-start w-full"
                      >
                        <Code className="h-4 w-4 mr-2" />
                        SDK Integration
                      </TabsTrigger>
                      <TabsTrigger 
                        value="playground" 
                        className="justify-start w-full"
                      >
                        <Code className="h-4 w-4 mr-2" />
                        Playground
                      </TabsTrigger>
                      <TabsTrigger 
                        value="server-api" 
                        className="justify-start w-full"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Server API
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
              {/* Wrap all TabsContent components in a Tabs component */}
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="dashboard" className="mt-0">
                  <DashboardSection />
                </TabsContent>
                
                <TabsContent value="profile" className="mt-0">
                  <UserProfileSection activeTab="profile" />
                </TabsContent>
                
                <TabsContent value="projects" className="mt-0">
                  <UserProfileSection activeTab="projects" />
                </TabsContent>
                
                <TabsContent value="api-keys" className="mt-0">
                  <ApiKeySection />
                </TabsContent>
                
                <TabsContent value="logs" className="mt-0">
                  <LogsSection />
                </TabsContent>
                
                <TabsContent value="audit" className="mt-0">
                  <AuditLogsSection />
                </TabsContent>
                
                <TabsContent value="sdk" className="mt-0">
                  <SdkIntegrationSection />
                </TabsContent>
                
                <TabsContent value="playground" className="mt-0">
                  <PlaygroundSection />
                </TabsContent>
                
                <TabsContent value="server-api" className="mt-0">
                  <ServerSideApiSection />
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <UserProfileSection activeTab="settings" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
