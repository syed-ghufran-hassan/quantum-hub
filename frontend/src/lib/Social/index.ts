export interface ISocial {
  id: string;
  timestamp: number;
}

export const SocialHandler = {
  process: (data: any) => {
    return {
      id: Math.random().toString(36),
      timestamp: Date.now()
    } as ISocial;
  }
};
