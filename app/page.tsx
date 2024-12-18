'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MovieCarousel from './components/MovieCarousel';
import { Calendar } from './utils/calendar';

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

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [lunarInfo, setLunarInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载初始电影数据
  useEffect(() => {
    const fetchInitialMovie = async () => {
      try {
        const response = await fetch('/api/movies');
        if (response.ok) {
          const movies = await response.json();
          if (movies && movies.length > 0) {
            setSelectedMovie(movies[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching initial movie:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMovie();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      const [year, month, day] = selectedMovie.calendar.split('-').map(Number);
      const calendar = new Calendar();
      const lunarData = calendar.solar2lunar(year, month, day);
      setLunarInfo(lunarData);
    }
  }, [selectedMovie]);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">加载中...</div>
          </div>
        ) : selectedMovie ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="relative h-[600px] group">
                <Image
                  src={selectedMovie.pic.large}
                  alt={selectedMovie.title}
                  fill
                  className="object-cover rounded-lg shadow-2xl"
                  priority
                />
              </div>
              <div className="flex flex-col justify-start space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-3">{selectedMovie.title}</h1>
                  {selectedMovie.originTitle && (
                    <h2 className="text-2xl text-gray-400 mb-4">{selectedMovie.originTitle}</h2>
                  )}
                  
                  {/* 评分显示 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="font-['Righteous'] text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text">
                      {selectedMovie.rating.value}
                    </div>
                    {selectedMovie.comment && (
                      <div className="text-lg text-gray-300 italic">&ldquo;{selectedMovie.comment}&rdquo;</div>
                    )}
                  </div>

                  {/* 农历信息显示 */}
                  {lunarInfo && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="text-lg text-amber-400 mb-1">
                            农历 {lunarInfo.lYear}年 {lunarInfo.lMonthZH}{lunarInfo.lDayZH}
                          </div>
                          <div className="text-sm text-gray-300">
                            {lunarInfo.gzYearZH}年 · {lunarInfo.animal}年 · {lunarInfo.gzMonthZH}月 {lunarInfo.gzDayZH}日
                          </div>
                        </div>
                        {(lunarInfo.festival || lunarInfo.term) && (
                          <div className="text-right">
                            {lunarInfo.festival && (
                              <div className="text-red-400 mb-1">{lunarInfo.festival}</div>
                            )}
                            {lunarInfo.term && (
                              <div className="text-green-400">{lunarInfo.term}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="px-3 py-1 bg-gray-800 rounded-full">{selectedMovie.year}</span>
                    {selectedMovie.languages.length > 0 && (
                      <span className="px-3 py-1 bg-gray-800 rounded-full">
                        {selectedMovie.languages.join(' / ')}
                      </span>
                    )}
                    {selectedMovie.pubdate && selectedMovie.pubdate[0] && (
                      <span className="px-3 py-1 bg-gray-800 rounded-full">
                        {selectedMovie.pubdate[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm hover:bg-gray-600 transition-colors"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 简介 */}
                <div className="mt-6 space-y-4">
                  {selectedMovie.intro && (
                    <p className="text-gray-300 leading-relaxed">{selectedMovie.intro}</p>
                  )}
                </div>

                {/* 豆瓣链接 */}
                <a
                  href={selectedMovie.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors w-fit"
                >
                  <span>在豆瓣查看</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">近期推荐</h2>
              <MovieCarousel onMovieSelect={setSelectedMovie} />
            </div>
          </>
        ) : (
          <div className="text-center text-white text-xl">
            暂无电影数据
          </div>
        )}
      </div>
    </main>
  );
}
