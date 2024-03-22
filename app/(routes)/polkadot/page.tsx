'use client';

import CustomButton from '@/components/ui/custom-button';

import { useEffect, useState } from 'react';
import { MetadataDef } from '@polkadot/extension-inject/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { AnyJson, SignerPayloadJSON } from '@polkadot/types/types';

export type Args = Record<string, AnyJson>;

export interface TxMethod {
  args: Args;
  name: string;
  pallet: string;
}

export default function Home() {
  const [account, setAccount] = useState<any>();
  const [wallet, setWallet] = useState<any>();
  const [signer, setSigner] = useState<any>();
  const [metadata, setMetadata] = useState<any>();
  const [api, setApi] = useState<any>();
  const [provider, setProvider] = useState();

  const setupApi = async (providerParam: any) => {
    const providerX = new WsProvider('wss://westend-rpc.polkadot.io');
    try {
      const apiX = new ApiPromise({ provider: providerX });
      await apiX.isReady;
      setApi(apiX);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConnect = async () => {
    const extension = await wallet.enable('chipopo');
    const { accounts, signer: signerX, metadata: metadataX, provider: providerX } = extension;

    // console.log('🚀 ~ file: page.tsx:17 ~ handleConnect ~ extension:', extension);
    // console.log('🚀 ~ file: page.tsx:17 ~ handleConnect ~ metadataX:', await metadataX.get());

    const accountsList = await accounts.get();

    await setupApi(providerX);
    setAccount(accountsList[0]);
    setSigner(signerX);
    setMetadata(metadataX);
    setProvider(providerX);
  };

  const handeDisconnect = async () => {
    try {
      const res = await (api as any).disconnect();
      await (provider as any).disconnect();
      console.log('🚀 ~ file: page.tsx:41 ~ handeDisconnect ~ res:', res);
    } catch (error) {
      console.log('🚀 ~ file: page.tsx:42 ~ handeDisconnect ~ error:', error);
    }
  };

  const handleSendTransaction = async () => {
    //////////// Cach 1
    // const txHash = await api.tx.balances
    //   .transferAllowDeath(account.address, 1)
    //   .signAndSend(account.address, { signer: signer }, (result: any) => {
    //     console.log('🚀 ~ file: page.tsx:53 ~ .signAndSend ~ result:', result);
    //     // do something with result
    //   });
    /////////// Cach 2
    // const transfer = api.tx.balances.transferAllowDeath(account.address, 1);
    // const signedExtrinsic = await transfer.signAsync(account.address, { signer: signer });
    // const result = await signedExtrinsic.send();
    // console.log('🚀 ~ file: page.tsx:72 ~ handleSendTransaction ~ result:', result);
    //////////
    await createTx();
    // const transfer = api.tx.balances.transferAllowDeath(account.address, 1);
    // const unsigned:SignerPayloadJSON = {
    //   address: account.address,
    //   blockHash: '0xe1b1dda72998846487e4d858909d4f9a6bbd6e338e4588e5d809de16b1317b80',
    //   blockNumber: '0x00000393',
    //   era: '0x3601',
    //   genesisHash: '0x242a54b35e1aad38f37b884eddeb71f6f9931b02fac27bf52dfb62ef754e5e62',
    //   method: transfer.toHex(),
    //   nonce: '0x0000000000000000',
    //   signedExtensions: [
    //     'CheckSpecVersion',
    //     'CheckTxVersion',
    //     'CheckGenesis',
    //     'CheckMortality',
    //     'CheckNonce',
    //     'CheckWeight',
    //     'ChargeTransactionPayment',
    //   ],
    //   specVersion: '0x00000026',
    //   tip: '0x00000000000000000000000000000000',
    //   transactionVersion: '0x00000005',
    //   version: 4,
    // };

    // const { signature } = await signer.signPayload(unsigned);
    // console.log('🚀 ~ file: page.tsx:106 ~ handleSendTransaction ~ signature:', signature);

    // const sigHex = u8aToHex(signature);

    // transfer.addSignature(account.address, sigHex, unsigned);

    // send the transaction now that is is signed
    // const hash = await api.rpc.author.submitExtrinsic(transfer.toHex());
    // const hash = await transfer.send();
    // console.log('🚀 ~ file: page.tsx:115 ~ handleSendTransaction ~ hash:', hash);
  };

  const createTx = async () => {
    const tx = api.tx.balances.transferAllowDeath('5H8RyaQz4u2kkvuMyraqDRA848iypa4HEjkQr1KbBeQfxcWg', 1000);
    const lastHeader = await api.rpc.chain.getHeader();
    const blockNumber = api.registry.createType('BlockNumber', lastHeader.number.toNumber());
    const method = api.createType('Call', tx);
    const era = api.registry.createType('ExtrinsicEra', {
      current: lastHeader.number.toNumber(),
      period: 64,
    });

    const nonceRaw = api.query.system.account(account.address)?.nonce || 0;
    const nonce = api.registry.createType('Compact<Index>', nonceRaw);
    console.log('🚀 ~ file: page.tsx:131 ~ createTx ~ nonce:', nonce.toHex());

    const payload: SignerPayloadJSON = {
      specVersion: api.runtimeVersion.specVersion.toHex(),
      transactionVersion: api.runtimeVersion.transactionVersion.toHex(),
      address: account.address,
      blockHash: lastHeader.hash.toHex(),
      blockNumber: blockNumber.toHex(),
      era: era.toHex(),
      genesisHash: api.genesisHash.toHex(),
      method: method.toHex(),
      nonce: nonce.toHex() + 10,
      signedExtensions: [
        'CheckNonZeroSender',
        'CheckSpecVersion',
        'CheckTxVersion',
        'CheckGenesis',
        'CheckMortality',
        'CheckNonce',
        'CheckWeight',
        'ChargeTransactionPayment',
      ],
      tip: api.registry.createType('Compact<Balance>', 0).toHex(),
      version: tx.version,
    };

    const { signature } = await signer.signPayload(payload);

    console.log('🚀 ~ file: page.tsx:106 ~ handleSendTransaction ~ signature:', signature);

    const signingPayload = api.registry.createType('ExtrinsicPayload', payload, {
      version: payload.version,
    });

    console.log('🚀 ~ file: page.tsx:167 ~ createTx ~ account.address:', account.address);
    tx.addSignature(account.address, signature, signingPayload);

    const hash = await tx.send();
    console.log('🚀 ~ file: page.tsx:115 ~ handleSendTransaction ~ hash:', hash.toHex());
  };

  const addMetaData = async () => {
    if (metadata) {
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
      try {
        const res = await metadata.provide(newMetaDef);
        console.log('🚀 ~ file: page.tsx:42 ~ addMetaData ~ res:', res);
      } catch (error) {
        console.log('🚀 ~ file: page.tsx:44 ~ addMetaData ~ error:', error);
      }
    }
  };

  const handleSignMessage = async () => {
    if (signer && signer.signRaw) {
      try {
        const signPromise = await signer.signRaw({
          address: account.address,
          data: 'This is dummy message',
          type: 'bytes',
        });
        console.log('🚀 ~ file: page.tsx:29 ~ handleSignMessage ~ signPromise:', signPromise.signature);
      } catch (error) {
        console.log('🚀 ~ file: page.tsx:31 ~ handleSignMessage ~ error:', error);
      }
    }
  };

  useEffect(() => {
    if (!window) return;
    if (window.injectedWeb3 && window.injectedWeb3['subwallet-js']) {
      console.log('Subwallet Available!!!');
      setWallet(window.injectedWeb3['subwallet-js']);
    }
  }, []);

  return (
    <main className="overflow-hidden">
      {!account && (
        <CustomButton
          title="Connect wallet"
          onClick={() => {
            handleConnect();
          }}
        />
      )}
      {account && (
        <div>
          <div>{account.address}</div>

          <CustomButton
            title="Handle disconnect"
            onClick={() => {
              handeDisconnect();
            }}
          />
          <CustomButton
            title="Send transaction"
            onClick={() => {
              handleSendTransaction();
            }}
          />

          <CustomButton
            title="Sign message"
            onClick={() => {
              handleSignMessage();
            }}
          />
          <CustomButton
            title="Add Metadata"
            onClick={() => {
              addMetaData();
            }}
          />
        </div>
      )}
    </main>
  );
}
