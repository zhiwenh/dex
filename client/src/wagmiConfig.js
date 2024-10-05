import { WagmiProvider, createConfig, http, testnet, configureChains } from "wagmi";
import { mainnet, localhost } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const wagmiConfig = createConfig({
  chains: [localhost],
  transports: {
    [localhost.id]: http('http://localhost:8545')
  }
});
