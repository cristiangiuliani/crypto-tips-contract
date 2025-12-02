import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { http, defineChain } from 'viem';
import { WagmiProvider } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';

const BlockchainProvider = ({ children }: { children: React.ReactNode }) => {
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
      default: {
        name: 'Anvil',
        url: 'http://localhost:8545',
      },
    },
    testnet: true,
  });

  // RainbowKit config
  const config = getDefaultConfig({
    appName: 'TipsJar',
    projectId: 'acefd871415f61f89068d028cf27a085',
    chains: [anvil],
    transports: {
      [anvil.id]: http(),
    },
  });

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default BlockchainProvider;
