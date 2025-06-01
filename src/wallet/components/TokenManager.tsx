
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  Plus, 
  Search, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useToast } from '@/hooks/use-toast';

interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  verified: boolean;
}

export const TokenManager: React.FC = () => {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [tokenMint, setTokenMint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [knownTokens, setKnownTokens] = useState<TokenInfo[]>([
    {
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      verified: true
    },
    {
      mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      verified: true
    },
    {
      mint: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
      symbol: 'mSOL',
      name: 'Marinade SOL',
      decimals: 9,
      verified: true
    }
  ]);

  const addCustomToken = async () => {
    if (!tokenMint.trim()) {
      toast({
        title: "Error",
        description: "Please enter a token mint address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, you would fetch token metadata
      const newToken: TokenInfo = {
        mint: tokenMint,
        symbol: 'CUSTOM',
        name: 'Custom Token',
        decimals: 9,
        verified: false
      };

      setKnownTokens(prev => [...prev, newToken]);
      setTokenMint('');
      
      toast({
        title: "Token Added",
        description: "Custom token has been added to your wallet",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add token. Please check the mint address.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTokens = knownTokens.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="w-5 h-5" />
            <span>Token Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Tokens</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or symbol"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTokens.map((token) => (
              <div key={token.mint} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">{token.symbol[0]}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{token.name}</p>
                      {token.verified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{token.symbol}</p>
                  </div>
                </div>
                <Badge variant={token.verified ? 'default' : 'secondary'}>
                  {token.verified ? 'Verified' : 'Custom'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Custom Token</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tokenMint">Token Mint Address</Label>
            <Input
              id="tokenMint"
              value={tokenMint}
              onChange={(e) => setTokenMint(e.target.value)}
              placeholder="Enter SPL token mint address"
            />
          </div>
          
          <Button 
            onClick={addCustomToken}
            disabled={isLoading || !tokenMint.trim()}
            className="w-full"
          >
            {isLoading ? 'Adding...' : 'Add Token'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
