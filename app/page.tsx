'use client';

import { useState, useEffect } from 'react';
import MovieCarousel from './components/MovieCarousel';

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
  directors?: string[];
  actors?: string[];
  awards?: string[];
  recommendations?: {
    title: string;
    year: string;
    rating: number;
  }[];
  boxoffice?: {
    total: string;
    rank: number;
  };
}

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [currentYear, setCurrentYear] = useState<string>('');

  // 加载电影数据
  const loadMoviesForYear = async (year: string) => {
    try {
      const response = await fetch(`/api/movies/${year}`);
      if (response.ok) {
        const movies = await response.json();
        return movies;
      }
    } catch (error) {
      console.error(`Error loading movies for year ${year}:`, error);
    }
    return null;
  };

  // 加载初始电影数据
  useEffect(() => {
    const fetchInitialMovies = async () => {
      try {
        const today = new Date();
        const currentYear = today.getFullYear();
        const lastYear = currentYear - 1;
        
        // 加载当前年份和去年的电影数据
        const [currentYearMovies, lastYearMovies] = await Promise.all([
          loadMoviesForYear(currentYear.toString()),
          loadMoviesForYear(lastYear.toString())
        ]);

        // 合并电影数据
        const allMoviesData = [
          ...(lastYearMovies || []),
          ...(currentYearMovies || [])
        ].sort((a, b) => a.calendar.localeCompare(b.calendar));

        setAllMovies(allMoviesData);

        // 查找当天的电影
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${currentYear}-${month}-${day}`;
        
        const todayMovie = allMoviesData.find(m => m.calendar === dateStr);
        if (todayMovie) {
          setSelectedMovie(todayMovie);
        }
        setCurrentYear(currentYear.toString());
      } catch (error) {
        console.error('Error fetching initial movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMovies();
  }, []);

  // 处理电影选择
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    const [year] = movie.calendar.split('-');
    
    // 如果年份变化，加载新的电影数据
    if (year !== currentYear) {
      loadMoviesForYear(year).then(newMovies => {
        if (newMovies) {
          setAllMovies(prev => {
            const filtered = prev.filter(m => {
              const movieYear = m.calendar.split('-')[0];
              return movieYear !== year;
            });
            return [...filtered, ...newMovies];
          });
        }
      });
      setCurrentYear(year);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <MovieCarousel
        selectedMovie={selectedMovie}
        allMovies={allMovies}
        onMovieSelect={handleMovieSelect}
      />
    </main>
  );
}
