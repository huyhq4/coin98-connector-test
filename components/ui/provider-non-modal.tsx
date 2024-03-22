'use client';

import { Coin98WalletAdapter } from '@coin98t/wallet-adapter-coin98';
import { MetaMaskWalletAdapter } from '@coin98t/wallet-adapter-metamask';
import { RamperWalletAdapter } from '@coin98t/wallet-adapter-ramper';
import { FoxWalletAdapter } from '@coin98t/wallet-adapter-fox';

import { BLOCKCHAINS_DATA, WalletProvider } from '@coin98t/wallet-adapter-react';
import { useEffect } from 'react';
interface ContainerProps {
  children: React.ReactNode;
}

const ProviderNoneModal: React.FC<ContainerProps> = ({ children }) => {
  const enables = [BLOCKCHAINS_DATA.ethereum];
  const wallets = [Coin98WalletAdapter, MetaMaskWalletAdapter, RamperWalletAdapter, FoxWalletAdapter];

  useEffect(() => {
    (async () => {
      if (typeof window !== 'undefined') {
        const eruda = await import('eruda');
        eruda.default.init();
      }
    })();
  }, []);

  return (
    <WalletProvider wallets={wallets} enables={enables} autoConnect>
      {children}
    </WalletProvider>
  );
};

export default ProviderNoneModal;
