import type { ITip } from '../interfaces/tips.interface';

type TTipsListComponentProps = {
  tips: ITip[];
  loading: boolean;
};

const TipsListComponent = ({ tips, loading }: TTipsListComponentProps) => {
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

export default TipsListComponent;
