export interface Movie {
  _id: string;
  title: string;
  plot: string;
  genres: string[];
  runtime: number;
  cast: string[];
  released: string;    // ISO date
  directors?: string[];
  writers?: string[];
  createdAt: string;
  updatedAt: string;
}