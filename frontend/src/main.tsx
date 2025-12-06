import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';
import BlockchainProvider from './providers/BlockchainProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BlockchainProvider>
      <App />
    </BlockchainProvider>
  </React.StrictMode>
);
