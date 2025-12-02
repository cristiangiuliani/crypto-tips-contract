import { useWatchContractEvent } from 'wagmi';

import { TIP_JAR_CONFIG } from '../config';

export const useFetchOnReceived = ({ callback = () => {} }) => {
  useWatchContractEvent({
    ...TIP_JAR_CONFIG,
    eventName: 'TipReceived',
    onLogs() {
      callback();
    },
  });

  return  null;
};
