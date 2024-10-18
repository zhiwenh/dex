import { useAccount } from 'wagmi';
import { Account } from './Account';
import { WalletOptions } from './WalletOptions';

export function ConnectWallet({ getTrades }) {
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
          />
        </div>
      </div>
    )

  return (
    <div className="wallet-wrap">
      <div className="wallet-wrap-header">
        Connect Wallet
      </div>
      <div>
        <WalletOptions
          getTrades={getTrades}
        />
      </div>
    </div>
  )
}
