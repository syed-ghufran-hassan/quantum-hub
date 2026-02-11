export interface IMobile {
  id: string;
  timestamp: number;
}

export const MobileHandler = {
  process: (data: any) => {
    return {
      id: Math.random().toString(36),
      timestamp: Date.now()
    } as IMobile;
  }
};
