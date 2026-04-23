export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl?: string; // Optional if we just simulate
}

export interface GameState {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}
