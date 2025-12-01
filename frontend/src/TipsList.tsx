import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { usePublicClient } from 'wagmi';

import { TIP_JAR_CONFIG } from './config';

interface Tip {
  sender: string;
  amount: string;
  message: string;
  timestamp: number;
}

const TipsList = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchTips = async () => {
      if (!publicClient) return;

      try {
        // Get all TipReceived events
        const logs = await publicClient.getContractEvents({
          ...TIP_JAR_CONFIG,
          eventName: 'TipReceived',
          fromBlock: 0n,
          toBlock: 'latest',
        });

        // Parse events into Tip objects
        const parsedTips: Tip[] = logs.map((log: any) => {
          const {
            sender, amount, message, timestamp,
          } = log.args as {
            sender: string;
            amount: bigint;
            message: string;
            timestamp: bigint;
          };

          return {
            sender,
            amount: formatEther(amount),
            message,
            timestamp: Number(timestamp),
          };
        });

        // Most recent first
        setTips(parsedTips.reverse());
      } catch (error) {
        console.error('Error fetching tips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [publicClient]);

  if (loading) return <div>Loading tips...</div>;

  return (
    <div className="tips-list">
      <h2>Recent Tips</h2>
      {tips.length === 0 ? (
        <p>No tips yet!</p>
      ) : (
        <div className="tips-grid">
          {tips.map((tip, index) => (
            <div key={index} className="tip-card">
              <div className="tip-header">
                <span className="tip-sender">
                  {tip.sender.slice(0, 6)}...{tip.sender.slice(-4)}
                </span>
                <span className="tip-amount">{tip.amount} ETH</span>
              </div>
              <div className="tip-message">{tip.message}</div>
              <div className="tip-date">
                {new Date(tip.timestamp * 1000).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TipsList;
