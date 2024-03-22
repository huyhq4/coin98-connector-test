'use client';

import { CHAINS_ID, useWallet, WALLETS_NAME, TypeConnectError } from '@coin98t/wallet-adapter-react';
import Link from 'next/link';

const chainId = CHAINS_ID.binanceSmartTest;
const walletId = WALLETS_NAME.metamask;

const NonModalEVM = () => {
  const { wallet, address, selectWallet, connected, disconnect, selectedBlockChain, selectedChainId, switchNetwork } =
    useWallet();

  const handleConnectWallet = () => {
    selectWallet(walletId, chainId, async (error: Error, typeError: TypeConnectError, addNetwork, provider) => {
      console.log('error:', error);
      //Handle adding network unavailable on wallet
      if (typeError === 'network') {
        // Option 1:
        // Add available network from adapter
        await addNetwork?.();

        // Option 2:
        // Add custom network from adapter
        (provider as any).request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainId,
              chainName: 'Binance Smart Chain Testnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            },
          ],
        });
      }
    });
  };

  return (
    <div style={{ height: '100vh', padding: '20px', fontSize: '20px' }}>
      <h1 className="text-2xl font-bold p-2 text-center">Test Function Page</h1>
      <div className="flex justify-end mt-10">
        <div>
          {!connected && (
            <button
              className="p-2.5 border-2 rounded-lg hover:bg-slate-300 hover:border-black duration-200 cursor-pointer"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {connected && (
        <>
          {/* Handle for Dapp */}
          <div className="flex items-center gap-4 flex-wrap">
            <div>Address: {`${address?.slice(0, 7)}...${address?.slice(address.length - 6, address.length - 1)}`}</div>

            <button
              className="p-2.5 border-2 rounded-lg hover:bg-slate-300 hover:border-black duration-200 cursor-pointer"
              onClick={disconnect}
            >
              Disconnect
            </button>

            {/* <button
              className="p-2.5 border-2 ml-4 rounded-lg hover:bg-slate-300 hover:border-black duration-200 cursor-pointer"
              onClick={async () => {
                const resSwitchNetwork = await switchNetwork(CHAINS_ID.ether, async (error: Error) => {
                  {
                    return await (wallet?.adapter.provider as any).request({
                      method: 'wallet_addEthereumChain',
                      params: [
                        {
                          chainId: CHAINS_ID.binanceSmartTest,
                          chainName: 'Binance Smart Chain Testnet',

                          nativeCurrency: {
                            name: 'BNB',
                            symbol: 'BNB',
                            decimals: 18,
                          },
                          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                        },
                      ],
                    });
                  }
                });

                console.log('🚀 ~ file: page.tsx:79 ~ resSwitchNetwork ~ resSwitchNetwork:', resSwitchNetwork);
              }}
            >
              Switch chain EVM
            </button> */}
          </div>

          {/* Infor */}
          <div className="border-[2px] border-orange-600 rounded-3xl p-4 mt-6">
            <div>Network Id:{selectedChainId}</div>
            <div>BlockChain:{selectedBlockChain}</div>
          </div>

          {/* Router page */}
          <Link href="/" passHref className="flex mt-40 justify-center">
            <button className="p-2.5 border-2 rounded-lg hover:bg-slate-300 hover:border-black duration-200 cursor-pointer">
              Go to C98 Modal Page{' '}
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default NonModalEVM;
