import { NextRequest, NextResponse } from 'next/server';
import { Solar } from '../../../src/lib/Solar';
import { Lunar } from '../../../src/lib/Lunar';
import { HolidayUtil } from '../../../src/lib/HolidayUtil';
import { I18n } from '../../../src/lib/I18n';
import { FotoUtil } from '../../../src/lib/FotoUtil';
import { TaoUtil } from '../../../src/lib/TaoUtil';
import { SolarUtil } from '../../../src/lib/SolarUtil';
import { LunarUtil } from '../../../src/lib/LunarUtil';

// 初始化 I18n
I18n.init();
// 设置语言为中文
I18n.setLanguage('chs');

// 获取东八区的当前时间
function getChinaDate() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 8);
}

export async function GET(request: NextRequest) {
  try {
    // 获取东八区的当前时间
    const today = getChinaDate();
    console.log('Current China date:', today);

    const solar = Solar.fromDate(today);
    console.log('Solar object:', solar);

    const lunar = solar.getLunar();
    console.log('Lunar object:', lunar);

    // 获取节假日信息
    const solarYmd = solar.toYmd();
    const holidays = HolidayUtil.getHolidays(solarYmd);
    const holidayInfo = holidays.map(h => ({
      name: h.getName(),
      isWork: h.isWork(),
      target: h.getTarget(),
    }));

    // 获取当前节气
    const currentJieQi = lunar.getCurrentJieQi();
    const nextJieQi = lunar.getNextJieQi();

    const result = {
      // 基本信息
      date: {
        solar: `${solar.toYmdHms()}`,
        lunar: lunar.toString(),
        week: solar.getWeekInChinese(),
        xingZuo: `${solar.getXingZuo()}座`,
      },

      // 年月日时信息
      ganzhi: {
        year: {
          ganZhi: lunar.getYearInGanZhi(),
          shengXiao: lunar.getYearShengXiao(),
          naYin: lunar.getYearNaYin(),
        },
        month: {
          ganZhi: lunar.getMonthInGanZhi(),
          shengXiao: lunar.getMonthShengXiao(),
          naYin: lunar.getMonthNaYin(),
        },
        day: {
          ganZhi: lunar.getDayInGanZhi(),
          shengXiao: lunar.getDayShengXiao(),
          naYin: lunar.getDayNaYin(),
        },
        time: {
          ganZhi: lunar.getTimeInGanZhi(),
          shengXiao: lunar.getTimeShengXiao(),
          naYin: lunar.getTimeNaYin(),
        },
      },

      // 吉凶方位
      direction: {
        // 吉神方位
        auspicious: {
          xi: {
            position: lunar.getDayPositionXi(),
            description: lunar.getDayPositionXiDesc(),
          },
          fu: {
            position: lunar.getDayPositionFu(),
            description: lunar.getDayPositionFuDesc(),
          },
          cai: {
            position: lunar.getDayPositionCai(),
            description: lunar.getDayPositionCaiDesc(),
          },
        },
        // 凶神方位
        inauspicious: {
          taiSui: {
            position: lunar.getDayPositionTaiSui(),
            description: lunar.getDayPositionTaiSuiDesc(),
          },
          tianSha: lunar.getDaySha(),
          chong: lunar.getDayChongDesc(),
        },
      },

      // 星宿
      constellation: {
        name: lunar.getXiu(),
        animal: lunar.getAnimal(),
        direction: `${lunar.getGong()}方${lunar.getShou()}`,
        luck: lunar.getXiuLuck(),
      },

      // 今日宜忌
      dayAdvice: {
        // 宜
        suitable: lunar.getDayYi(),
        // 忌
        unsuitable: lunar.getDayJi(),
        // 时辰宜忌
        hourlyAdvice: Array.from({ length: 12 }, (_, i) => {
          const hour = i * 2 + 1;
          const tempSolar = Solar.fromYmdHms(
            solar.getYear(),
            solar.getMonth(),
            solar.getDay(),
            hour,
            0,
            0
          );
          const tempLunar = tempSolar.getLunar();
          return {
            zhi: LunarUtil.ZHI[i + 1],
            timeRange: `${i * 2}:00-${(i * 2 + 2) % 24}:00`,
            suitable: LunarUtil.getTimeYi(lunar.getDayInGanZhi(), tempLunar.getTimeInGanZhi()),
            unsuitable: LunarUtil.getTimeJi(lunar.getDayInGanZhi(), tempLunar.getTimeInGanZhi()),
          };
        }),
      },

      // 神煞
      spirits: {
        // 今日吉神
        auspicious: lunar.getDayJiShen(),
        // 今日凶煞
        inauspicious: lunar.getDayXiongSha(),
        // 天神
        tianShen: {
          name: lunar.getDayTianShen(),
          type: lunar.getDayTianShenType(),
          luck: lunar.getDayTianShenLuck(),
        },
      },

      // 节气
      solarTerms: {
        current: currentJieQi
          ? {
              name: currentJieQi.getName(),
              date: currentJieQi.getSolar().toYmd(),
            }
          : null,
        next: nextJieQi
          ? {
              name: nextJieQi.getName(),
              date: nextJieQi.getSolar().toYmd(),
            }
          : null,
      },

      // 物候
      phenology: {
        wuHou: lunar.getWuHou(),
        yueXiang: lunar.getYueXiang(),
      },

      // 三伏/数九
      specialDays: {
        fu: lunar.getFu()?.toString() || null,
        shuJiu: lunar.getShuJiu()?.toString() || null,
      },

      // 佛道历
      festivals: {
        // 佛教节日
        buddhist: {
          festivals: FotoUtil.FESTIVAL[`${Math.abs(lunar.getMonth())}-${lunar.getDay()}`] || [],
          zhaiDay: FotoUtil.DAY_ZHAI_GUAN_YIN.includes(
            `${Math.abs(lunar.getMonth())}-${lunar.getDay()}`
          ),
          constellation: FotoUtil.getXiu(Math.abs(lunar.getMonth()), lunar.getDay()),
        },
        // 道教节日
        taoist: {
          festivals: TaoUtil.FESTIVAL[`${Math.abs(lunar.getMonth())}-${lunar.getDay()}`] || [],
          specialDays: {
            sanHui: TaoUtil.SAN_HUI.includes(`${Math.abs(lunar.getMonth())}-${lunar.getDay()}`),
            sanYuan: TaoUtil.SAN_YUAN.includes(`${Math.abs(lunar.getMonth())}-${lunar.getDay()}`),
            wuLa: TaoUtil.WU_LA.includes(`${Math.abs(lunar.getMonth())}-${lunar.getDay()}`),
          },
        },
      },

      // 法定节假日
      holidays: holidayInfo.map(h => ({
        name: h.name,
        type: h.isWork ? '调休' : '假期',
        date: h.target,
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
