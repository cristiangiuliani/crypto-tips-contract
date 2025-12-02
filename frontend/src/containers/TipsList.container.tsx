import { useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { usePublicClient } from 'wagmi';

import TipsListComponent from '../components/TipsList.component';
import { TIP_JAR_CONFIG } from '../config';
import { useFetchOnReceived } from '../hooks/useFetchOnReceived.hook';
import type { ITip } from '../interfaces/tips.interface';

const TipsListContainer = () => {
  const [tips, setTips] = useState<ITip[]>([]);
  const [loading, setLoading] = useState(true);

  const publicClient = usePublicClient();

  const fetchTips = async () => {
    if (!publicClient) return;

    try {
      setLoading(true);
      // Get all TipReceived events
      const logs = await publicClient.getContractEvents({
        ...TIP_JAR_CONFIG,
        eventName: 'TipReceived',
        fromBlock: 0n,
        toBlock: 'latest',
      });

      // Parse events into Tip objects
      const parsedTips: ITip[] = logs.map((log) => {
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

  useEffect(() => {
    fetchTips();
  }, [publicClient]);

  useFetchOnReceived({ callback: fetchTips });

  if (loading) return <div>Loading tips...</div>;

  return (
    <TipsListComponent tips={tips} loading={loading} />
  );
};

export default TipsListContainer;
