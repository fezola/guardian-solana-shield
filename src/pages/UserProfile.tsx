
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserProfileSection from "@/components/UserProfileSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Shield, Key, Settings, Activity
} from "lucide-react";
import DashboardSection from "@/components/DashboardSection";
import ApiKeySection from "@/components/ApiKeySection";

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
                <h2 className="font-bold text-lg mb-4">Dashboard</h2>
                <nav>
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                    <TabsList className="flex flex-col w-full h-auto space-y-1">
                      <TabsTrigger 
                        value="dashboard" 
                        className="justify-start w-full"
                      >
                        <Activity className="h-4 w-4 mr-2" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="profile" 
                        className="justify-start w-full"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger 
                        value="security" 
                        className="justify-start w-full"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Security
                      </TabsTrigger>
                      <TabsTrigger 
                        value="api-keys" 
                        className="justify-start w-full"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        API Keys
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
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="dashboard" className="mt-0">
                  <DashboardSection />
                </TabsContent>
                
                <TabsContent value="profile" className="mt-0">
                  <UserProfileSection activeTab="profile" />
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <UserProfileSection activeTab="security" />
                </TabsContent>
                
                <TabsContent value="api-keys" className="mt-0">
                  <ApiKeySection />
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
