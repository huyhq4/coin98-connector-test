import CardMethod from '@/components/ui/card-method';
import { useWallet } from '@coin98t/wallet-adapter-react';
import { AminoMsg, StdFee, makeSignDoc as makeSignDocAmino } from '@cosmjs/amino';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { fromBase64 } from '@cosmjs/encoding';
import { Int53 } from '@cosmjs/math';
import {
  OfflineDirectSigner,
  Registry,
  TxBodyEncodeObject,
  makeAuthInfoBytes,
  makeSignDoc,
} from '@cosmjs/proto-signing';
import {
  Account,
  AminoConverters,
  AminoTypes,
  createAuthzAminoConverters,
  createBankAminoConverters,
  createDistributionAminoConverters,
  createFeegrantAminoConverters,
  createGovAminoConverters,
  createIbcAminoConverters,
  createStakingAminoConverters,
  createVestingAminoConverters,
} from '@cosmjs/stargate';
import { SigningStargateClient } from '@injectivelabs/sdk-ts/dist/cjs/core/stargate/SigningStargateClient';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { useEffect, useMemo, useState } from 'react';
import { AdapterCosmos } from '@coin98t/wallet-adapter-base';
import CustomButton from './ui/custom-button';
import ResultTxt from './ui/resultTxt';

function createDefaultTypes(): AminoConverters {
  return {
    ...createAuthzAminoConverters(),
    ...createBankAminoConverters(),
    ...createDistributionAminoConverters(),
    ...createGovAminoConverters(),
    ...createStakingAminoConverters(),
    ...createIbcAminoConverters(),
    ...createFeegrantAminoConverters(),
    ...createVestingAminoConverters(),
  };
}

