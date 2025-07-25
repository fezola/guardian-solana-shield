
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

  // Use devnet for development
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // Initialize GuardianLayer SDK
  const guardian = new GuardianLayer({
    rpcUrl: 'https://api.devnet.solana.com',
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
      const secretKey = new Uint8Array(JSON.parse(privateKey));
      const importedWallet = Keypair.fromSecretKey(secretKey);
      setWallet(importedWallet);
      
      localStorage.setItem('guardian_wallet_keypair', privateKey);
      
      toast({
        title: "Wallet Imported",
        description: "Your wallet has been imported successfully.",
      });
    } catch (error) {
      console.error('Error importing wallet:', error);
      toast({
        title: "Error",
        description: "Failed to import wallet. Please check your private key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;
    
    try {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL
    } catch (error) {
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
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
      const transactionRecords: TransactionRecord[] = signatures.map(sig => ({
        signature: sig.signature,
        timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
        type: 'send', // This would need more logic to determine
        amount: 0, // This would need to be parsed from the transaction
        token: 'SOL',
        from: publicKey.toString(),
        to: '', // This would need to be parsed
        status: sig.err ? 'failed' : 'confirmed',
      }));
      
      setTransactions(transactionRecords);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [publicKey, connection]);

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

  // Refresh data when wallet changes
  useEffect(() => {
    if (wallet) {
      refreshBalance();
      refreshTokens();
      refreshTransactions();
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
