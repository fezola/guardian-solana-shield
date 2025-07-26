import React from 'react';
import Header from "@/components/Header";
import { WalletApp } from "@/wallet/pages/WalletApp";

const Wallet = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <WalletApp />
      </main>
    </div>
  );
};

export default Wallet;
