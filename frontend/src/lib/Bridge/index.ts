export interface IBridge {
  id: string;
  timestamp: number;
}

export const BridgeHandler = {
  process: (data: any) => {
    return {
      id: Math.random().toString(36),
      timestamp: Date.now()
    } as IBridge;
  }
};
