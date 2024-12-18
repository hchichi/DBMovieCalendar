import { NextRequest, NextResponse } from 'next/server';
import { Solar } from '../../../../src/lib/Solar';
import { HolidayUtil } from '../../../../src/lib/HolidayUtil';
import { I18n } from '../../../../src/lib/I18n';

// 初始化 I18n
I18n.init();
// 设置语言为中文
I18n.setLanguage('chs');

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const dateStr = params.date;
    console.log('Requested date:', dateStr);

    // 解析日期字符串
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) {
      return NextResponse.json(
        { error: 'Invalid date format. Please use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // 创建 Solar 对象
    const solar = Solar.fromYmd(year, month, day);
    console.log('Solar object:', solar);

    const lunar = solar.getLunar();
    console.log('Lunar object:', lunar);

    // 获取节假日信息
    const solarYmd = solar.toYmd();
    const holidays = HolidayUtil.getHolidays(solarYmd);
    const holidayInfo = holidays.map(h => ({
      name: h.getName(),
      isWork: h.isWork(),
      target: h.getTarget()
    }));

    // 获取当前节气
    const currentJieQi = lunar.getCurrentJieQi();
    const nextJieQi = lunar.getNextJieQi();

    const result = {
      // 完整的历书格式信息
      almanac: `${solar.toYmdHms()} ${solar.getWeekInChinese()} ${solar.getXingZuo()}座
${lunar.toString()} 
${lunar.getYearInGanZhi()}(${lunar.getYearShengXiao()})年 
${lunar.getMonthInGanZhi()}(${lunar.getMonthShengXiao()})月 
${lunar.getDayInGanZhi()}(${lunar.getDayShengXiao()})日 
${lunar.getTimeZhi()}(${lunar.getTimeShengXiao()})时 
纳音[${lunar.getYearNaYin()} ${lunar.getMonthNaYin()} ${lunar.getDayNaYin()} ${lunar.getTimeNaYin()}] 
星期${lunar.getWeekInChinese()}
${lunar.getFestivals().map(f => `(${f})`).join(' ')}${lunar.getOtherFestivals().map(f => `(${f})`).join(' ')}
${lunar.getGong()}方${lunar.getShou()}
星宿[${lunar.getXiu()}${lunar.getZheng()}${lunar.getAnimal()}](${lunar.getXiuLuck()})
彭祖百忌[${lunar.getPengZuGan()} ${lunar.getPengZuZhi()}]
喜神方位[${lunar.getDayPositionXi()}](${lunar.getDayPositionXiDesc()})
阳贵神方位[${lunar.getDayPositionYangGui()}](${lunar.getDayPositionYangGuiDesc()})
阴贵神方位[${lunar.getDayPositionYinGui()}](${lunar.getDayPositionYinGuiDesc()})
福神方位[${lunar.getDayPositionFu()}](${lunar.getDayPositionFuDesc()})
财神方位[${lunar.getDayPositionCai()}](${lunar.getDayPositionCaiDesc()})
冲[${lunar.getDayChongDesc()}]
煞[${lunar.getDaySha()}]${holidayInfo.length > 0 ? '\n节假日：' + holidayInfo.map(h => h.name + (h.isWork ? '(调休)' : '')).join('，') : ''}${currentJieQi ? '\n当前节气：' + currentJieQi.getName() : ''}${nextJieQi ? '\n下一节气：' + nextJieQi.getName() : ''}`,

      // 分项数据
      solar: {
        year: solar.getYear(),
        month: solar.getMonth(),
        day: solar.getDay(),
        dateTime: solar.toYmdHms(),
        weekDay: solar.getWeekInChinese(),
        xingZuo: solar.getXingZuo(),
      },
      lunar: {
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
        },
        day: {
          chinese: lunar.getDayInChinese(),
          ganZhi: lunar.getDayInGanZhi(),
          shengXiao: lunar.getDayShengXiao(),
          naYin: lunar.getDayNaYin(),
        },
        time: {
          chinese: lunar.getTimeZhi(),
          shengXiao: lunar.getTimeShengXiao(),
          naYin: lunar.getTimeNaYin(),
        },
        // 神煞
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
        },
        // 星宿
        xingXiu: {
          name: lunar.getXiu(),
          animal: lunar.getAnimal(),
          luck: lunar.getXiuLuck(),
          shou: lunar.getShou(),
        },
        // 节气
        jieQi: {
          current: currentJieQi ? {
            name: currentJieQi.getName(),
            solar: currentJieQi.getSolar().toYmd()
          } : null,
          next: nextJieQi ? {
            name: nextJieQi.getName(),
            solar: nextJieQi.getSolar().toYmd()
          } : null
        },
        // 八字
        baZi: {
          array: lunar.getBaZi(),
          wuXing: lunar.getBaZiWuXing(),
          naYin: lunar.getBaZiNaYin(),
          shiShen: {
            gan: lunar.getBaZiShiShenGan(),
            zhi: lunar.getBaZiShiShenZhi(),
          }
        },
        // 吉神方位
        jiShen: lunar.getDayJiShen(),
        // 凶煞方位
        xiongSha: lunar.getDayXiongSha(),
        // 时辰吉凶
        time: {
          yi: lunar.getTimeYi(),
          ji: lunar.getTimeJi(),
        },
        // 月相
        yueXiang: lunar.getYueXiang(),
        // 值日天神
        tianShen: {
          name: lunar.getDayTianShen(),
          type: lunar.getDayTianShenType(),
          luck: lunar.getDayTianShenLuck(),
        },
        // 九星
        nineStar: {
          year: lunar.getYearNineStar().toString(),
          month: lunar.getMonthNineStar().toString(),
          day: lunar.getDayNineStar().toString(),
          time: lunar.getTimeNineStar().toString(),
        },
        // 宜忌
        dayYiJi: {
          yi: lunar.getDayYi(),
          ji: lunar.getDayJi(),
        },
        // 六曜
        liuYao: lunar.getLiuYao(),
        // 物候
        wuHou: lunar.getWuHou(),
      },
      // 节假日信息
      holidays: holidayInfo
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
