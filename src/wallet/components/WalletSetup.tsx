
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Plus, Download, Shield } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const WalletSetup: React.FC = () => {
  const { createWallet, importWallet, isLoading } = useWallet();
  const [privateKey, setPrivateKey] = useState('');

  const handleImport = async () => {
    if (!privateKey.trim()) return;
    await importWallet(privateKey);
    setPrivateKey('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Guardian Wallet</CardTitle>
          <p className="text-muted-foreground">
            Secure Solana wallet with advanced protection
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="import">Import Existing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-4">
              <div className="text-center space-y-4">
                <Plus className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">Create New Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate a new secure Solana wallet
                  </p>
                </div>
                <Button 
                  onClick={createWallet} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Creating...' : 'Create Wallet'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <Download className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-semibold">Import Existing Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Import using your private key
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="privateKey">Private Key (JSON Array)</Label>
                  <Input
                    id="privateKey"
                    type="password"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    placeholder="[123, 456, 789, ...]"
                  />
                </div>
                
                <Button 
                  onClick={handleImport} 
                  disabled={isLoading || !privateKey.trim()}
                  className="w-full"
                >
                  {isLoading ? 'Importing...' : 'Import Wallet'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
