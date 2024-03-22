import { encode } from '@/lib/utils';
import { useWallet } from '@coin98-com/wallet-adapter-react';
import bs58 from 'bs58';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction as TransactionSolana,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { useEffect, useState } from 'react';
import CardMethod from './ui/card-method';
import CustomButton from './ui/custom-button';
import ResultTxt from './ui/resultTxt';

const ContentSolana = () => {
  //Constant
  const connection = new Connection(
    'https://rough-white-cloud.solana-mainnet.discover.quiknode.pro/917d316c92433f9d91a7c0c16299df93e2883054/',
  );
  const lamports = 0.001;
  let recipientAddress = '41J69vTXwFyjzBHahVhzN32Fty77DXDCa7EG8maTyYGy';

  // Hook
  const { signMessage, sendTransaction, signTransaction, publicKey, address } = useWallet();
  const [resultMessage, setResultMessage] = useState('');
  const [resultSend, setResultSend] = useState('');
  const [resultSendTrans, setResultSendTrans] = useState('');
  const [resultSendVerTrans, setResultSendVerTrans] = useState('');
  const [resultSignTrans, setResultSignTrans] = useState('');

  const handleSignMessage = async () => {
    try {
      const response = await signMessage?.(new TextEncoder().encode('ChiPoPo'));

      setResultMessage(Buffer.from(response.data as any).toString('hex'));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignTransaction = async () => {
    try {
      let hash = await connection.getRecentBlockhash();

      const transaction = new TransactionSolana({
        feePayer: publicKey,
        recentBlockhash: hash.blockhash,
      }).add(
        new TransactionInstruction({
          data: Buffer.from('Hello, from the Coin98 Wallet Adapter example app!'),
          keys: [],
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        }),
      );

      const resSig = await signTransaction?.(transaction);
      console.log('verifySignatures', resSig?.verifySignatures());
      setResultSignTrans(encode(transaction.signature as any));
    } catch (error) {
      console.log('error sigTransaction', error);
    }
  };

  const handleSendToken = async () => {
    const kp = Keypair.fromSecretKey(
      bs58.decode('37UL1qZ3yJBBpxErzUYVwXRMaL7JayBWYxpRZZPXiiBCQSGpykiaVyisw7tuKrjBc5GyP8MY852B52vyQDTLpkZE'),
    );

    try {
      if (!publicKey) throw new Error();

      let lamportsI = LAMPORTS_PER_SOL * lamports;

      let hash = await connection.getRecentBlockhash();

      const transaction = new TransactionSolana({
        feePayer: publicKey,
        recentBlockhash: hash.blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: lamportsI,
        }),
      );

      const resSend = await sendTransaction(transaction, connection, {
        preflightCommitment: 'finalized',
        skipPreflight: false,
        signers: [{ publicKey: kp.publicKey, secretKey: kp.secretKey }],
      });

      setResultSend((resSend.data as string) || (resSend.error as string));
    } catch (error) {
      console.log('error sendToken', error);
    }
  };

  const handleSendTokenVersionTransaction = async () => {
    let lamportsI = LAMPORTS_PER_SOL * lamports;

    let hash = await connection.getRecentBlockhash();
    const instructions = [
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: new PublicKey(recipientAddress),
        lamports: lamportsI,
      }),
    ];

    // create v0 compatible message
    const messageV0 = new TransactionMessage({
      payerKey: publicKey!,
      recentBlockhash: hash.blockhash,
      instructions,
    }).compileToV0Message();

    // make a versioned transaction
    const transactionV0 = new VersionedTransaction(messageV0);

    // const response = await window.coin98.sol.request({
    //   method: 'sol_sign',
    //   params: [transactionV0],
    // });
    // console.log('🚀 ~ handleSendTokenVersionTransaction ~ response:', response);

    // const publicKeyX = new PublicKey(response.publicKey);
    // const signature = bs58.decode(response.signature);
    // transactionV0.addSignature(publicKeyX, signature);

    // const rawTransaction = transactionV0.serialize();
    // const res = await connection.sendRawTransaction(rawTransaction, {
    //   preflightCommitment: 'finalized',
    //   skipPreflight: false,
    // });
    // console.log('🚀 ~ handleSendTokenVersionTransaction ~ response:', res);
    const resSend = await sendTransaction(transactionV0, connection, {
      preflightCommitment: 'confirmed',
      skipPreflight: false,
      signers: [],
    });

    setResultSendVerTrans((resSend.data as string) || (resSend.error as string));
  };

  const handleSendTransaction = async () => {
    try {
      let hash = await connection.getRecentBlockhash();

      const transaction = new TransactionSolana({
        feePayer: publicKey,
        recentBlockhash: hash.blockhash,
      }).add(
        new TransactionInstruction({
          data: Buffer.from('Hello, from the Coin98 Wallet Adapter example app!'),
          keys: [],
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        }),
      );

      const resSend = await sendTransaction(transaction, connection);
      setResultSendTrans((resSend.data as string) || (resSend.error as string));
    } catch (error) {
      console.log('error sendTransaction', error);
    }
  };

  const handleSendTransactionSol = async () => {
    let lamportsI = LAMPORTS_PER_SOL * lamports;

    let hash = await connection.getRecentBlockhash();

    const transaction = new TransactionSolana({
      feePayer: publicKey,
      recentBlockhash: hash.blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: new PublicKey(recipientAddress),
        lamports: lamportsI,
      }),
    );

    window.bybitWallet.solana
      .signTransaction(transaction)
      .then((signature: any) => {
        console.log('Transaction sent: ', signature);
      })
      .catch((err: any) => {
        console.log('Failed to sign and send transaction: ', err);
      });

    //================== VERSION TRANSACTION ==================//

    // let lamportsI = LAMPORTS_PER_SOL * lamports;

    // let hash = await connection.getRecentBlockhash();
    // const instructions = [
    //   SystemProgram.transfer({
    //     fromPubkey: publicKey!,
    //     toPubkey: new PublicKey(recipientAddress),
    //     lamports: lamportsI,
    //   }),
    // ];

    // // create v0 compatible message
    // const messageV0 = new TransactionMessage({
    //   payerKey: publicKey!,
    //   recentBlockhash: hash.blockhash,
    //   instructions,
    // }).compileToV0Message();

    // // make a versioned transaction
    // const transactionV0 = new VersionedTransaction(messageV0);

    // window.bybitWallet.solana
    //   .signTransaction(transactionV0)
    //   .then((signature: any) => {
    //     console.log('Transaction sent: ', signature);
    //   })
    //   .catch((err: any) => {
    //     console.log('Failed to sign and send transaction: ', err);
    //   });
  };

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
      <CardMethod title="Sign Message">
        <CustomButton onClick={() => handleSignMessage()} title="Sign" className="mt-6" />
        {resultMessage && <ResultTxt txt={resultMessage} />}
      </CardMethod>

      <CardMethod title="Send Token">
        <CustomButton onClick={() => handleSendToken()} title="Send" className="mt-6" />
        {resultSend && <ResultTxt txt={resultSend} />}
      </CardMethod>

      <CardMethod title="Send Version Transaction">
        <CustomButton onClick={() => handleSendTokenVersionTransaction()} title="Send" className="mt-6" />
        {resultSendVerTrans && <ResultTxt txt={resultSendVerTrans} />}
      </CardMethod>

      <CardMethod title="Send Transaction">
        <CustomButton onClick={() => handleSendTransaction()} title="Send" className="mt-6" />
        {resultSendTrans && <ResultTxt txt={resultSendTrans} />}
      </CardMethod>

      <CardMethod title="Sign Transaction">
        <CustomButton onClick={() => handleSignTransaction()} title="Sign" className="mt-6" />
        {resultSignTrans && <ResultTxt txt={resultSignTrans} />}
      </CardMethod>

      <CardMethod title="Send Token Bybit">
        <CustomButton onClick={() => handleSendTransactionSol()} title="Send" className="mt-6" />
        {resultSignTrans && <ResultTxt txt={resultSignTrans} />}
      </CardMethod>
    </div>
  );
};

export default ContentSolana;
