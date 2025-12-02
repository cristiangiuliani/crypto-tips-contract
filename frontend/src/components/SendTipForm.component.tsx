import {
  Box, Button, Card, CardContent, CardHeader, Divider, TextField, Typography, Stack,
} from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';
import { useAccount } from 'wagmi';

import NumberFieldComponent from './NumberField.component';

interface ISendTipFormComponentProps {
  receipt?: {
    isSuccess: boolean;
    isPending: boolean;
    isConfirming: boolean;
    error: Error | null;
    hash?: string;
  };
  sendTransaction?: (amount: number, message: string, isConnected: boolean, callback: () => void) => void;
}

const SendTipFormComponent = ({
  receipt, sendTransaction,
}: ISendTipFormComponentProps) => {
  const { isConnected } = useAccount();
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(0.01);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendTransaction && sendTransaction(amount, message, isConnected, () => {
      setMessage('');
      setAmount(0.01);
    });
  };

  return (
    <Card variant="outlined">
      <CardHeader
        title="Send a Tip"
      />
      <CardContent>

        {!isConnected &&  <Typography>Please connect your wallet to send a tip</Typography> }
        <Box justifyContent="center" alignItems="center"><ConnectButton /></Box>
        <Divider sx={{ my: 2 }} />
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} mb={2}>
            <NumberFieldComponent
              disabled={!isConnected}
              required
              id="amount"
              label="Amount (ETH)"
              min={0.001}
              step={0.001}
              size="small"
              value={amount}
              onValueChange={(value: number | null) => setAmount(value ?? 0.01)}
            />

            <TextField
              disabled={!isConnected}
              id="outlined-multiline-static"
              label={`Message (${message.length}/280 chars)`}
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message..."
            />

            <Button variant="contained" type="submit" disabled={receipt?.isPending || receipt?.isConfirming}>
              {receipt?.isPending && 'Preparing...'}
              {receipt?.isConfirming && 'Confirming...'}
              {!receipt?.isPending && !receipt?.isConfirming && 'Send Tip 💎'}
            </Button>

            {receipt?.hash && (
              <div className="tx-status">
                Transaction Hash: {receipt?.hash.slice(0, 10) }...{receipt?.hash.slice(-8)}
              </div>
            )}

            {receipt?.isSuccess && (
              <div className="success-message">
                ✅ Tip sent successfully!
              </div>
            )}

            {receipt?.error && (
              <div className="error-message">
                ❌ Error: {receipt.error.message}
              </div>
            )}
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendTipFormComponent;
