import {
  getDefaultConfig, RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react';
import { http } from 'viem';
import { WagmiProvider } from 'wagmi';
import {
  sepolia, // anvil,
} from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';

const BlockchainProvider = ({ children }: { children: React.ReactNode }) => {
  // RainbowKit config
  const config = getDefaultConfig({
    appName: 'TipsJar',
    projectId: 'acefd871415f61f89068d028cf27a085',
    chains: [
      // anvil,
      sepolia,
    ],
    transports: {
      // [anvil.id]: http('http://127.0.0.1:8545'),
      [sepolia.id]: http(),
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
