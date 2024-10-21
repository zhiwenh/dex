import { useAccount } from 'wagmi';
import { Account } from './Account';
import { WalletOptions } from './WalletOptions';

export function ConnectWallet({
  getTrades,
  setSavedTokensToTokensTrades,
  setSavedTokensToEthTrades,
  setSavedEthToTokensTrades,
  close
}) {
  const { isConnected } = useAccount()
  if (isConnected)
    return (
      <div className="wallet-wrap">
        <div className="wallet-wrap-header">
          Wallet Connected
        </div>
        <div>
          <Account
            getTrades={getTrades}
            setSavedTokensToTokensTrades={setSavedTokensToTokensTrades}
            setSavedTokensToEthTrades={setSavedTokensToEthTrades}
            setSavedEthToTokensTrades={setSavedEthToTokensTrades}
          />
        </div>
        <button className="connect-wallet-close-button" onClick={() => close()}>Close</button>
      </div>
    )

  return (
    <div className="wallet-wrap">
      <div className="wallet-wrap-header">
        Connect Wallet
      </div>
      <div className="wallet-connectors-wrap">
        <WalletOptions
          getTrades={getTrades}
        />
      </div>
      <button className="connect-wallet-close-button" onClick={() => close()}>Close</button>
    </div>
  )
}
