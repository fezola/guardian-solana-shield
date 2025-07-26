/**
 * Token Service
 * SPL Token support and token information
 */

import { Connection, PublicKey, AccountInfo } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, AccountLayout, MintLayout } from '@solana/spl-token';
import { TokenInfo, WalletToken } from './types';

export class TokenService {
  private connection: Connection;
  private tokenRegistry: Map<string, TokenInfo> = new Map();
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 500; // 500ms between requests for official RPC

  constructor(connection: Connection) {
    this.connection = connection;
    this.initializeTokenRegistry();
  }

  // Rate limiting wrapper for RPC calls
  private async rateLimitedRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();

    try {
      return await requestFn();
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
        console.log('Rate limited, waiting 3 seconds before retry...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        return await requestFn();
      }
      throw error;
    }
  }

  private initializeTokenRegistry() {
    // Initialize with known tokens (this would be loaded from a token list in production)
    const knownTokens: TokenInfo[] = [
      {
        mint: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        decimals: 9,
        verified: true,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
      },
      {
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        verified: true,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
      },
      {
        mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        verified: true,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
      },
      {
        mint: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
        symbol: 'mSOL',
        name: 'Marinade staked SOL',
        decimals: 9,
        verified: true,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png'
      }
    ];

    knownTokens.forEach(token => {
      this.tokenRegistry.set(token.mint, token);
    });
  }

  /**
   * Get all token accounts for a wallet
   */
  async getTokenAccounts(walletAddress: PublicKey): Promise<WalletToken[]> {
    try {
      const tokens: WalletToken[] = [];

      // Get SOL balance with rate limiting
      const solBalance = await this.rateLimitedRequest(() =>
        this.connection.getBalance(walletAddress)
      );
      tokens.push({
        mint: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        balance: solBalance / 1e9,
        decimals: 9,
        logoURI: this.tokenRegistry.get('So11111111111111111111111111111111111111112')?.logoURI
      });

      // Get SPL token accounts with rate limiting
      const tokenAccounts = await this.rateLimitedRequest(() =>
        this.connection.getParsedTokenAccountsByOwner(
          walletAddress,
          { programId: TOKEN_PROGRAM_ID }
        )
      );

      for (const tokenAccount of tokenAccounts.value) {
        const accountData = tokenAccount.account.data.parsed;
        const mintAddress = accountData.info.mint;
        const balance = accountData.info.tokenAmount.uiAmount || 0;
        const decimals = accountData.info.tokenAmount.decimals;

        if (balance > 0) {
          const tokenInfo = await this.getTokenInfo(mintAddress);
          
          tokens.push({
            mint: mintAddress,
            symbol: tokenInfo?.symbol || 'UNKNOWN',
            name: tokenInfo?.name || 'Unknown Token',
            balance,
            decimals,
            logoURI: tokenInfo?.logoURI,
            usdValue: await this.getTokenUSDValue(mintAddress, balance)
          });
        }
      }

      return tokens;
    } catch (error) {
      console.error('Error fetching token accounts:', error);
      return [];
    }
  }

  /**
   * Get token information by mint address
   */
  async getTokenInfo(mintAddress: string): Promise<TokenInfo | null> {
    try {
      // Check local registry first
      const localInfo = this.tokenRegistry.get(mintAddress);
      if (localInfo) {
        return localInfo;
      }

      // Fetch mint account info
      const mintInfo = await this.connection.getAccountInfo(new PublicKey(mintAddress));
      if (!mintInfo) {
        return null;
      }

      // Parse mint data
      const mintData = MintLayout.decode(mintInfo.data);
      
      // Try to fetch from token list APIs
      const tokenInfo = await this.fetchTokenInfoFromAPI(mintAddress);
      
      if (tokenInfo) {
        // Cache the token info
        this.tokenRegistry.set(mintAddress, tokenInfo);
        return tokenInfo;
      }

      // Return basic info if not found in registries
      return {
        mint: mintAddress,
        symbol: 'UNKNOWN',
        name: 'Unknown Token',
        decimals: mintData.decimals,
        verified: false
      };

    } catch (error) {
      console.error('Error getting token info:', error);
      return null;
    }
  }

  /**
   * Get USD value for a token amount
   */
  async getTokenUSDValue(mintAddress: string, amount: number): Promise<number | undefined> {
    try {
      // This would integrate with price APIs like CoinGecko, Jupiter, etc.
      // For now, return mock values for known tokens
      const priceMap: Record<string, number> = {
        'So11111111111111111111111111111111111111112': 100, // SOL
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 1, // USDC
        'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 1, // USDT
        'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 95, // mSOL
      };

      const price = priceMap[mintAddress];
      return price ? amount * price : undefined;
    } catch (error) {
      console.error('Error getting token USD value:', error);
      return undefined;
    }
  }

  /**
   * Validate token mint address
   */
  async validateTokenMint(mintAddress: string): Promise<boolean> {
    try {
      const mintInfo = await this.connection.getAccountInfo(new PublicKey(mintAddress));
      
      if (!mintInfo) {
        return false;
      }

      // Check if it's owned by the token program
      if (!mintInfo.owner.equals(TOKEN_PROGRAM_ID)) {
        return false;
      }

      // Try to decode mint data
      try {
        MintLayout.decode(mintInfo.data);
        return true;
      } catch {
        return false;
      }
    } catch (error) {
      console.error('Error validating token mint:', error);
      return false;
    }
  }

  /**
   * Check if token is verified/trusted
   */
  isTokenVerified(mintAddress: string): boolean {
    const tokenInfo = this.tokenRegistry.get(mintAddress);
    return tokenInfo?.verified || false;
  }

  /**
   * Get token security information
   */
  async getTokenSecurity(mintAddress: string): Promise<TokenSecurityInfo> {
    try {
      const mintInfo = await this.connection.getAccountInfo(new PublicKey(mintAddress));
      
      if (!mintInfo) {
        return {
          isValid: false,
          risks: ['Token mint not found'],
          riskLevel: 'high'
        };
      }

      const risks: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' = 'low';

      // Parse mint data
      const mintData = MintLayout.decode(mintInfo.data);

      // Check for freeze authority
      if (mintData.freezeAuthority) {
        risks.push('Token has freeze authority');
        riskLevel = 'medium';
      }

      // Check for mint authority
      if (mintData.mintAuthority) {
        risks.push('Token has mint authority (can create new tokens)');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      // Check if token is verified
      if (!this.isTokenVerified(mintAddress)) {
        risks.push('Token is not verified');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      // Check supply
      const supply = Number(mintData.supply);
      if (supply === 0) {
        risks.push('Token has zero supply');
        riskLevel = 'high';
      }

      return {
        isValid: true,
        risks,
        riskLevel,
        mintAuthority: mintData.mintAuthority ? mintData.mintAuthority.toString() : null,
        freezeAuthority: mintData.freezeAuthority ? mintData.freezeAuthority.toString() : null,
        supply: supply.toString(),
        decimals: mintData.decimals
      };

    } catch (error) {
      console.error('Error getting token security info:', error);
      return {
        isValid: false,
        risks: ['Error analyzing token security'],
        riskLevel: 'high'
      };
    }
  }

  /**
   * Search tokens by symbol or name
   */
  searchTokens(query: string): TokenInfo[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.tokenRegistry.values()).filter(token =>
      token.symbol.toLowerCase().includes(lowerQuery) ||
      token.name.toLowerCase().includes(lowerQuery)
    );
  }

  // Private methods
  private async fetchTokenInfoFromAPI(mintAddress: string): Promise<TokenInfo | null> {
    try {
      // Try Solana token list first
      const response = await fetch('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json');
      const tokenList = await response.json();
      
      const token = tokenList.tokens.find((t: any) => t.address === mintAddress);
      
      if (token) {
        return {
          mint: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          verified: true,
          logoURI: token.logoURI,
          tags: token.tags
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching token info from API:', error);
      return null;
    }
  }
}

interface TokenSecurityInfo {
  isValid: boolean;
  risks: string[];
  riskLevel: 'low' | 'medium' | 'high';
  mintAuthority?: string | null;
  freezeAuthority?: string | null;
  supply?: string;
  decimals?: number;
}
