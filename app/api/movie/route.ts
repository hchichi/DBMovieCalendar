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

    const movies = await loadMovies(year);
    if (!movies) {
      return NextResponse.json({ error: 'Failed to load movies data' }, { status: 500 });
    }

    const movie = movies.find((m: any) => m.calendar === todayStr);

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found for today' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
