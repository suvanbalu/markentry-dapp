import React, { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { Provider } from '../utils/provider';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError
} from '@web3-react/injected-connector';
import { useEagerConnect, useInactiveListener } from '../utils/hooks';
import { injected } from '../utils/connectors';
import { ethers } from 'ethers';    
import '../index.css';

type ActivateFunction = (
    connector: AbstractConnector,
    onError?: (error: Error) => void,
    throwErrors?: boolean
  ) => Promise<void>;

type CleanupFunction = (() => void) | undefined;

export function Home():ReactElement{
    return(
        <div>
          <NavBar />
            <div>
                <h2> Add Marks</h2>
            </div>
        </div>
    )
}
function getErrorMessage(error: Error): string {
    let errorMessage: string;
  
    switch (error.constructor) {
      case NoEthereumProviderError:
        errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension.`;
        break;
      case UnsupportedChainIdError:
        errorMessage = `You're connected to an unsupported network.`;
        break;
      case UserRejectedRequestError:
        errorMessage = `Please authorize this website to access your Ethereum account.`;
        break;
      default:
        errorMessage = error.message;
    }
  
    return errorMessage;
  }

const NavBar = (): ReactElement => {
    const context = useWeb3React<Provider>();
    const { library, chainId, account, error, deactivate, activate, active } =
      context;
  
    const [balance, setBalance] = useState<ethers.BigNumber>();
  
    useEffect((): CleanupFunction => {
      if (typeof account === 'undefined' || account === null || !library) {
        return;
      }
  
      let stale = false;
  
      async function getBalance(
        library: Provider,
        account: string
      ): Promise<void> {
        const balance: ethers.BigNumber = await library.getBalance(account);
  
        try {
          if (!stale) {
            setBalance(balance);
          }
        } catch (error: any) {
          if (!stale) {
            setBalance(undefined);
  
            window.alert(
              'Error!' + (error && error.message ? `\n\n${error.message}` : '')
            );
          }
        }
      }
  
      getBalance(library, account);
  
      // create a named balancer handler function to fetch the balance each block. in the
      // cleanup function use the fucntion name to remove the listener
      const getBalanceHandler = (): void => {
        getBalance(library, account);
      };
  
      library.on('block', getBalanceHandler);
  
      // cleanup function
      return (): void => {
        stale = true;
        library.removeListener('block', getBalanceHandler);
        setBalance(undefined);
      };
    }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds
  
    const handleConnect = (event: MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
  
      async function _activate(activate: ActivateFunction): Promise<void> {
        await activate(injected);
      }
  
      _activate(activate);
    };
  
    const handleDisconnect = (event: MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
  
      deactivate();
    };
  
    const eagerConnectionSuccessful = useEagerConnect();
    useInactiveListener(!eagerConnectionSuccessful);
  
    if (!!error) {
      window.alert(getErrorMessage(error));
    }
  
    return (
      <div style={{ borderBottom: "1px solid #E2E8F0", background: "linear-gradient(to left, #2D3748, #4A5568)", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", paddingTop: "1rem", paddingBottom: "1rem", paddingLeft: "2rem", paddingRight: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{}}>
          <h1 style={{ color: "#E2E8F0", fontSize: "1.5rem", fontWeight: "bold" }}>
            Students Mark Entry
          </h1>
        </div>
        <div style={{}}>
          {!active ? (
            <button
              onClick={(e) => handleConnect(e)}
              style={{ color: "green", fontSize: "1.5rem", fontWeight: "bold", padding: "0.5rem 1rem", borderColor: "#E2E8F0", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", borderRadius: "9999px" }}
            >
              Connect
            </button>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{}}>
                <div style={{ color: "white", fontSize: "1.25rem", fontWeight: "bold" }}>
                  {balance === null ? "Error" : balance ? (Math.round(+ethers.utils.formatEther(balance) * 1e4) / 1e4) : ""}<span style={{ fontSize: "0.75rem", color: "#CBD5E0" }}>ETH</span>
                </div>
                <div style={{ color: "#CBD5E0", fontSize: "0.875rem" }}>Balance</div>
              </div>
      
              <button
                onClick={(e) => handleDisconnect(e)}
                style={{ color: "red", fontSize: "1.5rem", fontWeight: "bold", borderColor: "#E2E8F0", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    );
    
    
  };