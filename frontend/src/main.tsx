import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { http, defineChain } from 'viem';
import { WagmiProvider } from 'wagmi';

import App from './App';
import '@rainbow-me/rainbowkit/styles.css';

// Define Anvil as a custom chain
const anvil = defineChain({
  id: 31337, // Anvil chain ID
  name: 'Anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'Anvil', url: 'http://localhost:8545' },
  },
  testnet: true,
});

// RainbowKit config
const config = getDefaultConfig({
  appName: 'TipsJar',
  projectId: 'acefd871415f61f89068d028cf27a085', // Get from https://cloud.walletconnect.com
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
