'use client';

import {
  ancient8Test,
  bscTest,
  ChainInfo,
  evmChains,
  injectiveEthereumMainnet,
  injectiveMainnet,
  injectiveTestnet,
  nearMainnet,
  nearTestnet,
  seiNetwork,
  seiTestnet,
  solana,
  polkadot,
  westend,
} from '@coin98t/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';
import React from 'react';

const WalletModalC98 = dynamic(async () => (await import('@coin98t/wallet-adapter-react-ui')).WalletModalC98, {
  ssr: false,
});

const Coin98AdapterModal = () => {
  const defaultChains: ChainInfo[] = [
    solana,
    // seiNetwork,
    // seiTestnet,
    // nearMainnet,
    // nearTestnet,
    // injectiveTestnet,
    // injectiveMainnet,
    // injectiveEthereumMainnet,
    bscTest,
    ancient8Test,
    // polkadot,
    // westend,
    ...evmChains,
  ];
  return <WalletModalC98 isC98Theme enableChains={defaultChains} activeChainId={'0x1'} />;
};

export default Coin98AdapterModal;
