
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Shield, 
  Lock, 
  Mail, 
  Fingerprint,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { SecurityOptions } from './SecurityOptions';
import { TransactionSimulator } from './TransactionSimulator';
import { useWallet } from '../context/WalletContext';
import { SecurityOptions as SecurityOptionsType, RiskAnalysis } from '../types';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';

export const SecureSend: React.FC = () => {
  const { wallet, connection, sendTransaction } = useWallet();
  const { toast } = useToast();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [securityOptions, setSecurityOptions] = useState<SecurityOptionsType>({
    simulate: true,
    biometric: false,
    pin: false,
    otp: false,
    timeLockThreshold: 1.0,
  });
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [securityStep, setSecurityStep] = useState<'setup' | 'simulation' | 'verification' | 'sending'>('setup');
  const [pin, setPin] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const createTransaction = async () => {
    if (!wallet || !recipient || !amount) return null;

    try {
      const recipientPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      return transaction;
    } catch (error) {
      toast({
        title: "Invalid Transaction",
        description: "Please check the recipient address and amount",
        variant: "destructive",
      });
      return null;
    }
  };

  const handlePrepareTransaction = async () => {
    const tx = await createTransaction();
    if (tx) {
      setTransaction(tx);
      if (securityOptions.simulate) {
        setSecurityStep('simulation');
        setIsSimulating(true);
      } else {
        setSecurityStep('verification');
      }
    }
  };

  const handleSimulationComplete = (analysis: RiskAnalysis) => {
    setRiskAnalysis(analysis);
    setIsSimulating(false);
    setSecurityStep('verification');
  };

  const handleSecurityVerification = async () => {
    // PIN verification
    if (securityOptions.pin && !pin) {
      toast({
        title: "PIN Required",
        description: "Please enter your PIN to continue",
        variant: "destructive",
      });
      return;
    }

    // OTP verification
    if (securityOptions.otp && !otpCode) {
      toast({
        title: "OTP Required",
        description: "Please enter the verification code sent to your email",
        variant: "destructive",
      });
      return;
    }

    // Biometric verification (mock)
    if (securityOptions.biometric) {
      const biometricResult = await mockBiometricAuth();
      if (!biometricResult) {
        toast({
          title: "Biometric Verification Failed",
          description: "Please try again",
          variant: "destructive",
        });
        return;
      }
    }

    // Time lock check
    const transactionAmount = parseFloat(amount);
    if (transactionAmount > (securityOptions.timeLockThreshold || 1.0)) {
      toast({
        title: "Time Lock Activated",
        description: `Transactions above ${securityOptions.timeLockThreshold} SOL require a 24-hour delay`,
        variant: "destructive",
      });
      return;
    }

    // Proceed with transaction
    if (transaction) {
      setSecurityStep('sending');
      try {
        await sendTransaction(transaction, securityOptions);
        toast({
          title: "Transaction Sent",
          description: "Your transaction has been successfully sent",
        });
        // Reset form
        setRecipient('');
        setAmount('');
        setTransaction(null);
        setRiskAnalysis(null);
        setSecurityStep('setup');
        setPin('');
        setOtpCode('');
      } catch (error) {
        toast({
          title: "Transaction Failed",
          description: "Failed to send transaction. Please try again.",
          variant: "destructive",
        });
        setSecurityStep('verification');
      }
    }
  };

  const mockBiometricAuth = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Mock biometric authentication
      setTimeout(() => {
        resolve(Math.random() > 0.1); // 90% success rate
      }, 1000);
    });
  };

  const renderSecurityVerification = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="w-5 h-5" />
          <span>Security Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {riskAnalysis && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="font-medium">Risk Assessment: {riskAnalysis.level}</p>
            <p className="text-sm text-muted-foreground">{riskAnalysis.recommendation}</p>
          </div>
        )}

        {securityOptions.pin && (
          <div className="space-y-2">
            <Label htmlFor="pin">Enter PIN</Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your 6-digit PIN"
              maxLength={6}
            />
          </div>
        )}

        {securityOptions.otp && (
          <div className="space-y-2">
            <Label htmlFor="otp">Email Verification Code</Label>
            <Input
              id="otp"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
            <p className="text-sm text-muted-foreground">
              Code sent to {securityOptions.emailAddress}
            </p>
          </div>
        )}

        {securityOptions.biometric && (
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Fingerprint className="w-5 h-5 text-blue-600" />
            <span className="text-sm">Biometric verification required</span>
          </div>
        )}

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setSecurityStep('setup')}>
            Cancel
          </Button>
          <Button 
            onClick={handleSecurityVerification}
            disabled={securityStep === 'sending'}
            className="flex-1"
          >
            {securityStep === 'sending' ? 'Sending...' : 'Verify & Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {securityStep === 'setup' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Send SOL</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter Solana address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (SOL)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                />
              </div>

              <Button 
                onClick={handlePrepareTransaction}
                disabled={!recipient || !amount}
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                Prepare Secure Transaction
              </Button>
            </CardContent>
          </Card>

          <SecurityOptions 
            onOptionsChange={setSecurityOptions}
            defaultOptions={securityOptions}
          />
        </>
      )}

      {securityStep === 'simulation' && (
        <TransactionSimulator
          transaction={transaction}
          onSimulationComplete={handleSimulationComplete}
          isSimulating={isSimulating}
        />
      )}

      {securityStep === 'verification' && renderSecurityVerification()}
    </div>
  );
};
