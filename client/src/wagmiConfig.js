import { WagmiProvider, createConfig, http, testnet, configureChains } from "wagmi";
import { mainnet, localhost } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {  metaMask, walletConnect } from 'wagmi/connectors'
import config from './config.json';

const projectId = config.WALLETCONNECT_PROJECT_ID;
console.log('config', config);

console.log('projectId', projectId);
export const wagmiConfig = createConfig({
  chains: [localhost],
  transports: {
    [localhost.id]: http('http://localhost:8545')
  },
  connectors: [
    walletConnect( { projectId } )
  ]
});
