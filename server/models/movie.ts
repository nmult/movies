import mongoose, { Schema, model, Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  plot: string;
  fullplot?: string;
  genres?: string[];
  runtime?: number;
  cast?: string[];
  languages?: string[];
  released?: Date;
  directors?: string[];
  writers?: string[];
  awards?: {
    wins?: number;
    nominations?: number;
    text?: string;
  };
  lastupdated?: Date;
  year?: number;
  imdb?: {
    rating?: number;
    votes?: number;
    id?: number;
  };
  countries?: string[];
  type?: string;
  tomatoes?: {
    viewer?: {
      rating?: number;
      numReviews?: number;
      meter?: number;
    };
    production?: string;
    lastUpdated?: Date;
  };
  num_mflix_comments?: number;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<IMovie>(
  {
    title:        { type: String, required: true },
    plot:         { type: String, required: true },
    fullplot:     String,
    genres:       [String],
    runtime:      Number,
    cast:         [String],
    languages:    [String],
    released:     Date,
    directors:    [String],
    writers:      [String],
    awards: {
      wins:       Number,
      nominations:Number,
      text:       String
    },
    lastupdated:  Date,
    year:         Number,
    imdb: {
      rating:    Number,
      votes:     Number,
      id:        Number
    },
    countries:    [String],
    type:         { type: String, default: 'movie' },
    tomatoes: {
      viewer: {
        rating:    Number,
        numReviews: Number,
        meter:     Number
      },
      production: String,
      lastUpdated: Date
    },
    num_mflix_comments: Number
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Movie = model<IMovie>('Movie', movieSchema);
export default Movie;
