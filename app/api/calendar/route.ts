import { NextRequest, NextResponse } from 'next/server';
import { Calendar } from '@/app/utils/calendar';

interface CalendarResponse {
  date: string;
  sYear: number;
  sMonth: number;
  sDay: number;
  lYear: number;
  lMonth: number;
  lDay: number;
  isLeap: boolean;
  lMonthZH: string;
  lDayZH: string;
  gzYearZH: string;
  gzMonthZH: string;
  gzDayZH: string;
  week: number;
  weekZH: string;
  animal: string;
  term: string;
  zodiac: string;
  festival: string;
}

const ZODIAC_SIGNS = [
  { name: '魔羯座', start: [12, 22], end: [1, 19] },
  { name: '水瓶座', start: [1, 20], end: [2, 18] },
  { name: '双鱼座', start: [2, 19], end: [3, 20] },
  { name: '白羊座', start: [3, 21], end: [4, 19] },
  { name: '金牛座', start: [4, 20], end: [5, 20] },
  { name: '双子座', start: [5, 21], end: [6, 21] },
  { name: '巨蟹座', start: [6, 22], end: [7, 22] },
  { name: '狮子座', start: [7, 23], end: [8, 22] },
  { name: '处女座', start: [8, 23], end: [9, 22] },
  { name: '天秤座', start: [9, 23], end: [10, 23] },
  { name: '天蝎座', start: [10, 24], end: [11, 22] },
  { name: '射手座', start: [11, 23], end: [12, 21] }
];

function getZodiacSign(month: number, day: number): string {
  const date = new Date(2000, month - 1, day); // 使用2000年作为参考年份
  
  for (const zodiac of ZODIAC_SIGNS) {
    const start = new Date(2000, zodiac.start[0] - 1, zodiac.start[1]);
    const end = new Date(2000, zodiac.end[0] - 1, zodiac.end[1]);
    
    if (zodiac.start[0] === 12 && month === 1) {
      // 处理跨年的魔羯座
      return '魔羯座';
    }
    
    if (date >= start && date <= end) {
      return zodiac.name;
    }
  }
  
  // 如果没有匹配到，说明是魔羯座（跨年）
  return '魔羯座';
}

const WEEK_ZH = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export async function GET(request: NextRequest) {
  try {
    // 从查询参数中获取日期，如果没有则使用当前日期
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    
    let date: Date;
    if (dateParam) {
      date = new Date(dateParam);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format. Please use YYYY-MM-DD' },
          { status: 400 }
        );
      }
    } else {
      date = new Date();
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const calendar = new Calendar();
    const lunarData = calendar.solar2lunar(year, month, day);
    
    if (!lunarData) {
      return NextResponse.json(
        { error: 'Date out of range. Supported range: 1900-01-31 to 2100-12-31' },
        { status: 400 }
      );
    }

    const response: CalendarResponse = {
      date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      sYear: year,
      sMonth: month,
      sDay: day,
      lYear: lunarData.lYear,
      lMonth: lunarData.lMonth,
      lDay: lunarData.lDay,
      isLeap: lunarData.isLeap,
      lMonthZH: lunarData.lMonthZH,
      lDayZH: lunarData.lDayZH,
      gzYearZH: lunarData.gzYearZH,
      gzMonthZH: lunarData.gzMonthZH,
      gzDayZH: lunarData.gzDayZH,
      week: date.getDay(),
      weekZH: WEEK_ZH[date.getDay()],
      animal: lunarData.animal,
      term: lunarData.term || '',
      zodiac: getZodiacSign(month, day),
      festival: lunarData.festival || ''
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing calendar request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
