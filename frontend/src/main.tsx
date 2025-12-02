import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';
import BlockchainProvider from './providers/BlockchainProvider';
import '@rainbow-me/rainbowkit/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BlockchainProvider>
      <App />
    </BlockchainProvider>
  </React.StrictMode>
);
