import { useReadContract } from 'wagmi';

import { TIP_JAR_CONFIG } from '../config';
import { useFetchOnReceived } from '../hooks/useFetchOnReceived.hook';

const TipsCounter = () => {
  const {
    data: totalTips, isLoading, error, refetch,
  } = useReadContract({
    ...TIP_JAR_CONFIG,
    functionName: 'totalTipsCount',
  });

  useFetchOnReceived({ callback: () => refetch() });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tips count</div>;

  return (
    <div className="tips-counter">
      <h2>Total Tips Received: {totalTips?.toString() || '0'}</h2>
    </div>
  );
};

export default TipsCounter;
