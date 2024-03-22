'use client';

import { chains, Ethereum, Polygon } from '@particle-network/chains';

import { ParticleNetwork, UIMode, WalletEntryPosition } from '@particle-network/auth';
import CustomButton from '@/components/ui/custom-button';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ParticlePage = () => {
  const [address, setAddress] = useState<string>();
  const [isConnected, setIsConnected] = useState<boolean>();
  const [networkId, setNetworkId] = useState<number>(1);
  const [theme, setTheme] = useState<UIMode>('dark');

  const particle = useMemo(
    () =>
      new ParticleNetwork({
        projectId: '2f5ff441-92e1-48dc-8bac-aa3ce1861e94',
        clientKey: 'cTp4TGIZFZ8TGTteYJmVtFUXxRaTgbdj9bI0kyXP',
        appId: '7cc1ed23-468a-42a9-83e8-d1bdcf11e68b',
        chainName: Ethereum.name, //optional: current chain name, default Ethereum.
        chainId: Ethereum.id, //optional: current chain id, default 1.
        wallet: {
          //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
          displayWalletEntry: true, //show wallet entry when connect particle.
          defaultWalletEntryPosition: WalletEntryPosition.BR, //wallet entry position
          uiMode: theme, //optional: light or dark, if not set, the default is the same as web auth.
          // supportChains: [
          //   { id: 1, name: 'Ethereum' },
          //   { id: 5, name: 'Ethereum' },
          // ], // optional: web wallet support chains.
          customStyle: {}, //optional: custom wallet style
        },
        securityAccount: {
          //optional: particle security account config
          //prompt set payment password. 0: None, 1: Once(default), 2: Always
          promptSettingWhenSign: 1,
          //prompt set master password. 0: None(default), 1: Once, 2: Always
          promptMasterPasswordSettingWhenLogin: 1,
        },
      }),
    [theme],
  );

  const handleConnect = async () => {
    try {
      // Request user login if needed, returns current user info
      const res = await particle.auth.login();
      console.log('🚀 ~ handleConnect ~ res:', res);

      const account = await particle.evm.getAddress();
      setAddress(account);
      setIsConnected(true);
    } catch (error) {
      console.log('🚀 ~ file: page.tsx:52 ~ handleConnect ~ error:', error);
    }
  };

  const handleDisconnect = async () => {
    await particle.auth.logout().then(() => {
      console.log('logout success');
      setIsConnected(false);
    });
  };

  const handleChangeMode = () => {
    particle.setAuthTheme({
      uiMode: 'light',
      displayCloseButton: true,
      displayWallet: true, // display wallet entrance when send transaction.
      modalBorderRadius: 10, // auth & wallet modal border radius. default 10.
    });

    // setTheme(theme => (theme === 'dark' ? 'light' : 'dark'));
  };
  const handleSignMessage = async () => {
    const msg = 'Hello Particle Network!';
    const result = await particle.evm.personalSign(`0x${Buffer.from(msg).toString('hex')}`);
    console.log('🚀 ~ file: page.tsx:65 ~ handleSignMessage ~ result:', result);
  };

  const handleSwitchNetwork = async () => {
    const name = networkId === 1 ? Polygon.name : Ethereum.name;

    const id = networkId === 1 ? Polygon.id : Ethereum.id;
    console.log('🚀 ~ handleSwitchNetwork ~ id:', id);
    console.log('🚀 ~ handleSwitchNetwork ~ name:', name);
    const res = await particle.switchChain({
      name,
      id,
    });

    setNetworkId(id);
    console.log('🚀 ~ handleSwitchNetwork ~ res:', res);
  };
  // const handleSendToken = async () => {
  //   const transactionParameters = {
  //     to: '0x69Ac440505459ecB93bc3E6BCdFb5c5e0F3fE197',
  //     from: '0x78Bd80570641Ea71E5837F282e8BB4dB93615B95',
  //     value: '0x' + Number(0.00001 * 1e18).toString(16),
  //     data: '0x',
  //     chainId: '0x38',
  //   };

  //   const wallet = window.ramper2.provider!;

  //   try {
  //     const res = await wallet.request({
  //       method: 'eth_sendTransaction',
  //       params: [transactionParameters],
  //     });
  //     console.log('🚀 ~ file: page.tsx:75 ~ handleSendToken ~ res:', res);
  //   } catch (error: any) {
  //     console.log('🚀 ~ file: page.tsx:78 ~ handleSendToken ~ error:', error);
  //   }
  // };

  const changeChain = useCallback((data: any) => {
    console.log('particle chainChanged', data);
  }, []);
  const changeDisconnect = useCallback((data: any) => {
    console.log('particle disconnected', data);
  }, []);
  const changeConnect = useCallback((userInfo: any) => {
    console.log('particle userInfo', userInfo);
  }, []);

  useEffect(() => {
    if (!particle || !window) return;
    const handleConnected = async () => {
      try {
        const status = particle.auth.isLogin();
        if (status) {
          setIsConnected(true);
          const account = await particle.evm.getAddress();
          setAddress(account);
        }
      } catch (error: any) {
        console.log('🚀 ~ handleIsConnected ~ error:', error);
      }
    };
    handleConnected();
    particle.auth.on('chainChanged', data => {
      console.log('chainChanged', data);
    });

    particle.auth.on('connect', changeConnect);

    particle.auth.on('disconnect', changeDisconnect);

    window.addEventListener('message', event => {
      if (event.data === 'PARTICLE_WALLET_CLOSE_IFRAME') {
        //close click event
      }
    });

    () => {
      particle.auth.off('chainChanged', changeChain);

      particle.auth.off('connect', changeConnect);

      particle.auth.off('disconnect', changeDisconnect);
    };
  }, []);

  return (
    <div>
      <h1>Particle Page</h1>

      {!isConnected && (
        <div>
          <CustomButton onClick={handleConnect} title="Connect Wallet" />
        </div>
      )}

      {isConnected && (
        <>
          <div>Address: {address}</div>
          <div>
            <CustomButton onClick={handleDisconnect} title="Disconnect Wallet" />
          </div>
          <div className="mt-4">
            <CustomButton onClick={handleSignMessage} title="SignMessage" />
          </div>
          <div className="mt-4">
            <CustomButton onClick={handleSwitchNetwork} title="Switch Network" />
          </div>
          <div className="mt-4">
            <CustomButton onClick={handleChangeMode} title="Switch Light" />
          </div>

          {/* <div className="mt-4">
            <CustomButton onClick={handleSendToken} title="sendToken" />
          </div> */}
        </>
      )}
    </div>
  );
};

export default ParticlePage;
