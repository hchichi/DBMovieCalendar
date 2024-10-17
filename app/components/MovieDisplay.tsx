import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Movie } from '../types/movie';

interface MovieDisplayProps {
  movie: Movie;
}

export default function MovieDisplay({ movie }: MovieDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-[600px] rounded-2xl overflow-hidden group"
    >
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <Image
          src={movie.pic.normal}
          alt={movie.title}
          fill
          className="object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90" />
      </div>
      
      {/* 电影信息 */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 p-8 z-10"
      >
        <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
          {movie.title}
        </h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          {movie.calendar && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium"
            >
              📅 {movie.calendar}
            </motion.span>
          )}
          {movie.duration && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium"
            >
              ⏱ {movie.duration}
            </motion.span>
          )}
          {movie.rating && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium"
            >
              ⭐️ {movie.rating}
            </motion.span>
          )}
        </div>

        {movie.genre && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {movie.genre.map((g) => (
              <span
                key={g}
                className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-sm"
              >
                {g}
              </span>
            ))}
          </motion.div>
        )}

        {movie.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-300 max-w-2xl text-lg leading-relaxed line-clamp-3 backdrop-blur-sm"
          >
            {movie.description}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
} 
