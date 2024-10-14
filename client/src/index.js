import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './output.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { wagmiConfig } from './wagmiConfig.js';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { WagmiProvider, createConfig, http, testnet, configureChains } from "wagmi";
import { mainnet, localhost } from "wagmi/chains";

import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
