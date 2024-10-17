'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Movie {
  title: string;
  originTitle: string;
  calendar: string;
  link: string;
  pic: {
    normal: string;
    large: string;
  };
  rating: {
    value: number;
  };
  comment: string;
  intro: string;
  languages: string[];
  genres: string[];
  pubdate: string[];
  year: string;
  is_tv: boolean;
}

interface MovieCarouselProps {
  onMovieSelect: (movie: Movie) => void;
}

export default function MovieCarousel({ onMovieSelect }: MovieCarouselProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        if (response.ok) {
          const data = await response.json();
          setMovies(data);
          if (data.length > 0) {
            setSelectedMovie(data[0]);
            onMovieSelect(data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [onMovieSelect]);

  return (
    <div className="w-full">
      <div className="overflow-x-auto flex gap-6 p-4 scrollbar-hide">
        {movies.map((movie) => (
          <div
            key={movie.calendar}
            className={`flex-none w-48 cursor-pointer transition-all duration-300 ${
              selectedMovie?.calendar === movie.calendar 
              ? 'scale-105 ring-2 ring-amber-400 rounded-lg' 
              : 'hover:scale-105'
            }`}
            onClick={() => {
              setSelectedMovie(movie);
              onMovieSelect(movie);
            }}
          >
            <div className="relative h-72 w-48 group">
              <Image
                src={movie.pic.large}
                alt={movie.title}
                fill
                className="object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium truncate">
                    {movie.title}
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    {movie.calendar}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