const ContentCosmos = () => {
  // Hook
  const { address, signMessage, wallet, selectedChainId, provider } = useWallet();
  const [resultMessage, setResultMessage] = useState('');
  const [resultGetKey, setResultGetKey] = useState('');
  const [resultDirect, setResultDirect] = useState<TxRaw | string>('');
  const [resultAmino, setResultAmino] = useState<TxRaw | string>('');
  //adapter
  const adapter = wallet?.adapter as AdapterCosmos;
  //amino type
  const aminoTypes = new AminoTypes(createDefaultTypes());
  //message sign arbitrary
  const messageSign = 'Hi, im LawK from coin98 dev';
  //rpc injective
  // const rpcUrl = 'https://injective-rpc.publicnode.com:443';
  //rpc sei mainnet
  const rpcUrl = 'https://sei-rpc.publicnode.com:443';

  const handleGetKey = async () => {
    //@ts-ignore
    const key = await provider.getKey(selectedChainId);
    setResultGetKey(JSON.stringify(key));
  };
  const handleSignMessage = async () => {
    try {
      const res = await (adapter as any).signMessage(messageSign);
      setResultMessage(Buffer.from(res.data).toString('hex'));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignDirect = async () => {
    const offlineSigner = await adapter.getOfflineSigner(selectedChainId as string, 'direct');
    let SigningClient = SigningCosmWasmClient;
    if (selectedChainId === 'injective-1') {
      //@ts-ignore
      SigningClient = SigningStargateClient;
    }
    const client = await SigningClient.connectWithSigner(rpcUrl, offlineSigner as any);
    const { accountNumber, sequence } = (await client.getAccount(address as string)) as Account;
    const accountFromSigner = (await offlineSigner.getAccounts()).find(
      //@ts-ignore
      (account: Account) => account.address === address,
    );
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }
    //@ts-expect-error
    const key = await provider.getKey(selectedChainId);
    const pubkey = key.pubKey;
    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages: [
          {
            typeUrl: '/cosmos.bank.v1beta1.MsgSend',
            value: {
              fromAddress: address,
              toAddress: address,
              amount: [
                {
                  denom: 'inj',
                  amount: '0.001',
                },
              ],
            },
          },
        ],
      },
    };
    const fee: StdFee = {
      amount: [
        {
          denom: 'inj',
          amount: '2000',
        },
      ],
      gas: '180000', // 180k
      granter: '',
      payer: address as string,
    };
    const registry = new Registry();
    const txBodyBytes = registry.encode(txBodyEncodeObject);
    const gasLimit = Int53.fromString(fee.gas).toNumber();
    const authInfoBytes = makeAuthInfoBytes([{ pubkey, sequence }], fee.amount, gasLimit, fee.granter, fee.payer);
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, selectedChainId as string, accountNumber);
    //@ts-ignore
    const { signature, signed } = await adapter.signDirect(selectedChainId, address, signDoc);
    const txRaw = TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64((signature as any).signature)],
    });
    setResultDirect(JSON.stringify(txRaw));
  };

  const handleSignAmino = async () => {
    const offlineSigner = await adapter.getOfflineSigner(selectedChainId as string, 'direct');
    let SigningClient = SigningCosmWasmClient;
    if (selectedChainId === 'injective-1') {
      //@ts-ignore
      SigningClient = SigningStargateClient;
    }
    const client = await SigningClient.connectWithSigner(rpcUrl, offlineSigner as any);
    const { accountNumber, sequence } = (await client.getAccount(address as string)) as Account;
    const accountFromSigner = (await offlineSigner.getAccounts()).find(
      //@ts-ignore
      (account: Account) => account.address === address,
    );
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }
    //@ts-expect-error
    const key = await provider.getKey(selectedChainId);
    const pubkey = key.pubKey;
    const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
    const messages = [
      {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          fromAddress: address,
          toAddress: address,
          amount: [
            {
              denom: 'inj',
              amount: '0.001',
            },
          ],
        },
      },
    ];
    const msgs = messages.map(msg => aminoTypes.toAmino(msg));
    const fee: StdFee = {
      amount: [
        {
          denom: 'inj',
          amount: '2000',
        },
      ],
      gas: '180000', // 180k
      granter: '',
      payer: address as string,
    };
    const memo = 'LawK memo test';
    const signDoc = makeSignDocAmino(msgs, fee, selectedChainId as string, memo, accountNumber, sequence);
    const { signature, signed } = (await adapter.signAmino(
      selectedChainId as string,
      address as string,
      signDoc as any,
    )) as any;
    const signedTxBody = {
      messages: signed.msgs.map((msg: AminoMsg) => aminoTypes.fromAmino(msg)),
      memo: signed.memo,
    };
    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: signedTxBody,
    };
    const registry = new Registry();
    const signedTxBodyBytes = registry.encode(signedTxBodyEncodeObject);
    const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
    const signedSequence = Int53.fromString(signed.sequence).toNumber();
    const signedAuthInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence: signedSequence }],
      signed.fee.amount,
      signedGasLimit,
      signed.fee.granter,
      signed.fee.payer,
      signMode,
    );
    const txRaw = TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
    setResultAmino(JSON.stringify(txRaw));
  };

  useEffect(() => {
    window.addEventListener('keplr_keystorechange', () => {
      console.log('Key store in Keplr is changed. You may need to refetch the account info.');
    });

    () =>
      window.removeEventListener('keplr_keystorechange', () => {
        console.log('Key store in Keplr is changed. You may need to refetch the account info.');
      });
  }, []);

  const methodList = [
    {
      title: 'Get Key',
      result: resultGetKey,
      func: handleGetKey,
    },
    {
      title: 'Sign Arbitrary',
      result: resultMessage,
      func: handleSignMessage,
    },
    {
      title: 'Sign Direct',
      result: resultDirect,
      func: handleSignDirect,
    },
    {
      title: 'Sign Amino',
      result: resultAmino,
      func: handleSignAmino,
    },
  ];

  const renderMethodList = useMemo(() => {
    return methodList.map(({ title, result, func }, index) => (
      <div key={index}>
        <CardMethod title={title}>
          <CustomButton title="Sign" onClick={func} className="mt-6" />
          {result && <ResultTxt txt={result} />}
        </CardMethod>
      </div>
    ));
  }, [JSON.stringify(methodList)]);

  return <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">{renderMethodList}</div>;
};

export default ContentCosmos;
