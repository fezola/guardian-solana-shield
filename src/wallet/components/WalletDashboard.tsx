import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Send, 
  Download, 
  History, 
  Shield, 
  Copy,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { SecureSend } from './SecureSend';

export const WalletDashboard: React.FC = () => {
  const { 
    publicKey, 
    balance, 
    tokens, 
    transactions, 
    refreshBalance, 
    refreshTokens, 
    refreshTransactions,
    isLoading 
  } = useWallet();
  const { toast } = useToast();

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const refreshAll = async () => {
    await Promise.all([
      refreshBalance(),
      refreshTokens(),
      refreshTransactions()
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Guardian Wallet</h1>
              <p className="text-muted-foreground">Secure Solana Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={refreshAll} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Wallet Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span>Wallet Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {publicKey ? formatAddress(publicKey.toString()) : 'No wallet'}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copyAddress}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Protected
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold">{balance.toFixed(4)} SOL</p>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold">{tokens.length}</p>
                  <p className="text-sm text-muted-foreground">Tokens</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold">{transactions.length}</p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="tokens" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="send">Send</TabsTrigger>
            <TabsTrigger value="receive">Receive</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="tokens">
            <Card>
              <CardHeader>
                <CardTitle>Token Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tokens.map((token) => (
                    <div key={token.mint} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold">{token.symbol[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">{token.name}</p>
                          <p className="text-sm text-muted-foreground">{token.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{token.balance.toFixed(4)}</p>
                        <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="send">
            <SecureSend />
          </TabsContent>

          <TabsContent value="receive">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Receive Tokens</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-48 h-48 mx-auto bg-muted/30 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">QR Code placeholder</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Your wallet address:</p>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-3 bg-muted/50 rounded text-sm">
                        {publicKey?.toString() || 'No wallet connected'}
                      </code>
                      <Button variant="outline" onClick={copyAddress}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Transaction History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No transactions yet</p>
                    </div>
                  ) : (
                    transactions.map((tx) => (
                      <div key={tx.signature} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === 'send' ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'
                          }`}>
                            {tx.type === 'send' ? <Send className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{tx.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{tx.amount} {tx.token}</p>
                          <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
