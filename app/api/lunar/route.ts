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
      // 完整历书格式
      almanac: `${solar.toYmdHms()} ${solar.getWeekInChinese()} ${solar.getXingZuo()}座
${lunar.toString()} 
${lunar.getYearInGanZhi()}(${lunar.getYearShengXiao()})年 
${lunar.getMonthInGanZhi()}(${lunar.getMonthShengXiao()})月 
${lunar.getDayInGanZhi()}(${lunar.getDayShengXiao()})日 
${lunar.getTimeZhi()}(${lunar.getTimeShengXiao()})时 
纳音[${lunar.getYearNaYin()} ${lunar.getMonthNaYin()} ${lunar.getDayNaYin()} ${lunar.getTimeNaYin()}] 
星期${lunar.getWeekInChinese()}

${lunar.getGong()}方${lunar.getShou()}
星宿[${lunar.getXiu()}${lunar.getZheng()}${lunar.getAnimal()}](${lunar.getXiuLuck()})
彭祖百忌[${lunar.getPengZuGan()} ${lunar.getPengZuZhi()}]
喜神方位[${lunar.getDayPositionXi()}](${lunar.getDayPositionXiDesc()})
阳贵神方位[${lunar.getDayPositionYangGui()}](${lunar.getDayPositionYangGuiDesc()})
阴贵神方位[${lunar.getDayPositionYinGui()}](${lunar.getDayPositionYinGuiDesc()})
福神方位[${lunar.getDayPositionFu()}](${lunar.getDayPositionFuDesc()})
财神方位[${lunar.getDayPositionCai()}](${lunar.getDayPositionCaiDesc()})
冲[${lunar.getDayChongDesc()}]
煞[${lunar.getDaySha()}]${
        holidayInfo.length > 0
          ? '\n节假日：' + holidayInfo.map(h => h.name + (h.isWork ? '(调休)' : '')).join('，')
          : ''
      }${currentJieQi ? '\n当前节气：' + currentJieQi.getName() : ''}${
        nextJieQi ? '\n下一节气：' + nextJieQi.getName() : ''
      }`,

      // 阳历信息
      solar: {
        year: solar.getYear(),
        month: solar.getMonth(),
        day: solar.getDay(),
        dateTime: solar.toYmdHms(),
        weekDay: solar.getWeekInChinese(),
        xingZuo: solar.getXingZuo(),
        week: {
          index: solar.getWeek(),
          solarWeek: solar.getSolarWeek(1).toString(),
        },
        isLeapYear: solar.isLeapYear(),
        nextDay: solar.next(1).toYmd(),
        prevDay: solar.next(-1).toYmd(),
        festivals: solar.getFestivals(),
        otherFestivals: solar.getOtherFestivals(),
        season: {
          index: Math.ceil(solar.getMonth() / 3),
          name: ['春', '夏', '秋', '冬'][Math.ceil(solar.getMonth() / 3) - 1],
        },
        halfYear: {
          index: Math.ceil(solar.getMonth() / 6),
          name: ['上半年', '下半年'][Math.ceil(solar.getMonth() / 6) - 1],
        },
        monthInfo: {
          days: SolarUtil.getDaysOfMonth(solar.getYear(), solar.getMonth()),
          firstWeek: SolarUtil.getWeeksOfMonth(solar.getYear(), solar.getMonth(), 1),
          weeks: SolarUtil.getWeeksOfMonth(solar.getYear(), solar.getMonth(), 0),
        },
      },

      // 农历信息
      lunar: {
        // 年月日时基本信息
        year: {
          chinese: lunar.getYearInChinese(),
          ganZhi: lunar.getYearInGanZhi(),
          shengXiao: lunar.getYearShengXiao(),
          naYin: lunar.getYearNaYin(),
        },
        month: {
          chinese: lunar.getMonthInChinese(),
          ganZhi: lunar.getMonthInGanZhi(),
          shengXiao: lunar.getMonthShengXiao(),
          naYin: lunar.getMonthNaYin(),
          isLeap: lunar.getMonth() < 0,
        },
        day: {
          chinese: lunar.getDayInChinese(),
          ganZhi: lunar.getDayInGanZhi(),
          shengXiao: lunar.getDayShengXiao(),
          naYin: lunar.getDayNaYin(),
        },
        time: {
          zhi: lunar.getTimeZhi(),
          ganZhi: lunar.getTimeInGanZhi(),
          shichen: LunarUtil.convertTime(lunar.getHour().toString()),
          shengXiao: lunar.getTimeShengXiao(),
          naYin: lunar.getTimeNaYin(),
        },

        // 神煞信息
        shenSha: {
          pengZu: {
            gan: lunar.getPengZuGan(),
            zhi: lunar.getPengZuZhi(),
          },
          position: {
            xi: lunar.getDayPositionXi(),
            yangGui: lunar.getDayPositionYangGui(),
            yinGui: lunar.getDayPositionYinGui(),
            fu: lunar.getDayPositionFu(),
            cai: lunar.getDayPositionCai(),
            taiSui: lunar.getDayPositionTaiSui(),
          },
          chong: lunar.getDayChongDesc(),
          sha: lunar.getDaySha(),
        },

        // 星宿信息
        xingXiu: {
          xiu: lunar.getXiu(),
          zheng: lunar.getZheng(),
          animal: lunar.getAnimal(),
          gong: lunar.getGong(),
          shou: lunar.getShou(),
          luck: lunar.getXiuLuck(),
          song: lunar.getXiuSong(),
        },

        // 节气
        jieQi: {
          current: currentJieQi
            ? {
                name: currentJieQi.getName(),
                solar: currentJieQi.getSolar().toYmd(),
              }
            : null,
          next: nextJieQi
            ? {
                name: nextJieQi.getName(),
                solar: nextJieQi.getSolar().toYmd(),
              }
            : null,
        },

        // 八字
        baZi: {
          array: lunar.getBaZi(),
          wuXing: lunar.getBaZiWuXing(),
          naYin: lunar.getBaZiNaYin(),
          shiShen: {
            gan: lunar.getBaZiShiShenGan(),
            zhi: lunar.getBaZiShiShenZhi(),
          },
          hideGan: {
            year: lunar.getEightChar().getYearHideGan(),
            month: lunar.getEightChar().getMonthHideGan(),
            day: lunar.getEightChar().getDayHideGan(),
            time: lunar.getEightChar().getTimeHideGan(),
          },
          diShi: {
            year: lunar.getEightChar().getYearDiShi(),
            month: lunar.getEightChar().getMonthDiShi(),
            day: lunar.getEightChar().getDayDiShi(),
            time: lunar.getEightChar().getTimeDiShi(),
          },
          xunKong: {
            year: lunar.getEightChar().getYearXunKong(),
            month: lunar.getEightChar().getMonthXunKong(),
            day: lunar.getEightChar().getDayXunKong(),
            time: lunar.getEightChar().getTimeXunKong(),
          },
          gong: {
            taiYuan: {
              ganZhi: lunar.getEightChar().getTaiYuan(),
              naYin: lunar.getEightChar().getTaiYuanNaYin(),
            },
            taiXi: {
              ganZhi: lunar.getEightChar().getTaiXi(),
              naYin: lunar.getEightChar().getTaiXiNaYin(),
            },
            ming: {
              ganZhi: lunar.getEightChar().getMingGong(),
              naYin: lunar.getEightChar().getMingGongNaYin(),
            },
            shen: {
              ganZhi: lunar.getEightChar().getShenGong(),
              naYin: lunar.getEightChar().getShenGongNaYin(),
            },
          },
        },

        // 九星
        nineStar: {
          year: lunar.getYearNineStar().toString(),
          month: lunar.getMonthNineStar().toString(),
          day: lunar.getDayNineStar().toString(),
          time: lunar.getTimeNineStar().toString(),
          detail: {
            year: {
              number: lunar.getYearNineStar().getNumber(),
              color: lunar.getYearNineStar().getColor(),
              wuXing: lunar.getYearNineStar().getWuXing(),
              position: lunar.getYearNineStar().getPosition(),
              positionDesc: lunar.getYearNineStar().getPositionDesc(),
              nameInXuanKong: lunar.getYearNineStar().getNameInXuanKong(),
              nameInBeiDou: lunar.getYearNineStar().getNameInBeiDou(),
              nameInQiMen: lunar.getYearNineStar().getNameInQiMen(),
              nameInTaiYi: lunar.getYearNineStar().getNameInTaiYi(),
              typeInTaiYi: lunar.getYearNineStar().getTypeInTaiYi(),
              songInTaiYi: lunar.getYearNineStar().getSongInTaiYi(),
              baMenInQiMen: lunar.getYearNineStar().getBaMenInQiMen(),
              luckInQiMen: lunar.getYearNineStar().getLuckInQiMen(),
              yinYangInQiMen: lunar.getYearNineStar().getYinYangInQiMen(),
            },
            month: {
              number: lunar.getMonthNineStar().getNumber(),
              color: lunar.getMonthNineStar().getColor(),
              wuXing: lunar.getMonthNineStar().getWuXing(),
              position: lunar.getMonthNineStar().getPosition(),
              positionDesc: lunar.getMonthNineStar().getPositionDesc(),
              nameInXuanKong: lunar.getMonthNineStar().getNameInXuanKong(),
              nameInBeiDou: lunar.getMonthNineStar().getNameInBeiDou(),
              nameInQiMen: lunar.getMonthNineStar().getNameInQiMen(),
              nameInTaiYi: lunar.getMonthNineStar().getNameInTaiYi(),
              typeInTaiYi: lunar.getMonthNineStar().getTypeInTaiYi(),
              songInTaiYi: lunar.getMonthNineStar().getSongInTaiYi(),
              baMenInQiMen: lunar.getMonthNineStar().getBaMenInQiMen(),
              luckInQiMen: lunar.getMonthNineStar().getLuckInQiMen(),
              yinYangInQiMen: lunar.getMonthNineStar().getYinYangInQiMen(),
            },
            day: {
              number: lunar.getDayNineStar().getNumber(),
              color: lunar.getDayNineStar().getColor(),
              wuXing: lunar.getDayNineStar().getWuXing(),
              position: lunar.getDayNineStar().getPosition(),
              positionDesc: lunar.getDayNineStar().getPositionDesc(),
              nameInXuanKong: lunar.getDayNineStar().getNameInXuanKong(),
              nameInBeiDou: lunar.getDayNineStar().getNameInBeiDou(),
              nameInQiMen: lunar.getDayNineStar().getNameInQiMen(),
              nameInTaiYi: lunar.getDayNineStar().getNameInTaiYi(),
              typeInTaiYi: lunar.getDayNineStar().getTypeInTaiYi(),
              songInTaiYi: lunar.getDayNineStar().getSongInTaiYi(),
              baMenInQiMen: lunar.getDayNineStar().getBaMenInQiMen(),
              luckInQiMen: lunar.getDayNineStar().getLuckInQiMen(),
              yinYangInQiMen: lunar.getDayNineStar().getYinYangInQiMen(),
            },
            time: {
              number: lunar.getTimeNineStar().getNumber(),
              color: lunar.getTimeNineStar().getColor(),
              wuXing: lunar.getTimeNineStar().getWuXing(),
              position: lunar.getTimeNineStar().getPosition(),
              positionDesc: lunar.getTimeNineStar().getPositionDesc(),
              nameInXuanKong: lunar.getTimeNineStar().getNameInXuanKong(),
              nameInBeiDou: lunar.getTimeNineStar().getNameInBeiDou(),
              nameInQiMen: lunar.getTimeNineStar().getNameInQiMen(),
              nameInTaiYi: lunar.getTimeNineStar().getNameInTaiYi(),
              typeInTaiYi: lunar.getTimeNineStar().getTypeInTaiYi(),
              songInTaiYi: lunar.getTimeNineStar().getSongInTaiYi(),
              baMenInQiMen: lunar.getTimeNineStar().getBaMenInQiMen(),
              luckInQiMen: lunar.getTimeNineStar().getLuckInQiMen(),
              yinYangInQiMen: lunar.getTimeNineStar().getYinYangInQiMen(),
            },
          },
        },

        // 宜忌
        yiJi: {
          time: {
            yi: lunar.getTimeYi(),
            ji: lunar.getTimeJi(),
            allTimes: Array.from({ length: 12 }, (_, i) => {
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
                yi: LunarUtil.getTimeYi(lunar.getDayInGanZhi(), tempLunar.getTimeInGanZhi()),
                ji: LunarUtil.getTimeJi(lunar.getDayInGanZhi(), tempLunar.getTimeInGanZhi()),
              };
            }),
          },
          day: {
            yi: lunar.getDayYi(),
            ji: lunar.getDayJi(),
          },
        },

        // 其他信息
        other: {
          tianShen: {
            name: lunar.getDayTianShen(),
            type: lunar.getDayTianShenType(),
            luck: lunar.getDayTianShenLuck(),
          },
          jiShen: lunar.getDayJiShen(),
          xiongSha: lunar.getDayXiongSha(),
          liuYao: lunar.getLiuYao(),
          wuHou: lunar.getWuHou(),
          yueXiang: lunar.getYueXiang(),
          fu: lunar.getFu()?.toString() || null,
          shuJiu: lunar.getShuJiu()?.toString() || null,
        },

        // 佛道历
        festivals: {
          foto: {
            festivals: FotoUtil.FESTIVAL[`${lunar.getMonth()}-${lunar.getDay()}`] || [],
            dayZhaiGuanYin: FotoUtil.DAY_ZHAI_GUAN_YIN.includes(
              `${lunar.getMonth()}-${lunar.getDay()}`
            ),
            xiu: FotoUtil.getXiu(lunar.getMonth(), lunar.getDay()),
          },
          tao: {
            festivals: TaoUtil.FESTIVAL[`${lunar.getMonth()}-${lunar.getDay()}`] || [],
            sanHui: TaoUtil.SAN_HUI.includes(`${lunar.getMonth()}-${lunar.getDay()}`),
            sanYuan: TaoUtil.SAN_YUAN.includes(`${lunar.getMonth()}-${lunar.getDay()}`),
            wuLa: TaoUtil.WU_LA.includes(`${lunar.getMonth()}-${lunar.getDay()}`),
          },
        },
      },

      // 节假日信息
      holidays: holidayInfo,
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
