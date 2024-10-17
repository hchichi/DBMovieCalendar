import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 缓存国家数据
let countriesCache: any[] | null = null;

// 加载国家数据
async function loadCountries() {
    if (countriesCache) {
        return countriesCache;
    }

    try {
        const filePath = path.join(process.cwd(), 'data', 'countries.json');
        const data = await fs.readFile(filePath, 'utf-8');
        countriesCache = JSON.parse(data);
        return countriesCache;
    } catch (error) {
        console.error('Error loading countries data:', error);
        return null;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: { code: string } }
) {
    try {
        const countries = await loadCountries();
        if (!countries) {
            return NextResponse.json(
                { error: 'Failed to load countries data' },
                { status: 500 }
            );
        }

        const code = params.code.toUpperCase();
        const country = countries.find(c => 
            c.alpha2Code === code || c.alpha3Code === code
        );

        if (!country) {
            return NextResponse.json(
                { error: 'Country not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(country);

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
