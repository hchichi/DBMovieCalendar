import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Movie } from '../types/movie';

interface MovieSliderProps {
  onMovieSelect: (movie: Movie) => void;
}

export default function MovieSlider({ onMovieSelect }: MovieSliderProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies');
        const data = await response.json();
        const sortedMovies = data.sort((a: Movie, b: Movie) => 
          new Date(a.calendar).getTime() - new Date(b.calendar).getTime()
        );
        setMovies(sortedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-xl font-medium text-white/70"
        >
          加载中...
        </motion.div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full overflow-hidden bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {movies.map((movie, index) => (
          <motion.div
            key={movie.calendar}
            variants={item}
            className="flex-none cursor-pointer"
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onClick={() => onMovieSelect(movie)}
          >
            <motion.div
              className="relative w-40 h-56 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={movie.pic.normal}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <motion.div
                initial={false}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                }}
                className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
              />
              <motion.div
                initial={false}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  y: hoveredIndex === index ? 0 : 10,
                }}
                className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent"
              >
                <p className="text-xs text-white/90 font-medium">
                  {new Date(movie.calendar).toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </motion.div>
            </motion.div>
            <motion.div
              initial={false}
              animate={{
                y: hoveredIndex === index ? -5 : 0,
              }}
              className="mt-3 text-center"
            >
              <h3 className="text-sm font-medium text-white truncate">
                {movie.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(movie.calendar).toLocaleDateString('zh-CN', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
