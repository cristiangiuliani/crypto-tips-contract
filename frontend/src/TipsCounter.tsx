import { useReadContract } from 'wagmi';

import { TIP_JAR_CONFIG } from './config';

const TipsCounter = () => {
  const {
    data: totalTips, isLoading, error,
  } = useReadContract({
    ...TIP_JAR_CONFIG,
    functionName: 'totalTipsCount',
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tips count: ${error.message}</div>;

  return (
    <div className="tips-counter">
      <h2>Total Tips Received: {totalTips?.toString() || '0'}</h2>
    </div>
  );
};

export default TipsCounter;
