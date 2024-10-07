import { useAccount } from 'wagmi';
import { Account } from './Account';
import { WalletOptions } from './WalletOptions';

export function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected)
    return (
      <div className="wallet-wrap">
        <div className="wallet-wrap-header">
          Wallet
        </div>
        <div>
          <Account />
        </div>
      </div>
    )

  return (
    <div className="wallet-wrap">
      <div className="wallet-wrap-header">
        Wallet
      </div>
      <div>
        <WalletOptions />
      </div>
    </div>
  )
}
