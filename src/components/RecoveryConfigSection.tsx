import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Mail, 
  Users, 
  Key, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  X
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { RecoveryService, RecoveryOptions, UserSecuritySettings } from "@/lib/api/recovery-service";
import { useApiKeys } from "@/hooks/useApiKeys";

const RecoveryConfigSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { apiKeys } = useApiKeys();
  
  const [selectedApiKey, setSelectedApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryOptions, setRecoveryOptions] = useState<RecoveryOptions | null>(null);
  const [securitySettings, setSecuritySettings] = useState<UserSecuritySettings | null>(null);
  const [guardianEmails, setGuardianEmails] = useState<string[]>([]);
  const [newGuardianEmail, setNewGuardianEmail] = useState("");

  const recoveryService = new RecoveryService();

  useEffect(() => {
    if (apiKeys && apiKeys.length > 0 && !selectedApiKey) {
      setSelectedApiKey(apiKeys[0].key_value);
    }
  }, [apiKeys]);

  useEffect(() => {
    if (selectedApiKey && user) {
      loadRecoveryConfig();
    }
  }, [selectedApiKey, user]);

  const loadRecoveryConfig = async () => {
    if (!selectedApiKey || !user) return;

    setLoading(true);
    try {
      const [recovery, security] = await Promise.all([
        recoveryService.getRecoveryOptions(user.id, selectedApiKey),
        recoveryService.getUserSecuritySettings(user.id, selectedApiKey)
      ]);

      setRecoveryOptions(recovery);
      setSecuritySettings(security);
      setGuardianEmails(recovery?.guardianEmails || []);
    } catch (error: any) {
      toast({
        title: "Failed to load configuration",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRecoveryOptions = async () => {
    if (!selectedApiKey || !user) return;

    setLoading(true);
    try {
      const options: RecoveryOptions = {
        userId: user.id,
        recoveryEmail: recoveryOptions?.recoveryEmail || "",
        backupEmail: recoveryOptions?.backupEmail || "",
        recoveryPhrase: recoveryOptions?.recoveryPhrase || false,
        socialRecovery: recoveryOptions?.socialRecovery || false,
        guardianEmails,
        requiredGuardians: recoveryOptions?.requiredGuardians || 2,
        timeDelay: recoveryOptions?.timeDelay || 24,
        isActive: recoveryOptions?.isActive || false
      };

      const result = await recoveryService.updateRecoveryOptions(options, selectedApiKey);
      setRecoveryOptions(result);

      toast({
        title: "Recovery options saved",
        description: "Your recovery configuration has been updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Failed to save recovery options",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSecuritySettings = async () => {
    if (!selectedApiKey || !user || !securitySettings) return;

    setLoading(true);
    try {
      const result = await recoveryService.updateUserSecuritySettings(securitySettings, selectedApiKey);
      setSecuritySettings(result);

      toast({
        title: "Security settings saved",
        description: "Your security preferences have been updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Failed to save security settings",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addGuardianEmail = () => {
    if (!newGuardianEmail.trim()) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newGuardianEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (guardianEmails.includes(newGuardianEmail)) {
      toast({
        title: "Email already added",
        description: "This email is already in your guardian list",
        variant: "destructive"
      });
      return;
    }

    setGuardianEmails([...guardianEmails, newGuardianEmail]);
    setNewGuardianEmail("");
  };

  const removeGuardianEmail = (email: string) => {
    setGuardianEmails(guardianEmails.filter(e => e !== email));
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Please log in to configure recovery options</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">Recovery Configuration</h3>
        <p className="text-muted-foreground mb-6">
          Set up multiple recovery methods to ensure you can always regain access to your wallet.
        </p>

        {/* API Key Selection */}
        <div className="mb-6">
          <Label htmlFor="api-key">API Key</Label>
          <select
            id="api-key"
            value={selectedApiKey}
            onChange={(e) => setSelectedApiKey(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="">Select API Key</option>
            {apiKeys?.map((key) => (
              <option key={key.id} value={key.key_value}>
                {key.key_name} ({key.environment})
              </option>
            ))}
          </select>
        </div>

        <Tabs defaultValue="recovery" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recovery">Recovery Methods</TabsTrigger>
            <TabsTrigger value="security">Security Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="recovery" className="space-y-6">
            {/* Email Recovery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Recovery
                </CardTitle>
                <CardDescription>
                  Use email verification to recover your wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recovery-email">Primary Recovery Email</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    value={recoveryOptions?.recoveryEmail || ""}
                    onChange={(e) => setRecoveryOptions(prev => prev ? {...prev, recoveryEmail: e.target.value} : null)}
                    placeholder="your-email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="backup-email">Backup Email (Optional)</Label>
                  <Input
                    id="backup-email"
                    type="email"
                    value={recoveryOptions?.backupEmail || ""}
                    onChange={(e) => setRecoveryOptions(prev => prev ? {...prev, backupEmail: e.target.value} : null)}
                    placeholder="backup@example.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Recovery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Social Recovery
                </CardTitle>
                <CardDescription>
                  Allow trusted guardians to help recover your wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="social-recovery"
                    checked={recoveryOptions?.socialRecovery || false}
                    onCheckedChange={(checked) => setRecoveryOptions(prev => prev ? {...prev, socialRecovery: checked} : null)}
                  />
                  <Label htmlFor="social-recovery">Enable Social Recovery</Label>
                </div>

                {recoveryOptions?.socialRecovery && (
                  <>
                    <div className="space-y-2">
                      <Label>Guardian Emails</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newGuardianEmail}
                          onChange={(e) => setNewGuardianEmail(e.target.value)}
                          placeholder="guardian@example.com"
                          onKeyPress={(e) => e.key === 'Enter' && addGuardianEmail()}
                        />
                        <Button onClick={addGuardianEmail} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {guardianEmails.map((email, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{email}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGuardianEmail(email)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <Label htmlFor="required-guardians">Required Guardians</Label>
                      <Input
                        id="required-guardians"
                        type="number"
                        min="1"
                        max={guardianEmails.length}
                        value={recoveryOptions?.requiredGuardians || 2}
                        onChange={(e) => setRecoveryOptions(prev => prev ? {...prev, requiredGuardians: parseInt(e.target.value)} : null)}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recovery Phrase */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Recovery Phrase
                </CardTitle>
                <CardDescription>
                  Use a seed phrase for wallet recovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recovery-phrase"
                    checked={recoveryOptions?.recoveryPhrase || false}
                    onCheckedChange={(checked) => setRecoveryOptions(prev => prev ? {...prev, recoveryPhrase: checked} : null)}
                  />
                  <Label htmlFor="recovery-phrase">Enable Recovery Phrase</Label>
                </div>
              </CardContent>
            </Card>

            {/* Time Delay */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recovery Time Delay
                </CardTitle>
                <CardDescription>
                  Security delay before recovery takes effect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="time-delay">Delay (hours)</Label>
                  <Input
                    id="time-delay"
                    type="number"
                    min="1"
                    max="168"
                    value={recoveryOptions?.timeDelay || 24}
                    onChange={(e) => setRecoveryOptions(prev => prev ? {...prev, timeDelay: parseInt(e.target.value)} : null)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 24-72 hours for security
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="recovery-active"
                  checked={recoveryOptions?.isActive || false}
                  onCheckedChange={(checked) => setRecoveryOptions(prev => prev ? {...prev, isActive: checked} : null)}
                />
                <Label htmlFor="recovery-active">Activate Recovery System</Label>
              </div>
              <Button onClick={saveRecoveryOptions} disabled={loading}>
                {loading ? "Saving..." : "Save Recovery Options"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Security Settings Content */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication Methods</CardTitle>
                <CardDescription>Configure your preferred authentication methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Biometric Authentication</Label>
                    <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                  </div>
                  <Switch
                    checked={securitySettings?.biometricEnabled || false}
                    onCheckedChange={(checked) => setSecuritySettings(prev => prev ? {...prev, biometricEnabled: checked} : null)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>OTP Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require email OTP for high-risk transactions</p>
                  </div>
                  <Switch
                    checked={securitySettings?.otpEnabled || false}
                    onCheckedChange={(checked) => setSecuritySettings(prev => prev ? {...prev, otpEnabled: checked} : null)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={saveSecuritySettings} disabled={loading}>
              {loading ? "Saving..." : "Save Security Settings"}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecoveryConfigSection;
