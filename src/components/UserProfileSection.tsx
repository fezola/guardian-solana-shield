import { useState } from "react";
import { 
  User, Shield, Key, Settings, Activity, FileText, Code, 
  Smartphone, Clock, LogOut, UserPlus, Lock, Mail, Building, 
  AlertTriangle, CheckCircle, X
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock user data
const user = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "",
  organization: "Solana Labs",
  role: "Developer",
  isVerified: true,
  plan: "Developer",
  createdAt: "2023-01-15T00:00:00Z",
  lastLogin: "2023-11-15T14:32:45Z",
  recoveryMethods: [
    { type: "email", value: "recovery@example.com", isVerified: true },
    { type: "phone", value: "+1 (555) 123-4567", isVerified: true }
  ],
  devices: [
    { id: "device-1", name: "MacBook Pro", lastActive: "2023-11-15T14:32:45Z", browser: "Chrome", os: "macOS", isCurrent: true },
    { id: "device-2", name: "iPhone 13", lastActive: "2023-11-14T09:15:22Z", browser: "Safari", os: "iOS", isCurrent: false }
  ],
  loginHistory: [
    { id: "login-1", timestamp: "2023-11-15T14:32:45Z", ip: "192.168.1.1", location: "San Francisco, CA", device: "MacBook Pro", status: "success" },
    { id: "login-2", timestamp: "2023-11-14T09:15:22Z", ip: "192.168.1.2", location: "San Francisco, CA", device: "iPhone 13", status: "success" },
    { id: "login-3", timestamp: "2023-11-10T18:45:12Z", ip: "203.0.113.1", location: "New York, NY", device: "Unknown", status: "failed" }
  ],
  teamMembers: [
    { id: "member-1", name: "Alex Johnson", email: "alex@example.com", role: "Admin", avatar: "" },
    { id: "member-2", name: "Sarah Williams", email: "sarah@example.com", role: "Developer", avatar: "" },
    { id: "member-3", name: "Michael Brown", email: "michael@example.com", role: "Viewer", avatar: "" }
  ]
};

