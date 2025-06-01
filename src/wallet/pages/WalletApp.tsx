
import React from 'react';
import { WalletProvider, useWallet } from '../context/WalletContext';
import { WalletSetup } from '../components/WalletSetup';
import { WalletDashboard } from '../components/WalletDashboard';

const WalletAppContent: React.FC = () => {
  const { wallet } = useWallet();

  if (!wallet) {
    return <WalletSetup />;
  }

  return <WalletDashboard />;
};

export const WalletApp: React.FC = () => {
  return (
    <WalletProvider>
      <WalletAppContent />
    </WalletProvider>
  );
};
