
export interface TShirtDesign {
  id: string;
  frontUrl: string;
  backUrl: string;
  timestamp: number;
  prompt: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}
