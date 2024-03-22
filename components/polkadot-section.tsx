'use client';
import CustomButton from '@/components/ui/custom-button';
import { useWallet } from '@coin98t/wallet-adapter-react';
import { useEffect, useState } from 'react';
import ResultTxt from './ui/resultTxt';
import CardMethod from '@/components/ui/card-method';
import { MetadataDef } from '@polkadot/extension-inject/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { ApiPromise, WsProvider } from '@polkadot/api';

export default function PolkadotSection() {
  const [resultSignPayload, setSignPayload] = useState('');
  const [resultSignMessage, setResultSignMessage] = useState('');
  const [resullMedata, setMetadata] = useState('');

  const [api, setApi] = useState<any>();

  const { signPayload, signMessage, addMetadata, address, selectedChainId, injectedAccounts } = useWallet();

  const handleSignMessage = async () => {
    const res = await signMessage('ChiPoPo');
    setResultSignMessage(res.data as any);
  };

  const handleSignPayload = async () => {
    const transfer = api.tx.balances.transferAllowDeath(address, 1);
    const unsigned: SignerPayloadJSON = {
      address: address as string,
      blockHash: '0xe1b1dda72998846487e4d858909d4f9a6bbd6e338e4588e5d809de16b1317b80',
      blockNumber: '0x00000393',
      era: '0x3601',
      genesisHash: '0x242a54b35e1aad38f37b884eddeb71f6f9931b02fac27bf52dfb62ef754e5e62',
      method: transfer.toHex(),
      nonce: '0x0000000000000000',
      signedExtensions: [
        'CheckSpecVersion',
        'CheckTxVersion',
        'CheckGenesis',
        'CheckMortality',
        'CheckNonce',
        'CheckWeight',
        'ChargeTransactionPayment',
      ],
      specVersion: '0x00000026',
      tip: '0x00000000000000000000000000000000',
      transactionVersion: '0x00000005',
      version: 4,
    };
    const res = await signPayload(unsigned);
    setSignPayload(res.data as string);
  };

  const handleAddMetadata = async () => {
    const newMetaDef: MetadataDef = {
      chain: 'SubWallet Connect Demo',
      genesisHash: '0x1bf2a278799868de66ea8610f2ce7c8c43706561b6476031315f6640fe38e888',
      icon: 'substrate',
      ss58Format: 0,
      chainType: 'substrate',
      color: '#F0F0F0',
      specVersion: Math.floor(Date.now() / 1000),
      tokenDecimals: 12,
      tokenSymbol: 'SWCC',
      types: {},
    };
    const res = await addMetadata(newMetaDef);
    setMetadata(res.data as unknown as string);
  };
  useEffect(() => {
    const setupApi = async (providerParam?: any) => {
      const providerX =
        selectedChainId === 'polkadot'
          ? new WsProvider('wss://rpc.polkadot.io')
          : new WsProvider('wss://westend-rpc.polkadot.io');
      try {
        const apiX = new ApiPromise({ provider: providerX });
        await apiX.isReady;
        setApi(apiX);
      } catch (error) {
        console.log(error);
      }
    };

    setupApi();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
      <CardMethod title="Sign Payload">
        <CustomButton
          title="Send"
          onClick={() => {
            handleSignPayload();
          }}
          className="mt-6"
        />
        {resultSignPayload && <ResultTxt txt={resultSignPayload} />}
      </CardMethod>

      <CardMethod title="Add Metadata">
        <CustomButton
          title="Send"
          onClick={() => {
            handleAddMetadata();
          }}
          className="mt-6"
        />
        {resultSignPayload && <ResultTxt txt={resullMedata} />}
      </CardMethod>

      <CardMethod title="Sign message">
        <CustomButton
          title="Sign"
          onClick={() => {
            handleSignMessage();
          }}
          className="mt-6"
        />
        {resultSignMessage && <ResultTxt txt={resultSignMessage} />}
      </CardMethod>
    </div>
  );
}
