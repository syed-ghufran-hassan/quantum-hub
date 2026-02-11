export interface INFTLending {
  id: string;
  timestamp: number;
}

export const NFTLendingHandler = {
  process: (data: any) => {
    return {
      id: Math.random().toString(36),
      timestamp: Date.now()
    } as INFTLending;
  }
};
