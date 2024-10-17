// 农历转换工具类
export class Calendar {
  private readonly lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
  ];

  private readonly Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  private readonly Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  private readonly Animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  private readonly solarTerm = [
    "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
    "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
    "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
    "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
  ];
  private readonly lunarMonthZH = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
  private readonly lunarDayZH = [
    "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
    "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
  ];

  private readonly festivals = {
    solar: {
      "01-01": ["元旦"],
      "02-14": ["情人节"],
      "03-08": ["妇女节"],
      "03-12": ["植树节"],
      "04-01": ["愚人节"],
      "05-01": ["劳动节"],
      "05-04": ["青年节"],
      "06-01": ["儿童节"],
      "07-01": ["建党节"],
      "08-01": ["建军节"],
      "09-10": ["教师节"],
      "10-01": ["国庆节"],
      "12-25": ["圣诞节"]
    },
    lunar: {
      "01-01": ["春节"],
      "01-15": ["元宵节"],
      "05-05": ["端午节"],
      "07-07": ["七夕节"],
      "08-15": ["中秋节"],
      "09-09": ["重阳节"],
      "12-08": ["腊八节"],
      "12-23": ["小年"],
      "12-30": ["除夕"]
    }
  };

  // 获取农历年份的总天数
  private lYearDays(y: number): number {
    let i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
      sum += (this.lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return sum + this.leapDays(y);
  }

  // 获取农历年份闰月的天数
  private leapDays(y: number): number {
    if (this.leapMonth(y)) {
      return (this.lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  }

  // 获取农历年份闰月月份，如果没有闰月返回0
  private leapMonth(y: number): number {
    return this.lunarInfo[y - 1900] & 0xf;
  }

  // 获取农历年份month月的总天数
  private monthDays(y: number, m: number): number {
    return (this.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
  }

  // 获取某年的第n个节气为几日(从0小寒起算)
  private getTerm(y: number, n: number): number {
    const termInfo = [
      0, 21208, 42467, 63836, 85337, 107014, 128867, 150921,
      173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033,
      353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758
    ];
    const offDate = new Date(31556925974.7 * (y - 1900) + termInfo[n] * 60000 + Date.UTC(1900, 0, 6, 2, 5));
    return offDate.getUTCDate();
  }

  // 获取公历月份的天数
  private solarDays(y: number, m: number): number {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (m === 2) {
      return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0) ? 29 : 28;
    }
    return monthDays[m - 1];
  }

  // 公历转农历
  public solar2lunar(year: number, month: number, day: number) {
    // 参数区间1900.1.31~2100.12.31
    if (year < 1900 || year > 2100) {
      return null;
    }

    // 农历年份对应的天数
    let offset = (Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000;
    let i: number;
    let temp = 0;
    let lunarYear = 1900;

    // 确定农历年份
    for (i = 1900; i < 2101 && offset > 0; i++) {
      temp = this.lYearDays(i);
      offset -= temp;
      lunarYear++;
    }
    if (offset < 0) {
      offset += temp;
      lunarYear--;
    }

    // 获取闰月
    const leap = this.leapMonth(lunarYear);
    let isLeap = false;

    // 确定月份
    let lunarMonth = 1;
    let lunarDay;
    for (i = 1; i < 13 && offset > 0; i++) {
      // 闰月
      if (leap > 0 && i === (leap + 1) && !isLeap) {
        --i;
        isLeap = true;
        temp = this.leapDays(lunarYear);
      } else {
        temp = this.monthDays(lunarYear, i);
      }
      // 解除闰月
      if (isLeap && i === (leap + 1)) {
        isLeap = false;
      }
      offset -= temp;
      if (!isLeap) {
        lunarMonth++;
      }
    }

    // 确定日期
    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        --i;
        --lunarMonth;
      }
    }
    if (offset < 0) {
      offset += temp;
      --i;
      --lunarMonth;
    }
    lunarDay = offset + 1;

    // 获取干支年月日
    const gzYear = this.toGanZhi(lunarYear - 1900 + 36);
    const gzMonth = this.toGanZhi((year - 1900) * 12 + month + 12);
    const gzDay = this.toGanZhi(Math.floor(Date.UTC(year, month - 1, day + 1) / 86400000 + 25567 + 10));

    // 获取生肖
    const animal = this.getAnimal(lunarYear);

    // 获取节气
    const term = this.getTerm(year, (month - 1) * 2);
    const nextTerm = this.getTerm(year, (month - 1) * 2 + 1);
    let termStr = '';
    if (day === term) {
      termStr = this.solarTerm[(month - 1) * 2];
    } else if (day === nextTerm) {
      termStr = this.solarTerm[(month - 1) * 2 + 1];
    }

    // 获取节日
    const festivals = this.getFestivals(month, day, lunarMonth, lunarDay);

    return {
      lYear: lunarYear,
      lMonth: lunarMonth,
      lDay: lunarDay,
      animal: animal,
      lMonthZH: (isLeap ? "闰" : "") + this.lunarMonthZH[lunarMonth - 1] + "月",
      lDayZH: this.lunarDayZH[lunarDay - 1],
      gzYearZH: gzYear,
      gzMonthZH: gzMonth,
      gzDayZH: gzDay,
      festival: festivals.join(" "),
      term: termStr,
      isLeap: isLeap
    };
  }

  // 获取干支
  private toGanZhi(offset: number): string {
    return this.Gan[offset % 10] + this.Zhi[offset % 12];
  }

  // 获取生肖
  private getAnimal(year: number): string {
    return this.Animals[(year - 4) % 12];
  }

  // 获取节日
  private getFestivals(month: number, day: number, lunarMonth: number, lunarDay: number): string[] {
    const festivals: string[] = [];
    const solarKey = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const lunarKey = `${lunarMonth.toString().padStart(2, '0')}-${lunarDay.toString().padStart(2, '0')}`;

    if (this.festivals.solar[solarKey]) {
      festivals.push(...this.festivals.solar[solarKey]);
    }
    if (this.festivals.lunar[lunarKey]) {
      festivals.push(...this.festivals.lunar[lunarKey]);
    }

    return festivals;
  }
}
