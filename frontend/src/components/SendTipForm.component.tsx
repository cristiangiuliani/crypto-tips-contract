import {
  Box, Button, Card, CardContent, CardHeader, Divider, TextField, Typography, Stack,
  Alert,
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
    <Card
      variant="outlined"
      sx={{
        background: 'linear-gradient(to bottom, #08339c, #051f60)',
      }}
    >
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

            <Box>
              <Button
                variant="contained"
                type="submit"
                disabled={receipt?.isPending || receipt?.isConfirming || !isConnected}
                sx={{
                  background: '#194ac6',
                  width: '100%',
                  color: 'white',
                  '&:hover': { background: '#4965cf' },
                }}
              >
                {receipt?.isPending && 'Preparing...'}
                {receipt?.isConfirming && 'Confirming...'}
                {!receipt?.isPending && !receipt?.isConfirming && 'Send Tip'}
              </Button>
              {receipt?.hash && (
                <Alert severity="info">
                  Transaction Hash: {receipt?.hash.slice(0, 10) }...{receipt?.hash.slice(-8)}
                </Alert>
              )}

              {receipt?.isSuccess && (
                <Alert variant="filled" severity="success" sx={{ color: 'white' }}>
                  Tip sent successfully!
                </Alert>
              )}

              {receipt?.error && (
                <Alert variant="filled" severity="error" sx={{ color: 'white' }}>
                  Error: {receipt.error.message}
                </Alert>
              )}
            </Box>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendTipFormComponent;
