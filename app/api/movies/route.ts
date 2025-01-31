import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 获取东八区的当前时间
function getChinaDate() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 8);
}

// 加载电影数据
async function loadMovies(year: string) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'movies', `cal${year}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading movies data for year ${year}:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const today = getChinaDate();
    const year = today.getFullYear().toString();
    const thirtyDaysAgo = getChinaDate();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 判断是否需要加载上一年的数据
    const lastYear = (parseInt(year) - 1).toString();
    const needLastYear = thirtyDaysAgo.getFullYear() < today.getFullYear();

    // 加载当前年份的数据
    const currentYearMovies = (await loadMovies(year)) || [];

    // 如果需要，加载上一年的数据
    const lastYearMovies = needLastYear ? (await loadMovies(lastYear)) || [] : [];

    // 合并两年的数据
    const allMovies = [...lastYearMovies, ...currentYearMovies];

    if (allMovies.length === 0) {
      return NextResponse.json({ error: 'Failed to load movies data' }, { status: 500 });
    }

    // 获取最近30天的电影
    const recentMovies = allMovies.filter(movie => {
      const movieDate = new Date(movie.calendar);
      return movieDate >= thirtyDaysAgo && movieDate <= today;
    });

    if (recentMovies.length === 0) {
      return NextResponse.json({ error: 'No movies found for the last 30 days' }, { status: 404 });
    }

    // 按日期排序
    recentMovies.sort((a, b) => new Date(a.calendar).getTime() - new Date(b.calendar).getTime());

    return NextResponse.json(recentMovies);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
