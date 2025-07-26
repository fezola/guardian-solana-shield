
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Connection, PublicKey, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { WalletToken, TransactionRecord, SecurityOptions, GuardianTransaction } from '../types';
import { useToast } from '@/hooks/use-toast';
import { GuardianLayer } from '@/lib/guardian-sdk';
import { TokenService } from '@/lib/guardian-sdk/token-service';

interface WalletContextType {
  connection: Connection;
  wallet: Keypair | null;
  publicKey: PublicKey | null;
  balance: number;
  tokens: WalletToken[];
  transactions: TransactionRecord[];
  isLoading: boolean;
  createWallet: () => Promise<void>;
  importWallet: (privateKey: string) => Promise<void>;
  sendTransaction: (transaction: GuardianTransaction, securityOptions: SecurityOptions) => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Keypair | null>(null);
  const [balance, setBalance] = useState(0);
  const [tokens, setTokens] = useState<WalletToken[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Use official Solana devnet RPC (most reliable for development)
  const RPC_URL = 'https://api.devnet.solana.com';

  const connection = new Connection(RPC_URL, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000,
    wsEndpoint: 'wss://api.devnet.solana.com/',
  });

  // Initialize GuardianLayer SDK
  const guardian = new GuardianLayer({
    rpcUrl: RPC_URL,
    environment: 'development',
    modules: ['txSecurity', 'recovery', 'biometric', 'otp']
  });

  // Initialize Token Service
  const tokenService = new TokenService(connection);

  const publicKey = wallet?.publicKey || null;

  const createWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      const newWallet = Keypair.generate();
      setWallet(newWallet);
      
      // Store in localStorage (in production, this should be more secure)
      localStorage.setItem('guardian_wallet_keypair', JSON.stringify(Array.from(newWallet.secretKey)));
      
      toast({
        title: "Wallet Created",
        description: "Your new Guardian wallet has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        title: "Error",
        description: "Failed to create wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const importWallet = useCallback(async (privateKey: string) => {
    try {
      setIsLoading(true);

      // Clean the input - remove whitespace and common prefixes
      let cleanedKey = privateKey.trim();

      // Remove common prefixes if present
      if (cleanedKey.startsWith('0x')) {
        cleanedKey = cleanedKey.slice(2);
      }

      let secretKey: Uint8Array;

      // Try different formats
      try {
        // Format 1: JSON array (e.g., [1,2,3,4...])
        if (cleanedKey.startsWith('[') && cleanedKey.endsWith(']')) {
          secretKey = new Uint8Array(JSON.parse(cleanedKey));
        }
        // Format 2: Comma-separated numbers (e.g., "1,2,3,4...")
        else if (cleanedKey.includes(',')) {
          const numbers = cleanedKey.split(',').map(num => parseInt(num.trim()));
          secretKey = new Uint8Array(numbers);
        }
        // Format 3: Base58 string (Solana standard)
        else if (cleanedKey.length >= 80 && cleanedKey.length <= 90 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(cleanedKey)) {
          // Use a simple base58 decode
          secretKey = base58Decode(cleanedKey);
        }
        // Format 4: Hex string
        else if (/^[0-9a-fA-F]+$/.test(cleanedKey) && cleanedKey.length === 128) {
          secretKey = hexToUint8Array(cleanedKey);
        }
        // Format 5: Space-separated numbers
        else if (cleanedKey.includes(' ')) {
          const numbers = cleanedKey.split(' ').map(num => parseInt(num.trim()));
          secretKey = new Uint8Array(numbers);
        }
        else {
          throw new Error('Unrecognized private key format');
        }
      } catch (parseError) {
        throw new Error('Invalid private key format. Please check your input.');
      }

      // Validate the secret key length
      if (secretKey.length !== 64) {
        throw new Error(`Invalid private key length: ${secretKey.length}. Expected 64 bytes.`);
      }

      // Create the wallet from the secret key
      const importedWallet = Keypair.fromSecretKey(secretKey);
      setWallet(importedWallet);

      // Store in localStorage (store as JSON array for consistency)
      localStorage.setItem('guardian_wallet_keypair', JSON.stringify(Array.from(secretKey)));

      toast({
        title: "Wallet Imported",
        description: `Wallet imported successfully! Address: ${importedWallet.publicKey.toString().slice(0, 8)}...`,
      });
    } catch (error: any) {
      console.error('Error importing wallet:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import wallet. Please check your private key format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Helper function to decode base58
  const base58Decode = (str: string): Uint8Array => {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const base = alphabet.length;

    let decoded = 0n;
    let multi = 1n;

    for (let i = str.length - 1; i >= 0; i--) {
      const char = str[i];
      const index = alphabet.indexOf(char);
      if (index === -1) {
        throw new Error(`Invalid character in base58 string: ${char}`);
      }
      decoded += BigInt(index) * multi;
      multi *= BigInt(base);
    }

    // Convert to bytes
    const bytes: number[] = [];
    while (decoded > 0n) {
      bytes.unshift(Number(decoded % 256n));
      decoded = decoded / 256n;
    }

    // Add leading zeros for leading '1's in the string
    for (let i = 0; i < str.length && str[i] === '1'; i++) {
      bytes.unshift(0);
    }

    return new Uint8Array(bytes);
  };

  // Helper function to convert hex to Uint8Array
  const hexToUint8Array = (hex: string): Uint8Array => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return new Uint8Array(bytes);
  };

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;

    try {
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL
    } catch (error: any) {
      if (error.message?.includes('429')) {
        console.log('Rate limited on balance fetch, retrying in 3 seconds...');
        setTimeout(() => refreshBalance(), 3000);
        return;
      }
      console.error('Error fetching balance:', error);
    }
  }, [publicKey, connection]);

  const refreshTokens = useCallback(async () => {
    if (!publicKey) return;

    try {
      // Use TokenService to get all tokens
      const walletTokens = await tokenService.getTokenAccounts(publicKey);
      setTokens(walletTokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      // Fallback to SOL only
      setTokens([
        {
          mint: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          balance: balance,
          decimals: 9,
        }
      ]);
    }
  }, [publicKey, balance, tokenService]);

  const refreshTransactions = useCallback(async () => {
    if (!publicKey) return;

    try {
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get recent transactions with smaller limit to reduce load
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 5 });

      const transactionDetails = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await connection.getTransaction(sig.signature);
            if (!tx) return null;

            // Parse transaction details
            const amount = tx.meta?.postBalances[0] && tx.meta?.preBalances[0]
              ? Math.abs((tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9)
              : 0;

            return {
              signature: sig.signature,
              timestamp: (sig.blockTime || 0) * 1000,
              type: tx.meta?.postBalances[0] > tx.meta?.preBalances[0] ? 'receive' : 'send',
              amount,
              token: 'SOL',
              from: tx.transaction.message.accountKeys[0]?.toString() || '',
              to: tx.transaction.message.accountKeys[1]?.toString() || '',
              status: sig.confirmationStatus === 'finalized' ? 'confirmed' : 'pending',
            } as TransactionRecord;
          } catch (error) {
            console.error('Error parsing transaction:', error);
            return null;
          }
        })
      );

