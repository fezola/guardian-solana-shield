import { useState } from "react";
import { User, Settings, Key, Shield, Code, FileCode, Database, Bell, BarChart3, Layers, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "./CodeBlock";

const UserProfileSection = ({ activeTab = "projects" }) => {
  // User state
  const [user, setUser] = useState({
    name: "Demo User",
    email: "demo@example.com",
    avatar: "",
    plan: "Developer",
    isVerified: true
  });

  // Projects state
  const [projects, setProjects] = useState([
    {
      id: "proj-1",
      name: "My Solana dApp",
      apiKey: "gl_live_xxxxxxxxxxxxxxxxxxxx",
      environment: "production",
      created: "2023-10-15",
      status: "active"
    },
    {
      id: "proj-2",
      name: "Test Project",
      apiKey: "gl_test_xxxxxxxxxxxxxxxxxxxx",
      environment: "development",
      created: "2023-11-02",
      status: "active"
    }
  ]);

  // New project form state
  const [newProject, setNewProject] = useState({
    name: "",
    environment: "development"
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    securityAlerts: true,
    twoFactorAuth: false,
    apiRateLimit: "standard"
  });

  // API usage stats (mock data)
  const usageStats = {
    totalRequests: 12458,
    securityChecks: 8932,
    biometricAuths: 2145,
    otpVerifications: 1381
  };

  // Handle new project creation
  const handleCreateProject = () => {
    if (!newProject.name) return;
    
    const newProj = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      apiKey: `gl_${newProject.environment === "production" ? "live" : "test"}_${Math.random().toString(36).substring(2, 15)}`,
      environment: newProject.environment,
      created: new Date().toISOString().split('T')[0],
      status: "active"
    };
    
    setProjects([...projects, newProj]);
    setNewProject({ name: "", environment: "development" });
  };

  // Generate new API key
  const handleRegenerateKey = (projectId) => {
    setProjects(projects.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          apiKey: `gl_${proj.environment === "production" ? "live" : "test"}_${Math.random().toString(36).substring(2, 15)}`
        };
      }
      return proj;
    }));
  };

  // Copy API key to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">{user.email}</span>
              {user.isVerified && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Verified
                </Badge>
              )}
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                {user.plan}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="projects">
            <Code className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="api-keys">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="usage">
            <BarChart3 className="h-4 w-4 mr-2" />
            Usage
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
            <h3 className="text-xl font-bold mb-4">Your Projects</h3>
            <p className="text-muted-foreground mb-6">
              Manage your GuardianLayer projects and their associated API keys.
            </p>

            <div className="space-y-4">
              {projects.map(project => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant={project.environment === "production" ? "default" : "outline"}>
                        {project.environment}
                      </Badge>
                    </div>
                    <CardDescription>Created on {project.created}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {project.apiKey}
                        </code>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(project.apiKey)}
                        >
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRegenerateKey(project.id)}
                        >
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 border rounded-md bg-muted/30">
              <h4 className="font-semibold mb-3">Create New Project</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input 
                    id="project-name" 
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder="My Awesome dApp"
                  />
                </div>
                <div>
                  <Label htmlFor="environment">Environment</Label>
                  <select 
                    id="environment"
                    className="w-full p-2 rounded-md border"
                    value={newProject.environment}
                    onChange={(e) => setNewProject({...newProject, environment: e.target.value})}
                  >
                    <option value="development">Development</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <Button onClick={handleCreateProject} disabled={!newProject.name}>
                  Create Project
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
            <h3 className="text-xl font-bold mb-4">Implementation Guide</h3>
            <p className="text-muted-foreground mb-4">
              Follow these steps to integrate GuardianLayer with your project:
            </p>
            
            <ol className="list-decimal ml-5 space-y-4 mb-6">
              <li>
                <h4 className="font-semibold">Install the SDK</h4>
                <CodeBlock
                  code={`npm install @guardianlayer/sdk @guardianlayer/react`}
                  language="bash"
                />
              </li>
              <li>
                <h4 className="font-semibold">Initialize with your API key</h4>
                <CodeBlock
                  code={`import { GuardianLayer } from '@guardianlayer/sdk';

// Initialize with your API key and wallet provider
const guardian = new GuardianLayer({
  apiKey: "YOUR_API_KEY", // Use your project API key here
  wallet: yourWalletProvider,
  modules: ['txSecurity', 'recovery', 'biometric']
});`}
                  language="javascript"
                />
              </li>
              <li>
                <h4 className="font-semibold">Implement security features</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Use the SDK to secure your transactions and authenticate users.
                </p>
              </li>
            </ol>
          </div>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
            <h3 className="text-xl font-bold mb-4">API Keys</h3>
            <p className="text-muted-foreground mb-6">
              Manage your API keys for different environments and projects.
            </p>

            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{project.name}</h4>
                    <Badge variant={project.environment === "production" ? "default" : "outline"}>
                      {project.environment}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {project.apiKey}
                    </code>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(project.apiKey)}
                      >
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRegenerateKey(project.id)}
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 border rounded-md bg-amber-500/10 border-amber-500/30">
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

          <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
            <h3 className="text-xl font-bold mb-4">API Usage Guidelines</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Rate Limits</h4>
                <p className="text-sm text-muted-foreground">
                  Developer plan: 1,000 requests/day<br />
                  Professional plan: 10,000 requests/day<br />
                  Enterprise plan: Custom limits
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Include your API key in the authorization header:
                </p>
                <CodeBlock
                  code={`Authorization: Bearer YOUR_API_KEY`}
                  language="plaintext"
                />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Error Handling</h4>
                <p className="text-sm text-muted-foreground">
                  Our API returns standard HTTP status codes and detailed error messages.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-6">
          <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
            <h3 className="text-xl font-bold mb-4">API Usage Statistics</h3>
            <p className="text-muted-foreground mb-6">
              Monitor your API usage across all projects.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-500/10 rounded-md border border-blue-500/20">
                <h4 className="text-sm font-medium text-muted-foreground">Total Requests</h4>
                <p className="text-2xl font-bold">{usageStats.totalRequests.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-md border border-green-500/20">
                <h4 className="text-sm font-medium text-muted-foreground">Security Checks</h4>
                <p className="text-2xl font-bold">{usageStats.securityChecks.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-md border border-purple-500/20">
                <h4 className="text-sm font-medium text-muted-foreground">Biometric Auths</h4>
                <p className="text-2xl font-bold">{usageStats.biometricAuths.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-md border border-amber-500/20">
                <h4 className="text-sm font-medium text-muted-foreground">OTP Verifications</h4>
                <p className="text-2xl font-bold">{usageStats.otpVerifications.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-4 border rounded-md">
              <h4 className="font-semibold mb-2">Current Plan: {user.plan}</h4>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-primary h-full" style={{ width: "45%" }}></div>
              </div>
              <p className="text-sm text-muted-foreground">
                4,500 / 10,000 requests used this month (45%)
              </p>
              <Button className="mt-4" variant="outline">Upgrade Plan</Button>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
            <h3 className="text-xl font-bold mb-4">Account Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} />
              </div>
              <Button>Update Profile</Button>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
            <h3 className="text-xl font-bold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive updates about your account and projects</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications} 
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Security Alerts</h4>
                  <p className="text-sm text-muted-foreground">Get notified about suspicious activities</p>
                </div>
                <Switch 
                  checked={settings.securityAlerts} 
                  onCheckedChange={(checked) => setSettings({...settings, securityAlerts: checked})} 
                />
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
            <h3 className="text-xl font-bold mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch 
                  checked={settings.twoFactorAuth} 
                  onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})} 
                />
              </div>
              <div>
                <h4 className="font-semibold mb-2">API Rate Limiting</h4>
                <select 
                  className="w-full p-2 rounded-md border"
                  value={settings.apiRateLimit}
                  onChange={(e) => setSettings({...settings, apiRateLimit: e.target.value})}
                >
                  <option value="standard">Standard (Default)</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="strict">Strict</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Controls how aggressively rate limiting is applied to your API requests
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfileSection;