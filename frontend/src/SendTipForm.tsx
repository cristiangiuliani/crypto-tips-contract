import React, { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import {
  useWriteContract, useAccount, useWaitForTransactionReceipt,
} from 'wagmi';

import { TIP_JAR_CONFIG } from './config';

const SendTipForm = () => {
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('0.01');

  const { isConnected } = useAccount();
  const {
    data: hash, writeContract, isPending, error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      writeContract({
        ...TIP_JAR_CONFIG,
        functionName: 'sendTip',
        args: [message],
        value: parseEther(amount),
      });
    } catch (err) {
      console.error('Error sending tip:', err);
    }
  };

  // Reset form after successful transaction
  useEffect(() => {
    if (isSuccess) {
      setMessage('');
      setAmount('0.01');
    }
  }, [isSuccess]);

  return (
    <div className="send-tip-form">
      <h2>Send a Tip</h2>

      {!isConnected ? (
        <p>Please connect your wallet to send a tip</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount (ETH)</label>
            <input
              id="amount"
              type="number"
              step="0.001"
              min="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message (max 280 chars)</label>
            <textarea
              id="message"
              maxLength={280}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message..."
              rows={4}
              required
            />
            <small>{message.length}/280</small>
          </div>

          <button
            type="submit"
            disabled={isPending || isConfirming}
          >
            {isPending && 'Preparing...'}
            {isConfirming && 'Confirming...'}
            {!isPending && !isConfirming && 'Send Tip 💎'}
          </button>

          {hash && (
            <div className="tx-status">
              Transaction Hash: {hash.slice(0, 10) }...{hash.slice(-8)}
            </div>
          )}

          {isSuccess && (
            <div className="success-message">
              ✅ Tip sent successfully!
            </div>
          )}

          {error && (
            <div className="error-message">
              ❌ Error: {error.message}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default SendTipForm;
