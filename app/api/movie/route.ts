import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 缓存电影数据
let moviesCache: { [key: string]: any[] } = {};

// 加载电影数据
async function loadMovies(year: string) {
  if (moviesCache[year]) {
    return moviesCache[year];
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'movies', `cal${year}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    moviesCache[year] = JSON.parse(data);
    return moviesCache[year];
  } catch (error) {
    console.error(`Error loading movies data for year ${year}:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    // 先尝试加载当前年份的数据
    let movies = await loadMovies(year);
    let movie = movies?.find((m: any) => m.calendar === todayStr);

    // 如果当前年份没有找到电影数据，尝试加载下一年的数据
    if (!movie && month === '12') {
      const nextYear = (parseInt(year) + 1).toString();
      const nextYearMovies = await loadMovies(nextYear);
      if (nextYearMovies) {
        movie = nextYearMovies.find((m: any) => m.calendar === todayStr);
      }
    }

    if (!movies && !movie) {
      return NextResponse.json({ error: 'Failed to load movies data' }, { status: 500 });
    }

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found for today' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
