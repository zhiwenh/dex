import { useAccount } from 'wagmi';
import { Account } from './Account';
import { WalletOptions } from './WalletOptions';

export function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected)
    return (
      <div class="wallet-wrap">
        <Account />
      </div>
    )

  return (
    <div class="wallet-wrap">
      <WalletOptions />
    </div>
  )
}
