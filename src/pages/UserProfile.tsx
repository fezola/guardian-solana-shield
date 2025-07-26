
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserProfileSection from "@/components/UserProfileSection";
import ProjectsSection from "@/components/ProjectsSection";
import {
  User, Shield, Key, Settings, Activity, FolderOpen
} from "lucide-react";
import DashboardSection from "@/components/DashboardSection";
import ApiKeySection from "@/components/ApiKeySection";
import { cn } from "@/lib/utils";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Overview", icon: Activity },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "api-keys", label: "API Keys", icon: Key },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="bg-card p-4 rounded-xl shadow-md border border-border/50 sticky top-24">
                <h2 className="font-bold text-lg mb-4">Dashboard</h2>
                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          activeTab === item.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {activeTab === "dashboard" && <DashboardSection />}
              {activeTab === "projects" && <ProjectsSection />}
              {activeTab === "api-keys" && <ApiKeySection />}
              {activeTab === "profile" && <UserProfileSection activeTab="profile" />}
              {activeTab === "security" && <UserProfileSection activeTab="security" />}
              {activeTab === "settings" && <UserProfileSection activeTab="settings" />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
