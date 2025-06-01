
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Key, 
  Users, 
  Mail, 
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '@/hooks/use-toast';

interface RecoveryOptions {
  seedPhrase: boolean;
  socialRecovery: boolean;
  emailRecovery: boolean;
  guardianRecovery: boolean;
}

interface Guardian {
  id: string;
  email: string;
  name: string;
  verified: boolean;
}

export const RecoveryManager: React.FC = () => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  
  const [recoveryOptions, setRecoveryOptions] = useState<RecoveryOptions>({
    seedPhrase: true,
    socialRecovery: false,
    emailRecovery: false,
    guardianRecovery: false,
  });
  
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  const updateRecoveryOption = (key: keyof RecoveryOptions, value: boolean) => {
    setRecoveryOptions(prev => ({ ...prev, [key]: value }));
  };

  const addGuardian = () => {
    if (!newGuardianEmail || !newGuardianName) {
      toast({
        title: "Error",
        description: "Please enter both name and email for the guardian",
        variant: "destructive",
      });
      return;
    }

    const newGuardian: Guardian = {
      id: Date.now().toString(),
      email: newGuardianEmail,
      name: newGuardianName,
      verified: false,
    };

    setGuardians(prev => [...prev, newGuardian]);
    setNewGuardianEmail('');
    setNewGuardianName('');
    
    toast({
      title: "Guardian Added",
      description: "Recovery guardian has been added. They will receive a verification email.",
    });
  };

  const removeGuardian = (id: string) => {
    setGuardians(prev => prev.filter(g => g.id !== id));
  };

  const exportRecoveryKit = () => {
    const recoveryData = {
      publicKey: wallet?.publicKey.toString(),
      recoveryOptions,
      guardians: guardians.map(g => ({ name: g.name, email: g.email })),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(recoveryData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guardian-recovery-kit.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Recovery Kit Exported",
      description: "Your recovery kit has been downloaded securely",
    });
  };

  return (
    <div className="space-y-6">
      {/* Recovery Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Recovery Methods</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seed Phrase Recovery */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-blue-500" />
                <Label htmlFor="seedPhrase">Seed Phrase Recovery</Label>
                <Badge variant="secondary">Essential</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Use your 12-word seed phrase to recover your wallet
              </p>
            </div>
            <Switch
              id="seedPhrase"
              checked={recoveryOptions.seedPhrase}
              onCheckedChange={(checked) => updateRecoveryOption('seedPhrase', checked)}
            />
          </div>

          <Separator />

          {/* Social Recovery */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-500" />
                <Label htmlFor="socialRecovery">Social Recovery</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Use trusted friends/family as recovery guardians
              </p>
            </div>
            <Switch
              id="socialRecovery"
              checked={recoveryOptions.socialRecovery}
              onCheckedChange={(checked) => updateRecoveryOption('socialRecovery', checked)}
            />
          </div>

          <Separator />

          {/* Email Recovery */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-purple-500" />
                <Label htmlFor="emailRecovery">Email Recovery</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Recover using email verification and backup codes
              </p>
            </div>
            <Switch
              id="emailRecovery"
              checked={recoveryOptions.emailRecovery}
              onCheckedChange={(checked) => updateRecoveryOption('emailRecovery', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Guardian Management */}
      {recoveryOptions.socialRecovery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Recovery Guardians</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={newGuardianName}
                  onChange={(e) => setNewGuardianName(e.target.value)}
                  placeholder="Enter guardian's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianEmail">Guardian Email</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  value={newGuardianEmail}
                  onChange={(e) => setNewGuardianEmail(e.target.value)}
                  placeholder="Enter guardian's email"
                />
              </div>
            </div>
            
            <Button onClick={addGuardian} className="w-full">
              Add Guardian
            </Button>

            {guardians.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Current Guardians</h4>
                {guardians.map((guardian) => (
                  <div key={guardian.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{guardian.name}</p>
                      <p className="text-sm text-muted-foreground">{guardian.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={guardian.verified ? 'default' : 'secondary'}>
                        {guardian.verified ? 'Verified' : 'Pending'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeGuardian(guardian.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Seed Phrase Display */}
      {recoveryOptions.seedPhrase && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Seed Phrase Backup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Never share your seed phrase. Store it securely offline.
              </p>
            </div>
            
            <Button 
              variant="outline"
              onClick={() => setShowSeedPhrase(!showSeedPhrase)}
              className="w-full"
            >
              {showSeedPhrase ? 'Hide' : 'Show'} Seed Phrase
            </Button>

            {showSeedPhrase && (
              <div className="space-y-2">
                <Textarea
                  value="abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
                  readOnly
                  className="font-mono text-sm"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  This is a demo seed phrase. In production, this would show your actual seed phrase.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recovery Kit Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Recovery Kit</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Export your recovery configuration for safekeeping. This includes your recovery methods and guardian information (but not your private keys).
          </p>
          
          <Button onClick={exportRecoveryKit} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Recovery Kit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