      const validTransactions = transactionDetails.filter(tx => tx !== null) as TransactionRecord[];
      setTransactions(validTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [publicKey, connection]);

  const sendTransaction = useCallback(async (guardianTransaction: GuardianTransaction, securityOptions: SecurityOptions) => {
    if (!wallet || !publicKey) {
      toast({
        title: "Error",
        description: "No wallet connected",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const { transaction } = guardianTransaction;

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign transaction
      transaction.sign(wallet);

      // Use GuardianLayer for security analysis
      const result = await guardian.secureTransaction({
        transaction,
        userEmail: securityOptions.emailAddress,
        options: securityOptions
      });

      if (!result.success) {
        throw new Error('Transaction blocked by security analysis');
      }

      // Send transaction
      const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);

      // Add to transaction history
      const newTransaction: TransactionRecord = {
        signature,
        timestamp: Date.now(),
        type: 'send',
        amount: guardianTransaction.metadata.amount || 0,
        token: guardianTransaction.metadata.token || 'SOL',
        from: publicKey.toString(),
        to: guardianTransaction.metadata.recipient || '',
        status: 'confirmed',
        fees: guardianTransaction.metadata.estimatedFees,
      };

      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Transaction Sent",
        description: `Transaction confirmed: ${signature}`,
      });

      // Refresh balances and transactions
      await Promise.all([refreshBalance(), refreshTokens()]);
    } catch (error: any) {
      console.error('Error sending transaction:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to send transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [wallet, publicKey, connection, toast, guardian, refreshBalance, refreshTokens]);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const storedKeypair = localStorage.getItem('guardian_wallet_keypair');
    if (storedKeypair) {
      try {
        const secretKey = new Uint8Array(JSON.parse(storedKeypair));
        const restoredWallet = Keypair.fromSecretKey(secretKey);
        setWallet(restoredWallet);
      } catch (error) {
        console.error('Error restoring wallet:', error);
        localStorage.removeItem('guardian_wallet_keypair');
      }
    }
  }, []);

  // Refresh data when wallet changes (with throttling)
  useEffect(() => {
    if (wallet) {
      // Stagger the requests to avoid rate limiting (more conservative timing)
      refreshBalance();
      setTimeout(() => refreshTokens(), 1000);
      setTimeout(() => refreshTransactions(), 2000);
    }
  }, [wallet, refreshBalance, refreshTokens, refreshTransactions]);

  return (
    <WalletContext.Provider value={{
      connection,
      wallet,
      publicKey,
      balance,
      tokens,
      transactions,
      isLoading,
      createWallet,
      importWallet,
      sendTransaction,
      refreshBalance,
      refreshTokens,
      refreshTransactions,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
