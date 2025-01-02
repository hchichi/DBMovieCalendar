'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Calendar } from '../utils/calendar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

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

interface MovieCarouselProps {
  selectedMovie: Movie | null;
  allMovies: Movie[];
  onMovieSelect: (movie: Movie) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  selectedMovie,
  allMovies,
  onMovieSelect
}) => {
  const [expandedIntro, setExpandedIntro] = useState(false);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);

  // 获取最近15天的电影
  useEffect(() => {
    if (allMovies.length > 0) {
      const today = new Date();
      const recentDates = [];
      
      // 获取最近15天的日期（包括今天）
      for (let i = 14; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        recentDates.push(`${year}-${month}-${day}`);
      }

      // 根据日期筛选电影
      const movies = recentDates
        .map(date => allMovies.find(movie => movie.calendar === date))
        .filter((movie): movie is Movie => movie !== undefined);
      
      setRecentMovies(movies);
    }
  }, [allMovies]);

  // 获取农历信息
  const getLunarInfo = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return Calendar.solar2lunar(year, month, day);
  };

  if (!selectedMovie) {
    return <div className="text-white text-center p-4">加载中...</div>;
  }

  const currentLunar = getLunarInfo(selectedMovie.calendar);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      {/* 主要电影展示区域 */}
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* 左侧海报 */}
          <div className="relative w-full md:w-1/3">
            <div className="relative aspect-[2/3] w-full">
              <Image
                src={`/api/image?url=${encodeURIComponent(selectedMovie.pic.large)}`}
                alt={selectedMovie.title}
                fill
                className="rounded-lg shadow-xl"
                style={{ objectFit: 'cover' }}
                unoptimized
              />
              
              {/* 农历信息 */}
              {currentLunar && (
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="text-center">
                    <div className="text-amber-400 text-lg font-medium">
                      农历 {currentLunar.lMonthZH}{currentLunar.lDayZH}
                    </div>
                    <div className="text-gray-300 text-sm mt-1">
                      {currentLunar.gzYearZH}年 {currentLunar.gzMonthZH}月 {currentLunar.gzDayZH}日
                    </div>
                    {(currentLunar.festival || currentLunar.term) && (
                      <div className="mt-2">
                        {currentLunar.festival && (
                          <span className="text-red-400 text-sm">{currentLunar.festival}</span>
                        )}
                        {currentLunar.term && (
                          <span className="text-emerald-400 text-sm ml-2">{currentLunar.term}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 简介部分 - 固定在底部 */}
              {selectedMovie.intro && (
                <div className="absolute bottom-0 left-0 right-0">
                  <div className={`bg-black/80 backdrop-blur-md p-4 transition-all duration-300 ${expandedIntro ? 'h-auto' : 'h-32'}`}>
                    <h3 className="text-lg font-medium text-amber-400 flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      剧情简介
                    </h3>
                    <p className={`text-gray-300 leading-relaxed ${expandedIntro ? '' : 'line-clamp-2'}`}>
                      {selectedMovie.intro}
                    </p>
                    <button
                      onClick={() => setExpandedIntro(!expandedIntro)}
                      className="absolute bottom-2 right-2 text-amber-400 hover:text-amber-300 
                               transition-colors p-1 rounded-full bg-black/50"
                    >
                      <svg
                        className={`w-6 h-6 transform transition-transform ${expandedIntro ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧信息 */}
          <div className="flex-1 text-white">
            {/* 标题和评分部分 */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2 leading-tight">{selectedMovie.title}</h1>
              {selectedMovie.originTitle && (
                <h2 className="text-xl text-gray-300">{selectedMovie.originTitle}</h2>
              )}
            </div>

            {/* 评分和短评 */}
            <div className="flex items-baseline mb-6">
              <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 
                            text-transparent bg-clip-text">
                {selectedMovie.rating.value.toFixed(1)}
              </div>
              <span className="text-gray-400 text-lg ml-2">/ 10</span>
              {selectedMovie.comment && (
                <div className="ml-4 text-lg text-gray-300 italic flex-1">
                  "{selectedMovie.comment}"
                </div>
              )}
            </div>

            {/* 基本信息 */}
            <div className="space-y-4 mb-6">
              {/* 电影信息栏 */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-base">
                {/* 年份 */}
                {selectedMovie.year && (
                  <span className="text-amber-400">{selectedMovie.year}</span>
                )}

                {/* 分隔点 */}
                {selectedMovie.year && <span className="text-gray-500">·</span>}

                {/* 国家 */}
                {(() => {
                  const [country] = (selectedMovie.card_subtitle || '').split(' / ').slice(1, 2);
                  if (country) {
                    return (
                      <>
                        <span className="text-gray-300">{country}</span>
                        <span className="text-gray-500">·</span>
                      </>
                    );
                  }
                  return null;
                })()}

                {/* 类型 */}
                <span className="text-gray-300">{selectedMovie.genres.join(' / ')}</span>

                {/* 分隔点 */}
                <span className="text-gray-500">·</span>

                {/* 语言 */}
                <span className="text-gray-300">{selectedMovie.languages.join(' / ')}</span>
              </div>

              {/* 上映信息 */}
              <div className="text-sm space-y-1">
                {selectedMovie.pubdate.map((date, index) => (
                  <div key={index} className={`${index === 0 ? 'text-gray-300' : 'text-gray-400'}`}>
                    {index === 0 ? '首映：' : '其他：'}{date}
                  </div>
                ))}
              </div>

              {/* 导演和演员信息 */}
              <div className="space-y-2">
                {selectedMovie.directors && (
                  <div className="text-base flex gap-2">
                    <span className="text-gray-400 shrink-0">导演</span>
                    <span className="text-gray-200">{selectedMovie.directors.join(' / ')}</span>
                  </div>
                )}
                {selectedMovie.actors && (
                  <div className="text-base flex gap-2">
                    <span className="text-gray-400 shrink-0">主演</span>
                    <span className="text-gray-200">{selectedMovie.actors.join(' / ')}</span>
                  </div>
                )}
              </div>

              {/* 标签云 */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedMovie.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/5 rounded-full text-amber-400/90 text-sm 
                             border border-amber-500/20 hover:bg-white/10 transition-colors"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* 获奖信息 */}
            {selectedMovie.awards && selectedMovie.awards.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-medium text-amber-400 mb-2">获奖记录</h3>
                <ul className="space-y-2">
                  {selectedMovie.awards.map((award, index) => (
                    <li key={index} className="text-gray-300">
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 票房信息 */}
            {selectedMovie.boxoffice && (
              <div className="mb-6">
                <h3 className="text-xl font-medium text-amber-400 mb-2">票房信息</h3>
                <div className="text-gray-300">
                  <p>总票房：{selectedMovie.boxoffice.total}</p>
                  <p>票房排名：第 {selectedMovie.boxoffice.rank} 名</p>
                </div>
              </div>
            )}

            {/* 相关推荐 */}
            {selectedMovie.recommendations && selectedMovie.recommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-medium text-amber-400 mb-2">相关推荐</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedMovie.recommendations.map((rec, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3">
                      <div className="font-medium text-gray-200">{rec.title}</div>
                      <div className="text-sm text-gray-400">
                        {rec.year} · {rec.rating} 分
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 豆瓣链接 */}
            <a
              href={selectedMovie.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 
                       transition-colors group bg-white/5 px-6 py-3 rounded-full text-lg"
            >
              <span>在豆瓣查看详情</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* 底部电影时间轴 */}
      <div className="mt-8 container mx-auto">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView="auto"
          className="movie-timeline"
          initialSlide={14}
        >
          {recentMovies.map((movie, index) => (
            <SwiperSlide key={index} style={{ width: '200px' }}>
              <div
                className={`cursor-pointer transition-all duration-300 ${
                  selectedMovie.calendar === movie.calendar
                    ? 'transform scale-105 ring-2 ring-amber-400'
                    : 'hover:transform hover:scale-105'
                }`}
                onClick={() => onMovieSelect(movie)}
              >
                <div className="relative aspect-[2/3]">
                  <Image
                    src={`/api/image?url=${encodeURIComponent(movie.pic.normal)}`}
                    alt={movie.title}
                    fill
                    className="rounded-lg shadow-md"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  
                  {/* 日期和农历信息 */}
                  {(() => {
                    const lunar = getLunarInfo(movie.calendar);
                    return (
                      <>
                        <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/80 to-transparent">
                          <div className="text-center">
                            <div className="text-white text-sm">
                              {movie.calendar.split('-').slice(1).join('/')}
                            </div>
                            {lunar && (
                              <div className="text-amber-400 text-xs">
                                {lunar.lMonthZH}{lunar.lDayZH}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* 简介预览 */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-xs line-clamp-2">
                            {movie.intro}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MovieCarousel;
