export interface Movie {
  _id: string;
  title: string;
  plot: string;
  poster: string;
  year: number | null;
  genres: string[];
  runtime: number;
  cast: string[];
  released: string;    // ISO date
  directors?: string[];
  writers?: string[];
  createdAt: string;
  updatedAt: string;
}