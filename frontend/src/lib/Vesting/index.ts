export interface IVesting {
  id: string;
  timestamp: number;
}

export const VestingHandler = {
  process: (data: any) => {
    return {
      id: Math.random().toString(36),
      timestamp: Date.now()
    } as IVesting;
  }
};
