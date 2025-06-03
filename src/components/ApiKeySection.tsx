
import { useState } from "react";
import { Key, Copy, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useApiKeys } from "@/hooks/useApiKeys";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

const ApiKeySection = () => {
  const { apiKeys, isLoading, isGenerating, generateApiKey, deleteApiKey } = useApiKeys();
  const { toast } = useToast();
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<'test' | 'production'>('test');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a key name",
        variant: "destructive",
      });
      return;
    }

    const result = await generateApiKey(newKeyName, newKeyEnvironment);
    if (result) {
      setIsCreateDialogOpen(false);
      setNewKeyName("");
      setNewKeyEnvironment('test');
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    const prefix = key.substring(0, 12); // Show prefix (gl_test_ or gl_live_)
    const suffix = key.substring(key.length - 4);
    return `${prefix}${'*'.repeat(20)}${suffix}`;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading API keys...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">API Keys</h2>
          <p className="text-muted-foreground">Manage your API keys for different environments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for your project. Choose the appropriate environment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., My Production Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="environment">Environment</Label>
                <Select value={newKeyEnvironment} onValueChange={(value: 'test' | 'production') => setNewKeyEnvironment(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {newKeyEnvironment === 'test' 
                    ? 'Test keys start with gl_test_ and are for development'
                    : 'Production keys start with gl_live_ and are for live applications'
                  }
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateKey}
                disabled={isGenerating || !newKeyName.trim()}
              >
                {isGenerating ? "Generating..." : "Generate Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {apiKeys && apiKeys.length > 0 ? (
          apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{apiKey.key_name}</CardTitle>
                      <CardDescription>
                        Created {format(new Date(apiKey.created_at), 'MMM dd, yyyy')}
                        {apiKey.last_used_at && (
                          <span> • Last used {format(new Date(apiKey.last_used_at), 'MMM dd, yyyy')}</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={apiKey.environment === 'production' ? 'destructive' : 'secondary'}>
                      {apiKey.environment === 'production' ? 'Production' : 'Test'}
                    </Badge>
                    <Badge variant={apiKey.is_active ? 'default' : 'secondary'}>
                      {apiKey.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>API Key</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        readOnly
                        value={visibleKeys.has(apiKey.id) ? apiKey.key_value : maskApiKey(apiKey.key_value)}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key_value)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteApiKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {apiKey.expires_at && (
                    <div>
                      <Label>Expires</Label>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(apiKey.expires_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
              <p className="text-muted-foreground mb-4">
                Create your first API key to start using GuardianLayer's security features.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First API Key
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Key Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">Test Keys (gl_test_)</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Use for development and testing. Limited functionality and rate limits.
            </p>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <h4 className="font-semibold text-red-900 dark:text-red-100">Production Keys (gl_live_)</h4>
            <p className="text-sm text-red-800 dark:text-red-200">
              Use for live applications. Full functionality with higher rate limits.
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100">Security</h4>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Never expose your API keys in client-side code. Always use them server-side.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySection;
