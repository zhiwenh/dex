import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })

  return (
    <div>
      <div>
        Account Address:
      </div>
      <div class="account-address">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      </div>
      <button class="border rounded p-1" onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}
