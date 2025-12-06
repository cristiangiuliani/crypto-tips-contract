import {
  Typography, Container, Card, CardHeader, CardContent,
} from '@mui/material';

import type { ITip } from '../interfaces/tips.interface';

type TTipsListComponentProps = {
  tips: ITip[];
  loading: boolean;
};

const TipsListComponent = ({ tips, loading }: TTipsListComponentProps) => {
  if (loading) return <div>Loading tips...</div>;

  return (
    <Container>
      {tips.length === 0 ? (
        <Typography>No tips yet!</Typography>
      ) : (
        <>
          {tips.map((tip, index) => (
            <Card key={index}>
              <CardHeader title={`${tip.amount} ETH`} />
              <CardContent>
                <Typography variant="body2">
                  {tip.sender.slice(0, 6)}...{tip.sender.slice(-4)}
                </Typography>

                <Typography variant="body2">{tip.message}</Typography>
                <Typography variant="body2">
                  {new Date(tip.timestamp * 1000).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default TipsListComponent;
