import { parseEther } from 'viem';
import {
  useWriteContract, useWaitForTransactionReceipt,
} from 'wagmi';

import SendTipForm from '../components/SendTipForm.component';
import { TIP_JAR_CONFIG } from '../config';

const SendTipFormContainer = () => {
  const {
    data: hash, writeContract, isPending, error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sendTransaction = async (amount: number, message: string, isConnected: boolean, callback: () => void) => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      await writeContract({
        ...TIP_JAR_CONFIG,
        functionName: 'sendTip',
        args: [message],
        value: parseEther(String(amount)),
      });
      callback();
    } catch (err) {
      console.error('Error sending tip:', err);
    }
  };

  return (
    <SendTipForm
      receipt={{
        isSuccess,
        isPending,
        isConfirming,
        error,
        hash,
      }}
      sendTransaction={sendTransaction}
    />
  );
};

export default SendTipFormContainer;
