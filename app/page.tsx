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
  directors?: string[];
  actors?: string[];
}

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [lunarInfo, setLunarInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载初始电影数据
  useEffect(() => {
    const fetchInitialMovie = async () => {
      try {
        // 获取当前日期
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        // 先尝试获取当天的电影
        let response = await fetch(`/api/movie/${dateStr}`);
        if (response.ok) {
          const movie = await response.json();
          if (movie) {
            setSelectedMovie(movie);
            return;
          }
        }
        
        // 如果当天没有电影，获取所有电影列表
        response = await fetch('/api/movies');
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-xl">加载中...</div>
          </div>
        ) : selectedMovie ? (
          <>
            <div className="relative">
              {/* 背景模糊效果 */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <Image
                  src={`/api/image?url=${encodeURIComponent(selectedMovie.pic.large)}`}
                  alt=""
                  fill
                  className="object-cover blur-3xl opacity-30"
                  unoptimized
                />
              </div>

              {/* 主要内容 */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 backdrop-blur-sm bg-black/20 rounded-2xl p-8">
                {/* 海报部分 */}
                <div className="lg:col-span-4">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl 
                                transform hover:scale-[1.02] transition-transform duration-300
                                ring-1 ring-white/10 hover:ring-amber-500/50">
                    <Image
                      src={`/api/image?url=${encodeURIComponent(selectedMovie.pic.large)}`}
                      alt={selectedMovie.title}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </div>

                {/* 信息部分 */}
                <div className="lg:col-span-8 flex flex-col justify-start space-y-8">
                  {/* 标题和评分部分 */}
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-2 leading-tight">{selectedMovie.title}</h1>
                      {selectedMovie.originTitle && (
                        <h2 className="text-xl text-gray-400">{selectedMovie.originTitle}</h2>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-baseline gap-2">
                        <div className="font-righteous text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text italic">
                          {selectedMovie.rating.value}
                        </div>
                        <span className="text-gray-400 text-sm">/ 10</span>
                      </div>
                      {selectedMovie.comment && (
                        <div className="text-lg text-gray-300 italic leading-relaxed">
                          &ldquo;{selectedMovie.comment}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 农历信息 */}
                  {lunarInfo && (
                    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <div className="text-xl text-amber-400 mb-2">
                            农历 {lunarInfo.lYear}年 {lunarInfo.lMonthZH}{lunarInfo.lDayZH}
                          </div>
                          <div className="text-gray-300">
                            {lunarInfo.gzYearZH}年 · {lunarInfo.animal}年 · {lunarInfo.gzMonthZH}月 {lunarInfo.gzDayZH}日
                          </div>
                        </div>
                        {(lunarInfo.festival || lunarInfo.term) && (
                          <div className="text-right">
                            {lunarInfo.festival && (
                              <div className="text-red-400 text-lg mb-1">{lunarInfo.festival}</div>
                            )}
                            {lunarInfo.term && (
                              <div className="text-emerald-400 text-lg">{lunarInfo.term}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 基本信息 */}
                  <div className="space-y-6">
                    {/* 年份、语言、上映日期 */}
                    <div className="flex flex-wrap gap-3">
                      {selectedMovie.year && (
                        <span className="px-4 py-1.5 bg-white/5 rounded-full text-gray-300 border border-white/10">
                          {selectedMovie.year}
                        </span>
                      )}
                      {selectedMovie.languages?.map((lang) => (
                        <span key={lang} className="px-4 py-1.5 bg-white/5 rounded-full text-gray-300 border border-white/10">
                          {lang}
                        </span>
                      ))}
                      {selectedMovie.pubdate?.[0] && (
                        <span className="px-4 py-1.5 bg-white/5 rounded-full text-gray-300 border border-white/10">
                          {selectedMovie.pubdate[0]}
                        </span>
                      )}
                    </div>

                    {/* 导演和演员 */}
                    <div className="space-y-3">
                      {selectedMovie.directors && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 min-w-16">导演</span>
                          <span className="text-gray-200">{selectedMovie.directors.join(' / ')}</span>
                        </div>
                      )}
                      {selectedMovie.actors && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 min-w-16">主演</span>
                          <span className="text-gray-200">{selectedMovie.actors.slice(0, 3).join(' / ')}</span>
                        </div>
                      )}
                    </div>

                    {/* 类型标签 */}
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.genres.map((genre) => (
                        <span
                          key={genre}
                          className="px-4 py-1.5 bg-white/5 rounded-full text-amber-400 text-sm 
                                   border border-amber-500/30 hover:bg-amber-500/10 transition-colors"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 简介 */}
                  {selectedMovie.intro && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-amber-400">剧情简介</h3>
                      <p className="text-gray-300 leading-relaxed">{selectedMovie.intro}</p>
                    </div>
                  )}

                  {/* 豆瓣链接 */}
                  <a
                    href={selectedMovie.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 
                             transition-colors w-fit group"
                  >
                    <span>在豆瓣查看详情</span>
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M14 5l7 7m0 0l-7 7m7-7H3" 
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* 近期推荐 */}
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-8 text-white">近期推荐</h2>
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
