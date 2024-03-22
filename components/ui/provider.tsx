'use client';

import { BLOCKCHAINS_DATA, WalletProvider } from '@coin98-com/wallet-adapter-react';
import { WalletModalProvider } from '@coin98-com/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@coin98-com/wallet-adapter-phantom';
// import { LedgerAdapter } from '@coin98-com/wallet-adapter-ledger';
import { Coin98WalletAdapter } from '@coin98-com/wallet-adapter-coin98';
import { MetaMaskWalletAdapter } from '@coin98-com/wallet-adapter-metamask';

import { KeplrWalletAdapter } from '@coin98-com/wallet-adapter-keplr';
import { LeapWalletAdapter } from '@coin98-com/wallet-adapter-leap';
import { CompassWalletAdapter } from '@coin98-com/wallet-adapter-compass';
import { FinWalletAdapter } from '@coin98-com/wallet-adapter-fin';
// import { BinanceWalletAdapter } from '@coin98-com/wallet-adapter-binance-wallet';
// import { TrustWalletAdapter } from '@coin98-com/wallet-adapter-trust-wallet';
// import { CoinbaseAdapter } from '@coin98-com/wallet-adapter-coinbase';
// import { BitgetWalletAdapter } from '@coin98-com/wallet-adapter-bitget';
// import { WalletConnectAdapter } from '@coin98-com/wallet-adapter-walletconnect';
// import { SafePalWalletAdapter } from '@coin98-com/wallet-adapter-safepal';
// import { CryptoWalletAdapter } from '@coin98-com/wallet-adapter-crypto';
// import { ExodusWalletAdapter } from '@coin98-com/wallet-adapter-exodus';
// import { TrezorWalletAdapter } from '@coin98-com/wallet-adapter-trezor';
import { RamperWalletAdapter } from '@coin98-com/wallet-adapter-ramper';
import { SubWalletAdapter } from '@coin98-com/wallet-adapter-subwallet';
import { FoxWalletAdapter } from '@coin98-com/wallet-adapter-fox';
import { ParticleWalletAdapter } from '@coin98-com/wallet-adapter-particle';
import { BybitWalletAdapter } from '@coin98-com/wallet-adapter-bybit';
import { Ancient8WalletAdapter } from '@coin98-com/wallet-adapter-ancient8';

interface ContainerProps {
  children: React.ReactNode;
}

const Provider: React.FC<ContainerProps> = ({ children }) => {
  const enables = [
    BLOCKCHAINS_DATA.cosmos,
    BLOCKCHAINS_DATA.ethereum,
    BLOCKCHAINS_DATA.solana,
    BLOCKCHAINS_DATA.near,
    BLOCKCHAINS_DATA.polkadot,
  ];
  const wallets = [
    Coin98WalletAdapter,
    MetaMaskWalletAdapter,
    KeplrWalletAdapter,
    LeapWalletAdapter,
    CompassWalletAdapter,
    FinWalletAdapter,
    PhantomWalletAdapter,
    // LedgerAdapter,
    // TrustWalletAdapter,
    // BinanceWalletAdapter,
    // CoinbaseAdapter,
    // WalletConnectAdapter,
    // BitgetWalletAdapter,
    // SafePalWalletAdapter,
    // CryptoWalletAdapter,
    // ExodusWalletAdapter,
    // TrezorWalletAdapter,
    RamperWalletAdapter,
    SubWalletAdapter,
    FoxWalletAdapter,
    ParticleWalletAdapter,
    BybitWalletAdapter,
    Ancient8WalletAdapter,
  ];
  return (
    <WalletProvider wallets={wallets} enables={enables} autoConnect>
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  );
};

export default Provider;