const UserProfileSection = ({ activeTab = "dashboard" }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [organization, setOrganization] = useState(user.organization);
  const [role, setRole] = useState(user.role);
  const [isEditing, setIsEditing] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(true);
  const [ipRestrictionEnabled, setIpRestrictionEnabled] = useState(false);
  const [newTeamMemberEmail, setNewTeamMemberEmail] = useState("");
  const [newTeamMemberRole, setNewTeamMemberRole] = useState("Viewer");

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Handle profile update
  const handleProfileUpdate = () => {
    // In a real app, this would send data to an API
    setIsEditing(false);
    // Show success message
  };

  // Handle adding a new team member
  const handleAddTeamMember = () => {
    if (!newTeamMemberEmail) return;
    
    // In a real app, this would send an invitation via API
    setNewTeamMemberEmail("");
    // Show success message
  };

  // Handle removing a device
  const handleRemoveDevice = (deviceId) => {
    // In a real app, this would call an API to remove the device
    // Show success message
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
        {/* Dashboard Tab Content */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Manage your personal details and organization information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input 
                        id="organization" 
                        value={organization} 
                        onChange={(e) => setOrganization(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Developer">Developer</SelectItem>
                          <SelectItem value="Project Manager">Project Manager</SelectItem>
                          <SelectItem value="Designer">Designer</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleProfileUpdate}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Full Name</div>
                      <div>{name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Email Address</div>
                      <div>{email}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Organization</div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        {organization}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Role</div>
                      <div>{role}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Member Since</div>
                      <div>{formatTimestamp(user.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Last Login</div>
                      <div>{formatTimestamp(user.lastLogin)}</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Require a verification code when logging in
                    </div>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled} 
                    onCheckedChange={setTwoFactorEnabled} 
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Biometric Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Use fingerprint or face recognition for login
                    </div>
                  </div>
                  <Switch 
                    checked={biometricEnabled} 
                    onCheckedChange={setBiometricEnabled} 
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Auto Logout</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically log out after 30 minutes of inactivity
                    </div>
                  </div>
                  <Switch 
                    checked={autoLogoutEnabled} 
                    onCheckedChange={setAutoLogoutEnabled} 
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">IP Restriction</div>
                    <div className="text-sm text-muted-foreground">
                      Limit access to specific IP addresses
                    </div>
                  </div>
                  <Switch 
                    checked={ipRestrictionEnabled} 
                    onCheckedChange={setIpRestrictionEnabled} 
                  />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Recovery Methods</h3>
                <div className="space-y-3">
                  {user.recoveryMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        {method.type === "email" ? (
                          <Mail className="h-5 w-5 mr-3 text-blue-500" />
                        ) : (
                          <Smartphone className="h-5 w-5 mr-3 text-green-500" />
                        )}
                        <div>
                          <div className="font-medium capitalize">{method.type}</div>
                          <div className="text-sm text-muted-foreground">{method.value}</div>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={method.isVerified ? 
                          "bg-green-500/10 text-green-500 border-green-500/20" : 
                          "bg-amber-500/10 text-amber-500 border-amber-500/20"}
                      >
                        {method.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Add Recovery Method
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trusted Devices</CardTitle>
              <CardDescription>
                Manage devices that have access to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium flex items-center">
                        {device.name}
                        {device.isCurrent && (
                          <Badge className="ml-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {device.browser} on {device.os} • Last active {formatTimestamp(device.lastActive)}
                      </div>
                    </div>
                  </div>
                  {!device.isCurrent && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveDevice(device.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                Recent login activity on your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.loginHistory.map((login) => (
                <div key={login.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    {login.status === "success" ? (
                      <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 mr-3 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium capitalize">
                        {login.status === "success" ? "Successful login" : "Failed login attempt"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTimestamp(login.timestamp)} • {login.device} • {login.location}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        IP: {login.ip}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View Full History
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage team members and their access levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {user.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        member.role === "Admin" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                        member.role === "Developer" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        "bg-gray-500/10 text-gray-500 border-gray-500/20"
                      }
                    >
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Add Team Member</h3>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input 
                      placeholder="Email address" 
                      value={newTeamMemberEmail}
                      onChange={(e) => setNewTeamMemberEmail(e.target.value)}
                    />
                  </div>
                  <Select value={newTeamMemberRole} onValueChange={setNewTeamMemberRole}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddTeamMember}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab Content */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Manage your GuardianLayer projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Projects Section</h3>
                <p className="text-muted-foreground mb-4">
                  This is where you'll manage your wallet security projects
                </p>
                <Button>Create New Project</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab Content */}
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for GuardianLayer integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">API Keys Section</h3>
                <p className="text-muted-foreground mb-4">
                  This is where you'll manage your API keys for integration
                </p>
                <Button>Generate New API Key</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage & Logs Tab Content */}
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage & Logs</CardTitle>
              <CardDescription>
                Monitor your API usage and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Usage & Logs Section</h3>
                <p className="text-muted-foreground mb-4">
                  This is where you'll monitor your API usage and security events
                </p>
                <Button>View Detailed Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab Content */}
        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Access implementation guides and API documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Documentation Section</h3>
                <p className="text-muted-foreground mb-4">
                  This is where you'll find implementation guides and API documentation
                </p>
                <Button>Browse Documentation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SDKs & Tools Tab Content */}
        <TabsContent value="sdks">
          <Card>
            <CardHeader>
              <CardTitle>SDKs & Tools</CardTitle>
              <CardDescription>
                Access developer tools and SDKs for integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">SDKs & Tools Section</h3>
                <p className="text-muted-foreground mb-4">
                  This is where you'll find developer tools and SDKs for integration
                </p>
                <Button>Explore SDKs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab Content */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Settings Section</h3>
                <p className="text-muted-foreground mb-4">
                  This is where you'll manage your account preferences and settings
                </p>
                <Button>Update Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfileSection;