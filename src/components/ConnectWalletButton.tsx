import React from 'react'
import { Button, ConnectorNames, connectorLocalStorageKey, walletLocalStorageKey } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'

const ConnectWalletButton = (props) => {
  const { login } = useAuth()

  const connectWallet = () => {
      login(ConnectorNames.Injected);
      window.localStorage.setItem(walletLocalStorageKey, "Metamask");
      window.localStorage.setItem(connectorLocalStorageKey, ConnectorNames.Injected);
  }
  return (
    <Button onClick={ connectWallet } {...props}>
        Connect
    </Button>
  )
}

export default ConnectWalletButton
