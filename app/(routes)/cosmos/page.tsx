'use client';

import CustomButton from '@/components/ui/custom-button';

import { useEffect, useState } from 'react';
import { coins, makeSignDoc as makeSignDocAmino, StdSignDoc } from '@cosmjs/amino';
import { calculateFee, AminoTypes, createDefaultAminoConverters } from '@cosmjs/stargate';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { fromBase64, toBase64, toUtf8 } from '@cosmjs/encoding';
import { createWasmAminoConverters, SigningCosmWasmClient, CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

import { encodePubkey, makeAuthInfoBytes, makeSignDoc, Registry, TxBodyEncodeObject } from '@cosmjs/proto-signing';
import { Random } from '@cosmjs/crypto';

import {
  MsgSend,
  BaseAccount,
  DEFAULT_STD_FEE,
  ChainRestAuthApi,
  ChainRestTendermintApi,
  CosmosTxV1Beta1Tx,
  BroadcastMode,
  getTxRawFromTxRawOrDirectSignResponse,
  hexToBuff,
  createTransaction,
  TxRestClient,
} from '@injectivelabs/sdk-ts';

import { BigNumberInBase, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from '@injectivelabs/utils';
import { ChainId } from '@injectivelabs/ts-types';
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';

// const chainId = 'cosmoshub-4';
// const rpcUrl = 'https://rpc-cosmoshub.keplr.app';
// const denom = 'uatom';
// const gasPrice = '0.0025' + denom;
// const memo = '';

// const chainId = 'axelar-testnet-lisbon-3';
// const rpcUrl = 'https://tm.axelar-testnet.lava.build';
// const denom = 'uaxl';
// const gasPrice = '0.0025' + denom;
// const memo = '';

// const chainId = 'injective-1';
// const rpcUrl = 'https://injective-rpc.publicnode.com:443';
// const denom = 'inj';
// const gasPrice = '0.0025' + denom;
// const memo = '';

const chainId = 'injective-1';
// const rpcUrl = 'https://testnet.sentry.tm.injective.network:443';
const rpcUrl = 'https://injective-rpc.publicnode.com:443';
const denom = 'inj';
const gasPrice = '0.0025' + denom;
const memo = '';

// wall agent myself area ball clarify trip zebra labor grain trade make
// const chainId = 'atlantic-2';
// const rpcUrl = 'https://rpc.atlantic-2.seinetwork.io/';
// const denom = 'usei';
// const gasPrice = '0.0025' + denom;
// const memo = '';

// const chainId = 'osmo-test-5';
// const rpcUrl = 'https://rpc.testnet.osmosis.zone';
// const denom = 'uosmo';
// const gasPrice = '0.0025' + denom;
// const memo = '';

// const chainId = 'osmosis-1';
// const rpcUrl = 'https://rpc.osmosis.zone/';
// const denom = 'uosmo';
// const gasPrice = '0.0025' + denom;
// const memo = '';

const Home = () => {
  const [account, setAccount] = useState<any>();
  const [wallet, setWallet] = useState<any>();
  const [client, setClient] = useState<any>();
  const [pubKey, setPubKey] = useState<any>();
  const [tx, setTx] = useState();

  const handleConnect = async () => {
    await wallet.enable(chainId);

    const { bech32Address, pubKey: pubKeyx } = await wallet.getKey(chainId);

    setPubKey(pubKeyx);
    setAccount(bech32Address);
  };

  const handleSignAmino = async () => {
    const senderAddress = account;

    //////////////////////////////
    // msgs contract
    // const CONTRACT_ADDRESS = 'sei1js8sp93fvyvjz4wqpkhj7qfxyvxydh3xcgt94em6kw3upusej4tsnnkdzk';
    // const msg = {
    //   transfer: {
    //     recipient: 'sei19lcp3xt2s4y082m72nphkles38dyczuq6jgwhx',
    //     amount: '100',
    //   },
    // };
    // const message = {
    //   typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    //   value: MsgExecuteContract.fromPartial({
    //     sender: senderAddress,
    //     contract: CONTRACT_ADDRESS,
    //     msg: toUtf8(JSON.stringify(msg)),
    //     funds: [],
    //   }),
    // };

    // // Estimate fee
    // const gasEstimation = await (client as any).simulate(senderAddress, [message], memo);
    // const multiplier = 1.4;
    // const fee = calculateFee(Math.round(gasEstimation * multiplier), gasPrice);

    // //Convert message to stdSignDoc, nhưng option khác là thay vì mình gọi signAmino trên dapp thì mình gọi thẳng hàm sign hoặc excute từ bên thằng SigningCosmWasmClient (client) moẹ cho nhanh
    // const { accountNumber, sequence } = await (client as any).getAccount(account);
    // const aminoTypes = new AminoTypes({
    //   ...createDefaultAminoConverters(),
    //   ...createWasmAminoConverters(),
    // });
    // const msgsContract = aminoTypes.toAmino(message);
    // const signDocContract = makeSignDocAmino([msgsContract], fee, chainId, memo, accountNumber, sequence);
    ///////////////////////////////////////////

    const signDoc1: StdSignDoc = {
      msgs: [],
      fee: { amount: [], gas: '23' },
      chain_id: chainId,
      memo: 'hello, world',
      account_number: '7',
      sequence: '54',
    };

    const signDoc2: StdSignDoc = {
      chain_id: '',
      account_number: '0',
      sequence: '0',
      fee: {
        gas: '0',
        amount: [],
      },

      msgs: [
        {
          //Type này do Keplr này quy định để phân biệt là signData ADB trong amino
          type: 'sign/MsgSignData',
          value: {
            signer: senderAddress,
            data: btoa('HoangWuangHuy'.toLowerCase()),
          },
        },
      ],
      memo: '',
    };

    //MSG CHUẨN CỦA AMINO
    // const msg = {
    // đây là type chuẩn trong bank thay vì dùng z có thể dùng  typeUrl: '/cosmos.bank.v1beta1.MsgSend', cũng được,
    // cùng lắm thì có thêm thằng /cosmos.staking.v1beta1.MsgDelegate, hoặc custom module thì có thêm message khác trên chain đó
    //   type: "cosmos-sdk/MsgSend",
    //   value: {
    //     amount: [
    //       {
    //         amount: "1234567",
    //         denom: "ucosm",
    //       },
    //     ],
    //     // eslint-disable-next-line @typescript-eslint/naming-convention
    //     from_address: fromAddress,
    //     // eslint-disable-next-line @typescript-eslint/naming-convention
    //     to_address: toAddress,
    //   },
    // };

    const { signature, signed } = await wallet!.signAmino(chainId, senderAddress, signDoc1);
    console.log('🚀 ~ file: page.tsx:180 ~ handleSignAmino ~ signed:', signed);
    console.log('🚀 ~ file: page.tsx:180 ~ handleSignAmino ~ signature:', signature);
  };

  // Sign Amino Cosmos SDK v0.39.x or below, sign signDirect Cosmos SDK new Protobuf encoded SignDoc

  const handleSignDirectInjective = async () => {
    const injectiveAddress = account;
    const restEndpoint = getNetworkEndpoints(
      chainId === ('injective-1' as any) ? Network.Mainnet : Network.Testnet,
    ).rest; /* getNetworkEndpoints(Network.Mainnet).rest */

    const amount = {
      amount: new BigNumberInBase(0.0001).toWei().toFixed(),
      denom: 'inj',
    };

    /** Account Details **/
    const chainRestAuthApi = new ChainRestAuthApi(restEndpoint);
    const accountDetailsResponse = await chainRestAuthApi.fetchAccount(injectiveAddress);
    const baseAccount = BaseAccount.fromRestApi(accountDetailsResponse);
    const accountDetails = baseAccount.toAccountDetails();
    console.log('🚀 ~ file: page.tsx:203 ~ handleSignDirectInjective ~ accountDetails:', accountDetails);

    /** Block Details */
    const chainRestTendermintApi = new ChainRestTendermintApi(restEndpoint);
    const latestBlock = await chainRestTendermintApi.fetchLatestBlock();
    const latestHeight = latestBlock.header.height;
    const timeoutHeight = new BigNumberInBase(latestHeight).plus(DEFAULT_BLOCK_TIMEOUT_HEIGHT);

    /** Preparing the transaction */
    const msg = MsgSend.fromJSON({
      amount,
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
    });

    /** Prepare the Transaction **/
    const { signDoc } = createTransaction({
      pubKey: Buffer.from(pubKey).toString('base64'),
      // pubKey: accountDetails.pubKey.key,
      chainId,
      fee: DEFAULT_STD_FEE,
      message: msg,
      sequence: baseAccount.sequence,
      timeoutHeight: timeoutHeight.toNumber(),
      accountNumber: baseAccount.accountNumber,
    });
    // SIGN DIRECT NHANH

    // const directSignDocx = {
    //   bodyBytes: Buffer.from(
    //     "0a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2a696e6a31307a37637134637867383438726576723075357a617a61356d77666b7a6b75347a6538753571122a696e6a31307a37637134637867383438726576723075357a617a61356d77666b7a6b75347a65387535711a160a03696e6a120f3130303030303030303030303030301896d9f108",
    //     "hex"
    //   ),
    //   accountNumber: "140283",
    //   chainId: "injective-888",
    //   authInfoBytes: Buffer.from(
    //     "0a5e0a540a2d2f696e6a6563746976652e63727970746f2e763162657461312e657468736563703235366b312e5075624b657912230a210293837154efc51fe9c09dbbf3c57f159fdea52ef2502d687f9c4dbba77e83313412040a020801180f121c0a160a03696e6a120f3230303030303030303030303030301080b518",
    //     "hex"
    //   ),
    // };

    // /* Sign the Transaction */

    const directSignResponse = await wallet.signDirect(chainId, account, signDoc);

    const txRaw = getTxRawFromTxRawOrDirectSignResponse(directSignResponse);

    // Send Tx Transaction
    const txHash = await wallet.sendTx(chainId, CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(), 'sync');
    console.log('🚀 ~ file: page.tsx:251 ~ handleSignDirectInjective ~ txHash:', Buffer.from(txHash).toString('hex'));
  };

  // const handleSignDirect = async () => {
  //   // Dùng sendToken là test được hàm này xem code trong file cosmosjs có

  //   const pubkeyX = encodePubkey({
  //     type: 'tendermint/PubKeySecp256k1',
  //     value: toBase64(pubKey),
  //   });

  //   console.log('🚀 ~ file: page.tsx:176 ~ handleSignDirect ~ pubkeyX:', pubkeyX);

  //   // try {
  //   //   const { accountNumber, sequence } = await client?.getAccount(account);
  //   //   console.log('🚀 ~ file: page.tsx:150 ~ handleSignDirect ~ sequence:', sequence);
  //   //   console.log('🚀 ~ file: page.tsx:150 ~ handleSignDirect ~ accountNumber:', accountNumber);
  //   // } catch (error: any) {
  //   //   console.log('🚀 ~ file: page.tsx:114 ~ handleSignDirect ~ error:', error);
  //   // }

  //   // const { accountNumber, sequence, bodyBytes } = {
  //   //   accountNumber: 1,
  //   //   sequence: 1,
  //   //   bodyBytes:
  //   //     '0a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d120731323334353637',
  //   // };

  //   // const value = await (client as any).getSequence(account);
  //   // console.log('🚀 ~ file: page.tsx:138 ~ handleSignDirect ~ value:', value);

  //   const registry = new Registry();

  //   // const defaultTypeUrls = {
  //   //   cosmosCoin: "/cosmos.base.v1beta1.Coin",
  //   //   cosmosMsgSend: "/cosmos.bank.v1beta1.MsgSend",
  //   //   cosmosTxBody: "/cosmos.tx.v1beta1.TxBody",
  //   //   googleAny: "/google.protobuf.Any",
  //   // };

  //   // const txBodyFields: TxBodyEncodeObject = {
  //   //   typeUrl: '/cosmos.tx.v1beta1.TxBody',
  //   //   value: {
  //   //     messages: [
  //   //       {
  //   //         typeUrl: '/cosmos.bank.v1beta1.MsgSend',
  //   //         value: {
  //   //           fromAddress: account,
  //   //           toAddress: account,
  //   //           amount: [
  //   //             {
  //   //               denom: denom,
  //   //               amount: '1',
  //   //             },
  //   //           ],
  //   //         },
  //   //       },
  //   //     ],
  //   //   },
  //   // };

  //   // const txBodyBytes = registry.encode(txBodyFields);

  //   // const pubkey = encodePubkey({
  //   //   type: 'tendermint/PubKeySecp256k1',
  //   //   value: toBase64(pubkeyBytes),
  //   // });

  // /injective.crypto.v1beta1.ethsecp256k1.PubKey

  //   // const fee = coins(200, 'inj');
  //   // const gasLimit = 200000;
  //   // const feeGranter = undefined;
  //   // const feePayer = undefined;

  //   // const signDoc = makeSignDoc(
  //   //   txBodyBytes,
  //   //   makeAuthInfoBytes([{ pubkey, sequence }], fee, gasLimit, feeGranter, feePayer),
  //   //   chainId,
  //   //   accountNumber,
  //   // );

  //   // const messages = {
  //   //   bodyBytes:
  //   //     '3N8NC3Ft3HThdmgiSunc8ZJDxrxxDUSVE2Vue8oj9LSZKPYejGMgPRM189zv4kMvan94tDYuKRMuybEEXtYsshCJZYZ1ycELankv1QbLtEd5zC6Cw1Hebh7g8XaDLkUYXpkLDJBA9Z3ZAY5rN9NpC2ymQgDnZepfsrAzpJ4rMXd2Vkgi7K28yXW',
  //   //   authInfoBytes:
  //   //     'QFn867PURPmazUMVvq9x2YygUZe9zrNW4WUdrppTZRMDNxMu3QWm3jLpNKADT6NdmRuaoDPh5U1hjnXaeRLkRDQv2ScYqFvqsaEh48jJijAWK8pYbKRn3EtAVE568G5U12iRheYv',
  //   //   chainId: chainId,
  //   //   accountNumber: {
  //   //     low: 110199,
  //   //     high: 0,
  //   //     unsigned: false,
  //   //   },
  //   // };
  //   // const { signature, signed } = await wallet.signDirect(chainId, account, messages);
  //   // console.log('🚀 ~ file: page.tsx:179 ~ signDirect ~ signature:', signature);
  // };

  const signArbitrary = async () => {
    const res = await wallet.signArbitrary('injective-1', account, 'hello');
    console.log('🚀 ~ signArbitrary ~ res:', res);
  };

  const handleSendTx = async () => {
    return await wallet.sendTx(chainId, tx, 'sync' as any);
  };

  useEffect(() => {
    if (!window) return;

    // get Wallet
    const walletx = window.ninji;

    setWallet(walletx);
  }, []);
  // Init

  useEffect(() => {
    if (!wallet || !account) return;

    const getInit = async () => {
      const offlineSigner = wallet.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();

      let clientx;
      try {
        //Get Client
        clientx = await SigningCosmWasmClient.connectWithSigner(rpcUrl, offlineSigner as any);
        setClient(clientx);
      } catch (error: any) {
        console.log('error get Client');
      }
    };

    getInit();
  }, [wallet, account]);

  return (
    <div>
      <h1>Test Dapp Cosmos Wallet</h1>

      {!account && (
        <CustomButton
          title="Connect wallet"
          onClick={() => {
            handleConnect();
          }}
        />
      )}

      {account && <div>{account}</div>}

      {account && (
        <div>
          <div>
            <CustomButton
              title="Sign Amino"
              onClick={() => {
                handleSignAmino();
              }}
            />
          </div>

          <div>
            <CustomButton
              title="Sign Direct"
              onClick={() => {
                handleSignDirectInjective();
              }}
            />
          </div>

          <div>
            <CustomButton
              title="SendTx"
              onClick={() => {
                handleSendTx();
              }}
            />
          </div>
          <div>
            <CustomButton
              title="SignAbitrary"
              onClick={() => {
                signArbitrary();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
