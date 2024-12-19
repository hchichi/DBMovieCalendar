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
        const filePath = path.join(process.cwd(), 'data', 'countries', 'countries.json');
        const data = await fs.readFile(filePath, 'utf-8');
        countriesCache = JSON.parse(data);
        return countriesCache;
    } catch (error) {
        console.error('Error loading countries data:', error);
        return null;
    }
}

// 搜索函数
function searchCountries(countries: any[], query: any) {
    // 验证查询参数数量
    const validParams = [
        'name',
        'fullName',
        'code',
        'codes',
        'currency',
        'lang',
        'capital',
        'callingCode',
        'region',
        'regionalBloc'
    ];

    const providedParams = validParams.filter(param => query[param]);
    
    if (providedParams.length === 0) {
        throw new Error('At least one query parameter is required.');
    }

    if (providedParams.length > 1) {
        throw new Error('Please provide only one query parameter at a time.');
    }

    let results = [...countries];

    if (query.name) {
        const name = query.name.toLowerCase();
        results = results.filter(country => 
            country.name.toLowerCase().includes(name) ||
            country.nativeName.toLowerCase().includes(name) ||
            (country.altSpellings && country.altSpellings.some((alt: string) => 
                alt.toLowerCase().includes(name)
            ))
        );
    } else if (query.fullName) {
        const fullName = query.fullName.toLowerCase();
        results = results.filter(country => 
            country.name.toLowerCase() === fullName
        );
    } else if (query.code) {
        const code = query.code.toUpperCase();
        results = results.filter(country => 
            country.alpha2Code === code || 
            country.alpha3Code === code
        );
    } else if (query.codes) {
        const codeList = query.codes.split(';').map((c: string) => c.trim().toUpperCase());
        results = results.filter(country =>
            codeList.includes(country.alpha2Code) || 
            codeList.includes(country.alpha3Code)
        );
    } else if (query.currency) {
        const currency = query.currency.toLowerCase();
        results = results.filter(country =>
            country.currencies &&
            country.currencies.some((curr: any) => 
                curr.code && curr.code.toLowerCase() === currency
            )
        );
    } else if (query.lang) {
        const lang = query.lang.toLowerCase();
        results = results.filter(country =>
            country.languages &&
            country.languages.some((language: any) => 
                language.iso639_1.toLowerCase() === lang
            )
        );
    } else if (query.capital) {
        const capital = query.capital.toLowerCase();
        results = results.filter(country => 
            country.capital.toLowerCase() === capital
        );
    } else if (query.callingCode) {
        results = results.filter(country => 
            country.callingCodes.includes(query.callingCode)
        );
    } else if (query.region) {
        const region = query.region.toLowerCase();
        results = results.filter(country => 
            country.region.toLowerCase() === region
        );
    } else if (query.regionalBloc) {
        const bloc = query.regionalBloc.toLowerCase();
        results = results.filter(country =>
            country.regionalBlocs &&
            country.regionalBlocs.some((rb: any) => 
                rb.acronym.toLowerCase() === bloc
            )
        );
    }

    return results;
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const countries = await loadCountries();
        if (!countries) {
            return NextResponse.json(
                { error: 'Failed to load countries data' },
                { status: 500 }
            );
        }

        // 获取查询参数
        const { searchParams } = new URL(request.url);
        const query: any = {};
        searchParams.forEach((value, key) => {
            query[key] = value;
        });

        try {
            // 搜索并返回结果
            const results = searchCountries(countries, query);
            
            if (results.length === 0) {
                return NextResponse.json(
                    { error: 'No countries found matching the query.' },
                    { status: 404 }
                );
            }

            return NextResponse.json(results);
        } catch (error: any) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
