import * as React from 'react'
import { Connector, useConnect } from 'wagmi'

export function WalletOptions({ getTrades }) {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <button class="border rounded p-1" key={connector.uid} onClick={() => {
      connect({ connector })
      getTrades();
    }}>
      {connector.name}
    </button>
  ))
}
