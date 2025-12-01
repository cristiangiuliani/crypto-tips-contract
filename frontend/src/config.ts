
import TipJarJSON from './__mocks__/TipJar.json';

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`;

export const TIP_JAR_CONFIG = {
  address: CONTRACT_ADDRESS,
  abi: TipJarJSON,
  chainId: 31337,
} as const;
