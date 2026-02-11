export interface IGasOpt {
  id: string;
  timestamp: number;
}

export const GasOptHandler = {
  process: (data: any) => {
    return {
      id: Math.random().toString(36),
      timestamp: Date.now()
    } as IGasOpt;
  }
};
