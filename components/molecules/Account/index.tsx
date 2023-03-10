import React, { useEffect } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import Button from "components/atoms/Button";
import { injected } from "connectors";
import { CHAINS, DEFAULT_CHAIN_ID } from "../../../constants";

const Account = () => {
  const { account, activate, library, deactivate, chainId } = useWeb3React();

  useEffect(() => {
    if (chainId && chainId !== DEFAULT_CHAIN_ID) {
      (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    }
  }, [chainId]);

  return (
    <>
      {account ? (
        <Button
          type='SECONDARY'
          className='flex items-center gap-2'
          onClick={deactivate}
        >
          {CHAINS[chainId] ? (
            <>
              <div className='w-2 h-3 relative'>
                <Image src='/icons/ethereum.svg' layout='fill' alt='VolumFi' />
              </div>
              Goerli
              <div className='w-2 h-2 rounded-full bg-primary bg-opacity-50 p-0.5'>
                <div className='w-full h-full rounded-full bg-primary' />
              </div>
            </>
          ) : (
            <>
              Unsupported network
              <div className='w-2 h-2 rounded-full  bg-red-500 bg-opacity-50 p-0.5'>
                <div className='w-full h-full rounded-full bg-red-500' />
              </div>
            </>
          )}
          {account.slice(0, 6)}...{account.slice(-4)}
        </Button>
      ) : (
        <Button type='PRIMARY' onClick={() => activate(injected)}>
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default Account;
