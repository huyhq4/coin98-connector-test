'use client';

import { PhantomWalletAdapter } from '@coin98t/wallet-adapter-phantom';
import { BLOCKCHAINS_DATA, WalletProvider } from '@coin98t/wallet-adapter-react';
import { WalletModalProvider } from '@coin98t/wallet-adapter-react-ui';
// import { LedgerAdapter } from '@coin98t/wallet-adapter-ledger';
import { Coin98WalletAdapter } from '@coin98t/wallet-adapter-coin98';
import { CompassWalletAdapter } from '@coin98t/wallet-adapter-compass';
import { FinWalletAdapter } from '@coin98t/wallet-adapter-fin';
import { KeplrWalletAdapter } from '@coin98t/wallet-adapter-keplr';
import { LeapWalletAdapter } from '@coin98t/wallet-adapter-leap';
import { MetaMaskWalletAdapter } from '@coin98t/wallet-adapter-metamask';
import { NinjiWalletAdapter } from '@coin98t/wallet-adapter-ninji';
// import { BinanceWalletAdapter } from '@coin98t/wallet-adapter-binance-wallet';
// import { TrustWalletAdapter } from '@coin98t/wallet-adapter-trust-wallet';
// import { CoinbaseAdapter } from '@coin98t/wallet-adapter-coinbase';
// import { BitgetWalletAdapter } from '@coin98t/wallet-adapter-bitget';
// import { WalletConnectAdapter } from '@coin98t/wallet-adapter-walletconnect';
// import { SafePalWalletAdapter } from '@coin98t/wallet-adapter-safepal';
// import { CryptoWalletAdapter } from '@coin98t/wallet-adapter-crypto';
// import { ExodusWalletAdapter } from '@coin98t/wallet-adapter-exodus';
// import { TrezorWalletAdapter } from '@coin98t/wallet-adapter-trezor';
import { RamperWalletAdapter } from '@coin98t/wallet-adapter-ramper';
import { SarosWalletAdapter } from '@coin98t/wallet-adapter-saros';
// import { SubWalletAdapter } from '@coin98t/wallet-adapter-subwallet';
import { BybitWalletAdapter } from '@coin98t/wallet-adapter-bybit';
import { FoxWalletAdapter } from '@coin98t/wallet-adapter-fox';
import { ParticleWalletAdapter } from '@coin98t/wallet-adapter-particle';
// import { Ancient8WalletAdapter } from '@coin98t/wallet-adapter-ancient8';
// import { KrystalWalletAdapter } from '@coin98t/wallet-adapter-krystal';
import { HaloWalletAdapter } from '@coin98t/wallet-adapter-halo';
// import { LedgerAdapter } from '@coin98t/wallet-adapter-ledger';

// import { BinanceWalletAdapter } from '@coin98t/wallet-adapter-binance-wallet';
// import { TrustWalletAdapter } from '@coin98t/wallet-adapter-trust-wallet';
// import { CoinbaseAdapter } from '@coin98t/wallet-adapter-coinbase';
// import { BitgetWalletAdapter } from '@coin98t/wallet-adapter-bitget';
// import { WalletConnectAdapter } from '@coin98t/wallet-adapter-walletconnect';
// import { SafePalWalletAdapter } from '@coin98t/wallet-adapter-safepal';
// import { CryptoWalletAdapter } from '@coin98t/wallet-adapter-crypto';
// import { ExodusWalletAdapter } from '@coin98t/wallet-adapter-exodus';
// import { TrezorWalletAdapter } from '@coin98t/wallet-adapter-trezor';
// import { SubWalletAdapter } from '@coin98t/wallet-adapter-subwallet';
// import { Ancient8WalletAdapter } from '@coin98t/wallet-adapter-ancient8';
import { KrystalWalletAdapter } from '@coin98t/wallet-adapter-krystal';

interface ContainerProps {
  children: React.ReactNode;
}

const Provider: React.FC<ContainerProps> = ({ children }) => {
  const enables = [
    BLOCKCHAINS_DATA.cosmos,
    BLOCKCHAINS_DATA.injective,
    BLOCKCHAINS_DATA.sei,
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
    NinjiWalletAdapter,
    PhantomWalletAdapter,
    SarosWalletAdapter,
    HaloWalletAdapter,
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
    // SubWalletAdapter,
    FoxWalletAdapter,
    ParticleWalletAdapter,
    BybitWalletAdapter,
    // Ancient8WalletAdapter,
    KrystalWalletAdapter,
  ];
  return (
    <WalletProvider wallets={wallets} enables={enables} autoConnect keepConnectionOnDisconnected>
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  );
};

export default Provider;
