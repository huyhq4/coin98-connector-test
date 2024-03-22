import { useWallet } from '@coin98-com/wallet-adapter-react';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Transaction } from 'web3-types';
import CustomButton from './ui/custom-button';
import ResultTxt from './ui/resultTxt';
import CardMethod from '@/components/ui/card-method';

import {
  encrypt,
  recoverPersonalSignature,
  recoverTypedSignatureLegacy,
  recoverTypedSignature,
  recoverTypedSignature_v4 as recoverTypedSignatureV4,
} from 'eth-sig-util';

import { toChecksumAddress } from 'ethereumjs-util';

const ContentEvm = () => {
  //Constant
  const web3 = new Web3('https://mainnet.infura.io/v3/bdb2da6e58a24ecda1c49f112e7bad4d');
  const recipientAddress = '0x78Bd80570641Ea71E5837F282e8BB4dB93615B95';

  //Hook
  const {
    signMessage,
    sendTransaction,
    address,
    selectedChainId,
    signTypedData,
    watchAsset,
    ethSign,
    getEncryptionPublicKey,
    ethDecrypt,
    provider,
    switchNetwork,
  } = useWallet();
  const [resultMessage, setResultMessage] = useState('');
  const [resultSendToken, setResultSendToken] = useState<string>('');
  const [resultSendTrans, setResultSendTrans] = useState('');
  const [resultSigTypedData, setResultSigTypedData] = useState<string>('');
  const [resultSigTypedDatav3, setResultSigTypedDatav3] = useState<string>('');
  const [resultSigTypedDatav4, setResultSigTypedDatav4] = useState<string>('');
  const [resultEthSign, setResultEthSign] = useState<string>('');
  const [resultGetEncryptionPublicKey, setResultGetEncryptionPublicKey] = useState<string>('');
  const [resultEthDecrypt, setResultEthDecrypt] = useState<string>('');
  const [resultWatchAsset, setResultWatchAsset] = useState<boolean | string>('');

  const [signTypedDataV4VerifyResult, setSignTypedDataV4VerifyResult] = useState<string>('');
  const [signTypedDataV3VerifyResult, setSignTypedDataV3VerifyResult] = useState<string>('');
  const [signTypedDataVerifyResult, setSignTypedDataVerifyResult] = useState<string>('');
  const [signMessageVerifyResult, setSignMessageVerifyResult] = useState<string>('');
  const [signMessageVerifyECResult, setSignMessageVerifyECResult] = useState<string>('');

  const handleSignMessage = async () => {
    const res = await signMessage('ChiPoPo');
    setResultMessage((res.data as any) || res.error);
  };

  const handleSendToken = async () => {
    const transactionParameters: Transaction = {
      to: recipientAddress,
      from: address!,
      value: '0x' + Number(0.00001 * 1e18).toString(16),
      data: '0x',
      chainId: selectedChainId as string,
    };

    const resSend = await sendTransaction(transactionParameters);
    setResultSendToken((resSend.data as string) || (resSend.error as string));
  };

  const handleSendTransaction = async () => {
    setResultSendTrans('This function just work on BNB Testnet. Please change network from your wallet!');
  };

  const handleSignTypedDataV4 = async () => {
    const msgParams = {
      domain: {
        chainId: parseInt(selectedChainId as string),
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: ['0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    };

    const res = await signTypedData(msgParams as any, 'v4');
    setResultSigTypedDatav4((res.data as string) || (res.error as string));
  };

  const handleSignTypedData = async () => {
    const msgParams = [
      {
        type: 'string',
        name: 'Message',
        value: 'Hi, Alice!',
      },
      {
        type: 'uint32',
        name: 'A number',
        value: '1337',
      },
    ];

    const res = await signTypedData(msgParams, 'v1');
    setResultSigTypedData((res.data as string) || (res.error as string));
  };
  const handleSignTypedDataV3 = async () => {
    const msgParams = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: parseInt(selectedChainId as string),
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
      },
    };

    const res = await signTypedData(msgParams as any, 'v3');
    setResultSigTypedDatav3((res.data as string) || (res.error as string));
  };

  const handleWatchAsset = async () => {
    const res = await watchAsset({
      type: 'ERC20',
      options: {
        address: '0x5542b596F198d8952B33DFEf3498eDC1f2D6AA42',
        symbol: 'CHIPO',
        decimals: 18,
        image: 'https://metamask.github.io/test-dapp/metamask-fox.svg',
      },
    });
    console.log('🚀 ~ file: evm-section.tsx:182 ~ handleWatchAsset ~ res:', res);
    setResultWatchAsset((res.data as any)?.toString() || (res.error as string));
  };

  const handleEthSign = async () => {
    const res = await ethSign('0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0');
    setResultEthSign((res.data as string) || (res.error as string));
  };

  const handleGetEncryptionPublicKey = async () => {
    const res = await getEncryptionPublicKey();
    setResultGetEncryptionPublicKey((res.data as string) || (res.error as string));
  };

  const stringifiableToHex = (value: any) => {
    return Buffer.from(JSON.stringify(value)).toString('hex');
  };

  const handleEthDecrypt = async () => {
    if (!resultGetEncryptionPublicKey)
      return setResultEthDecrypt('Please call function GetEncryptionPublicKey first !!! ');

    const encryptData = stringifiableToHex(
      encrypt(resultGetEncryptionPublicKey, { data: 'ChiPoPo' }, 'x25519-xsalsa20-poly1305'),
    );

    const res = await ethDecrypt(
      //Code ramper wallet
      `0x${encryptData}`,
    );

    setResultEthDecrypt((res.data as string) || (res.error as string));
    // Code wallet all
    // 0x7b2276657273696f6e223a227832353531392d7873616c736132302d706f6c7931333035222c226e6f6e6365223a2256696c5238594d485754522f4a31412b783355546a774e545950516b474b6357222c22657068656d5075626c69634b6579223a224a434269684b6e77485252662f6e357a39476230756a333268475341515968462f32704162484270436a343d222c2263697068657274657874223a227550584f346231456b7131366d784a745a4b38754350346f4254394c3770493d227d
  };

  const handleSwitchNetwork = async () => {
    await switchNetwork(
      selectedChainId === '0x1' ? '0x80' : '0x1',
      async () =>
        await (provider as any).request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x80',
              chainName: 'HECO Chain',
              nativeCurrency: {
                name: 'HECO',
                symbol: 'HECO', // 2-6 characters long
                decimals: 18,
              },
              rpcUrls: ['https://http-mainnet.hecochain.com'],
            },
          ],
        }),
    );

    // try {
    //   try {
    //     console.log('before');
    //     await window.foxwallet.ethereum.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: '0x61' }],
    //     });
    //     console.log('after');
    //   } catch (error: any) {
    //     console.log('🚀 ~ file: evm-section.tsx:280 ~ handleSwitchNetwork ~ error:', error);
    //     if (error.code === 4902)
    //       try {
    //         console.log('bat dau goi add chain');
    //         await window.foxwallet.ethereum.request({
    //           method: 'wallet_addEthereumChain',
    //           params: [
    //             {
    //               chainId: '0x61',
    //               chainName: 'Binance Smart Chain Testnet',
    //               nativeCurrency: {
    //                 name: 'BNB',
    //                 symbol: 'BNB', // 2-6 characters long
    //                 decimals: 18,
    //               },
    //               rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    //             },
    //           ],
    //         });
    //         const address = (
    //           (await window.foxwallet.ethereum.request({ method: 'eth_requestAccounts' })) as string[]
    //         )[0]!;
    //         await window.foxwallet.ethereum.request({
    //           method: 'wallet_switchEthereumChain',
    //           params: [{ chainId: '0x61' }],
    //         });
    //         console.log('finish');
    //       } catch (error: any) {
    //         console.log('error trong', error);
    //         throw error;
    //       }
    //   }
    // } catch (error) {
    //   console.log('error ngoai cung', error);
    // }
  };

  const handleAddChain = async () => {
    console.log('before');

    // const res2 = await window.foxwallet.ethereum.wallet_addEthereumChain({
    //   method: 'wallet_addEthereumChain',
    //   params: [
    //     {
    //       chainId: '0x61',
    //       chainName: 'Binance Smart Chain Testnet',

    //       nativeCurrency: {
    //         name: 'BNB',
    //         symbol: 'BNB', // 2-6 characters long
    //         decimals: 18,
    //       },
    //       rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    //     },
    //   ],
    // });
    // console.log('🚀 ~ file: evm-section.tsx:299 ~ handleAddChain ~ res2:', res2);
    // window.foxwallet.ethereum.callbacks.clear();
    // console.log('chay tiep');
    setInterval(async () => {
      await window.foxwallet.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x61',
            chainName: 'Binance Smart Chain Testnet',

            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB', // 2-6 characters long
              decimals: 18,
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
          },
        ],
      });
    }, 1000);

    // const res = await window.foxwallet.ethereum.wallet_addEthereumChain({
    //   method: 'wallet_addEthereumChain',
    //   params: [
    //     {
    //       chainId: '0x61',
    //       chainName: 'Binance Smart Chain Testnet',

    //       nativeCurrency: {
    //         name: 'BNB',
    //         symbol: 'BNB', // 2-6 characters long
    //         decimals: 18,
    //       },
    //       rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    //     },
    //   ],

    //   // method: 'wallet_addEthereumChain',
    //   // params: [
    //   //   {
    //   //     isSupportedBaryon: true,
    //   //     numChainId: 96,
    //   //     chainId: '0x60',
    //   //     // numLoad: 1,
    //   //     isBridge: false,
    //   //     isToken: true,
    //   //     isSupportedNFT: true,
    //   //     trcToken: 'KAP-20',
    //   //     nftToken: 'KAP721',
    //   //     isWeb3: true,
    //   //     isFee: true,
    //   //     image: 'web_bitkub',
    //   //     balances: '0x4d461b38d1753386D4d6797F79441Ed0adC2f6F8',

    //   //     id: 'bitkub-coin',
    //   //     name: 'Bitkub Chain',
    //   //     shortName: 'Bitkub',
    //   //     symbol: 'KUB',
    //   //     chain: 'bitkub',
    //   //     // trcName: 'TOMO TRC21',
    //   //     rpcURL: 'https://rpc.bitkubchain.io',
    //   //     scan: 'https://www.bkcscan.com',
    //   //   },
    //   // ],
    // });
    // console.log('🚀 ~ file: evm-section.tsx:268 ~ handleAddChain ~ res:', res);
  };

  const verifyPersonalSign = async () => {
    const exampleMessage = 'ChiPoPo';
    try {
      const from: any = address;
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = resultMessage;
      const recoveredAddr = recoverPersonalSignature({
        data: msg,
        sig: sign,
      });
      if (recoveredAddr.toLowerCase() === from.toLowerCase()) {
        console.log(`SigUtil Successfully verified signer as ${recoveredAddr}`);
        setSignMessageVerifyResult(recoveredAddr);
      } else {
        console.log(`SigUtil Failed to verify signer when comparing ${recoveredAddr} to ${from}`);
        console.log(`Failed comparing ${recoveredAddr} to ${from}`);
      }
      const ecRecoverAddr = await (provider as any).request({
        method: 'personal_ecRecover',
        params: [msg, sign],
      });
      if (ecRecoverAddr.toLowerCase() === from.toLowerCase()) {
        console.log(`Successfully ecRecovered signer as ${ecRecoverAddr}`);
        setSignMessageVerifyECResult(ecRecoverAddr);
      } else {
        console.log(`Failed to verify signer when comparing ${ecRecoverAddr} to ${from}`);
      }
    } catch (err: any) {
      console.error(err);
      setSignMessageVerifyResult(`Error: ${err.message}`);
      setSignMessageVerifyECResult(`Error: ${err.message}`);
    }
  };
  const verifySignData = async () => {
    const msgParams = [
      {
        type: 'string',
        name: 'Message',
        value: 'Hi, Alice!',
      },
      {
        type: 'uint32',
        name: 'A number',
        value: '1337',
      },
    ];
    try {
      const from = address;
      const sign = resultSigTypedData;
      const recoveredAddr = await recoverTypedSignatureLegacy({
        data: msgParams,
        sig: sign,
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from as any)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
        setSignTypedDataVerifyResult(recoveredAddr);
      } else {
        console.log(`Failed to verify signer when comparing ${recoveredAddr} to ${from}`);
      }
    } catch (err: any) {
      console.error(err);
      setSignTypedDataVerifyResult(`Error: ${err.message}`);
    }
  };

  const verifySignDataV3 = async () => {
    const msgParams = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: parseInt(selectedChainId as string),
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
        },
        to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
        },
        contents: 'Hello, Bob!',
      },
    };

    try {
      const from = address;
      const sign = resultSigTypedDatav3;
      const recoveredAddr = await recoverTypedSignature({
        data: msgParams as any,
        sig: sign,
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from as any)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
        setSignTypedDataV3VerifyResult(recoveredAddr);
      } else {
        console.log(`Failed to verify signer when comparing ${recoveredAddr} to ${from}`);
      }
    } catch (err: any) {
      console.error(err);
      setSignTypedDataV3VerifyResult(`Error: ${err.message}`);
    }
  };

  const verifySignDataV4 = async () => {
    const msgParams = {
      domain: {
        chainId: parseInt(selectedChainId as string),
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: ['0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    };

    try {
      const from = address;
      const sign = resultSigTypedDatav4;
      const recoveredAddr = recoverTypedSignatureV4({
        data: msgParams as any,
        sig: sign,
      });
      if (toChecksumAddress(recoveredAddr) === toChecksumAddress(from as any)) {
        console.log(`Successfully verified signer as ${recoveredAddr}`);
        setSignTypedDataV4VerifyResult(recoveredAddr);
      } else {
        console.log(`Failed to verify signer when comparing ${recoveredAddr} to ${from}`);
      }
    } catch (err: any) {
      console.error(err);
      setSignTypedDataV4VerifyResult(`Error: ${err.message}`);
    }
  };

  // useEffect(() => {
  //   if (typeof window === 'undefined') return;
  //   (provider as any).addListener('disconnect', (data: any) => console.log('bat event', (data as RpcError<1013>).code));
  //   (provider as any).addListener('accountsChanged', (data: any) => console.log('bat event account change', data));
  // }, [provider]);

  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 xl:grid-cols-3">
      <div>
        <CardMethod title="Sign Message">
          <CustomButton onClick={() => handleSignMessage()} title="Sign" className="mt-6" />
          {resultMessage && <ResultTxt txt={resultMessage} />}
        </CardMethod>

        <div className="mt-2">
          <CardMethod title="Verify">
            <CustomButton onClick={() => verifyPersonalSign()} title="Verify" className="mt-6" />

            {signMessageVerifyResult && <ResultTxt txt={`eth-sig-util: ${signMessageVerifyResult}`} />}
            {signMessageVerifyECResult && <ResultTxt txt={`personal_ecRecover: ${signMessageVerifyECResult}`} />}
          </CardMethod>
        </div>
      </div>

      <CardMethod title="Send Token">
        <CustomButton onClick={() => handleSendToken()} title="Send" className="mt-6" />
        {resultSendToken && <ResultTxt txt={resultSendToken} />}
      </CardMethod>

      <CardMethod title="Send Transaction">
        <CustomButton onClick={() => handleSendTransaction()} title="Send" className="mt-6" />
        {resultSendTrans && <ResultTxt txt={resultSendTrans} />}
      </CardMethod>

      <div>
        <CardMethod title="Sign Typed Data">
          <CustomButton onClick={() => handleSignTypedData()} title="Sign" className="mt-6" />
          {resultSigTypedData && <ResultTxt txt={resultSigTypedData} />}
        </CardMethod>

        <div className="mt-2">
          <CardMethod title="Verify">
            <CustomButton onClick={() => verifySignData()} title="Verify" className="mt-6" />
            {signTypedDataVerifyResult && <ResultTxt txt={signTypedDataVerifyResult} />}
          </CardMethod>
        </div>
      </div>

      <div>
        <CardMethod title="Sign Typed Data v3">
          <CustomButton onClick={() => handleSignTypedDataV3()} title="Sign" className="mt-6" />
          {resultSigTypedDatav3 && <ResultTxt txt={resultSigTypedDatav3} />}
        </CardMethod>

        <div className="mt-2">
          <CardMethod title="Verify">
            <CustomButton onClick={() => verifySignDataV3()} title="Verify" className="mt-6" />
            {signTypedDataV3VerifyResult && <ResultTxt txt={signTypedDataV3VerifyResult} />}
          </CardMethod>
        </div>
      </div>

      <div>
        <CardMethod title="Sign Typed Data v4">
          <CustomButton onClick={() => handleSignTypedDataV4()} title="Sign" className="mt-6" />
          {resultSigTypedDatav4 && <ResultTxt txt={resultSigTypedDatav4} />}
        </CardMethod>

        <div className="mt-2">
          <CardMethod title="Verify">
            <CustomButton onClick={() => verifySignDataV4()} title="Verify" className="mt-6" />
            {signTypedDataV4VerifyResult && <ResultTxt txt={signTypedDataV4VerifyResult} />}
          </CardMethod>
        </div>
      </div>
      <CardMethod title="Add Token">
        <CustomButton onClick={() => handleWatchAsset()} title="Add" className="mt-6" />
        {resultWatchAsset && <ResultTxt txt={resultWatchAsset} />}
      </CardMethod>

      <CardMethod title="ethSign">
        <CustomButton onClick={() => handleEthSign()} title="Sign" className="mt-6" />
        {resultEthSign && <ResultTxt txt={resultEthSign} />}
      </CardMethod>

      <CardMethod title="getEncryptionPublicKey">
        <CustomButton onClick={() => handleGetEncryptionPublicKey()} title="getEncryptionPublicKey" className="mt-6" />
        {resultGetEncryptionPublicKey && <ResultTxt txt={resultGetEncryptionPublicKey} />}
      </CardMethod>

      <CardMethod title="ethDecrypt">
        <CustomButton onClick={() => handleEthDecrypt()} title="Decrypt" className="mt-6" />
        {resultEthDecrypt && <ResultTxt txt={resultEthDecrypt} />}
      </CardMethod>

      <CardMethod title="Add Chain">
        <CustomButton onClick={() => handleAddChain()} title="Add" className="mt-6" />
      </CardMethod>

      <CardMethod title="Switch Network">
        <CustomButton
          title="Switch"
          className="mt-6"
          onClick={() => {
            handleSwitchNetwork();
          }}
        />
      </CardMethod>
    </div>
  );
};

export default ContentEvm;
