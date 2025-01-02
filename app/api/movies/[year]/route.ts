import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string } }
) {
  try {
    const { year } = params;
    const filePath = path.join(process.cwd(), 'data', 'movies', `cal${year}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const movies = JSON.parse(data);
      return NextResponse.json(movies);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.error(`File not found: ${filePath}`);
        return notFound();
      }
      console.error(`Error reading file: ${filePath}`, error);
      throw error;
    }
  } catch (error) {
    console.error('Error loading movies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
