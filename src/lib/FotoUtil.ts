import { FotoFestival } from './FotoFestival';

export class FotoUtil {
  static DAY_ZHAI_GUAN_YIN: string[] = [
    '1-8',
    '2-7',
    '2-9',
    '2-19',
    '3-3',
    '3-6',
    '3-13',
    '4-22',
    '5-3',
    '5-17',
    '6-16',
    '6-18',
    '6-19',
    '6-23',
    '7-13',
    '8-16',
    '9-19',
    '9-23',
    '10-2',
    '11-19',
    '11-24',
    '12-25',
  ];
  static XIU_27: string[] = [
    '{xx.jiao}',
    '{xx.kang}',
    '{xx.di}',
    '{xx.fang}',
    '{xx.xin}',
    '{xx.tail}',
    '{xx.ji}',
    '{xx.dou}',
    '{xx.nv}',
    '{xx.xu}',
    '{xx.wei}',
    '{xx.shi}',
    '{xx.qiang}',
    '{xx.kui}',
    '{xx.lou}',
    '{xx.vei}',
    '{xx.mao}',
    '{xx.bi}',
    '{xx.zi}',
    '{xx.can}',
    '{xx.jing}',
    '{xx.gui}',
    '{xx.liu}',
    '{xx.xing}',
    '{xx.zhang}',
    '{xx.yi}',
    '{xx.zhen}',
  ];
  private static XIU_OFFSET: number[] = [11, 13, 15, 17, 19, 21, 24, 0, 2, 4, 7, 9];
  static _DJ = '犯者夺纪';
  static _JS = '犯者减寿';
  static _SS = '犯者损寿';
  static _XL = '犯者削禄夺纪';
  static _JW = '犯者三年内夫妇俱亡';

  static _Y = new FotoFestival('杨公忌');
  static _T = new FotoFestival('四天王巡行', '', true);
  static _D = new FotoFestival('斗降', FotoUtil._DJ, true);
  static _S = new FotoFestival('月朔', FotoUtil._DJ, true);
  static _W = new FotoFestival('月望', FotoUtil._DJ, true);
  static _H = new FotoFestival('月晦', FotoUtil._JS, true);
  static _L = new FotoFestival('雷斋日', FotoUtil._JS, true);
  static _J = new FotoFestival('九毒日', '犯者夭亡，奇祸不测');
  static _R = new FotoFestival('人神在阴', '犯者得病', true, '宜先一日即戒');
  static _M = new FotoFestival('司命奏事', FotoUtil._JS, true, '如月小，即戒廿九');
  static _HH = new FotoFestival('月晦', FotoUtil._JS, true, '如月小，即戒廿九');

  static FESTIVAL: { [key: string]: FotoFestival[] } = {
    '1-1': [new FotoFestival('天腊，玉帝校世人神气禄命', FotoUtil._XL), FotoUtil._S],
    '1-3': [new FotoFestival('万神都会', FotoUtil._DJ), FotoUtil._D],
    '1-5': [new FotoFestival('五虚忌')],
    '1-6': [new FotoFestival('六耗忌'), FotoUtil._L],
    '1-7': [new FotoFestival('上会日', FotoUtil._SS)],
    '1-8': [new FotoFestival('五殿阎罗天子诞', FotoUtil._DJ), FotoUtil._T],
    '1-9': [new FotoFestival('玉皇上帝诞', FotoUtil._DJ)],
    '1-13': [FotoUtil._Y],
    '1-14': [new FotoFestival('三元降', FotoUtil._JS), FotoUtil._T],
    '1-15': [
      new FotoFestival('三元降', FotoUtil._JS),
      new FotoFestival('上元神会', FotoUtil._DJ),
      FotoUtil._W,
      FotoUtil._T,
    ],
    '1-16': [new FotoFestival('三元降', FotoUtil._JS)],
    '1-19': [new FotoFestival('长春真人诞')],
    '1-23': [new FotoFestival('三尸神奏事'), FotoUtil._T],
    '1-25': [FotoUtil._H, new FotoFestival('天地仓开日', '犯者损寿，子带疾')],
    '1-27': [FotoUtil._D],
    '1-28': [FotoUtil._R],
    '1-29': [FotoUtil._T],
    '1-30': [FotoUtil._HH, FotoUtil._M, FotoUtil._T],
    '2-1': [new FotoFestival('一殿秦广王诞', FotoUtil._DJ), FotoUtil._S],
    '2-2': [
      new FotoFestival('万神都会', FotoUtil._DJ),
      new FotoFestival('福德土地正神诞', '犯者得祸'),
    ],
    '2-3': [new FotoFestival('文昌帝君诞', FotoUtil._XL), FotoUtil._D],
    '2-6': [new FotoFestival('东华帝君诞'), FotoUtil._L],
    '2-8': [
      new FotoFestival('释迦牟尼佛出家', FotoUtil._DJ),
      new FotoFestival('三殿宋帝王诞', FotoUtil._DJ),
      new FotoFestival('张大帝诞', FotoUtil._DJ),
      FotoUtil._T,
    ],
    '2-11': [FotoUtil._Y],
    '2-14': [FotoUtil._T],
    '2-15': [
      new FotoFestival('释迦牟尼佛涅槃', FotoUtil._XL),
      new FotoFestival('太上老君诞', FotoUtil._XL),
      new FotoFestival('月望', FotoUtil._XL, true),
      FotoUtil._T,
    ],
    '2-17': [new FotoFestival('东方杜将军诞')],
    '2-18': [
      new FotoFestival('四殿五官王诞', FotoUtil._XL),
      new FotoFestival('至圣先师孔子讳辰', FotoUtil._XL),
    ],
    '2-19': [new FotoFestival('观音大士诞', FotoUtil._DJ)],
    '2-21': [new FotoFestival('普贤菩萨诞')],
    '2-23': [FotoUtil._T],
    '2-25': [FotoUtil._H],
    '2-27': [FotoUtil._D],
    '2-28': [FotoUtil._R],
    '2-29': [FotoUtil._T],
    '2-30': [FotoUtil._HH, FotoUtil._M, FotoUtil._T],
    '3-1': [new FotoFestival('二殿楚江王诞', FotoUtil._DJ), FotoUtil._S],
    '3-3': [new FotoFestival('玄天上帝诞', FotoUtil._DJ), FotoUtil._D],
    '3-6': [FotoUtil._L],
    '3-8': [new FotoFestival('六殿卞城王诞', FotoUtil._DJ), FotoUtil._T],
    '3-9': [new FotoFestival('牛鬼神出', '犯者产恶胎'), FotoUtil._Y],
    '3-12': [new FotoFestival('中央五道诞')],
    '3-14': [FotoUtil._T],
    '3-15': [
      new FotoFestival('昊天上帝诞', FotoUtil._DJ),
      new FotoFestival('玄坛诞', FotoUtil._DJ),
      FotoUtil._W,
      FotoUtil._T,
    ],
    '3-16': [new FotoFestival('准提菩萨诞', FotoUtil._DJ)],
    '3-19': [
      new FotoFestival('中岳大帝诞'),
      new FotoFestival('后土娘娘诞'),
      new FotoFestival('三茅降'),
    ],
    '3-20': [new FotoFestival('天地仓开日', FotoUtil._SS), new FotoFestival('子孙娘娘诞')],
    '3-23': [FotoUtil._T],
    '3-25': [FotoUtil._H],
    '3-27': [new FotoFestival('七殿泰山王诞'), FotoUtil._D],
    '3-28': [
      FotoUtil._R,
      new FotoFestival('苍颉至圣先师诞', FotoUtil._XL),
      new FotoFestival('东岳大帝诞'),
    ],
    '3-29': [FotoUtil._T],
    '3-30': [FotoUtil._HH, FotoUtil._M, FotoUtil._T],
    '4-1': [new FotoFestival('八殿都市王诞', FotoUtil._DJ), FotoUtil._S],
    '4-3': [FotoUtil._D],
    '4-4': [new FotoFestival('万神善会', '犯者失瘼夭胎'), new FotoFestival('文殊菩萨诞')],
    '4-6': [FotoUtil._L],
    '4-7': [new FotoFestival('南斗、北斗、西斗同降', FotoUtil._JS), FotoUtil._Y],
    '4-8': [
      new FotoFestival('释迦牟尼佛诞', FotoUtil._DJ),
      new FotoFestival('万神善会', '犯者失瘼夭胎'),
      new FotoFestival('善恶童子降', '犯者血死'),
      new FotoFestival('九殿平等王诞'),
      FotoUtil._T,
    ],
    '4-14': [new FotoFestival('纯阳祖师诞', FotoUtil._JS), FotoUtil._T],
    '4-15': [FotoUtil._W, new FotoFestival('钟离祖师诞'), FotoUtil._T],
    '4-16': [new FotoFestival('天地仓开日', FotoUtil._SS)],
    '4-17': [new FotoFestival('十殿转轮王诞', FotoUtil._DJ)],
    '4-18': [
      new FotoFestival('天地仓开日', FotoUtil._SS),
      new FotoFestival('紫徽大帝诞', FotoUtil._SS),
    ],
    '4-20': [new FotoFestival('眼光圣母诞')],
    '4-23': [FotoUtil._T],
    '4-25': [FotoUtil._H],
    '4-27': [FotoUtil._D],
    '4-28': [FotoUtil._R],
    '4-29': [FotoUtil._T],
    '4-30': [FotoUtil._HH, FotoUtil._M, FotoUtil._T],
    '5-1': [new FotoFestival('南极长生大帝诞', FotoUtil._DJ), FotoUtil._S],
    '5-3': [FotoUtil._D],
    '5-5': [
      new FotoFestival('地腊', FotoUtil._XL),
      new FotoFestival('五帝校定生人官爵', FotoUtil._XL),
      FotoUtil._J,
      FotoUtil._Y,
    ],
    '5-6': [FotoUtil._J, FotoUtil._L],
    '5-7': [FotoUtil._J],
    '5-8': [new FotoFestival('南方五道诞'), FotoUtil._T],
    '5-11': [new FotoFestival('天地仓开日', FotoUtil._SS), new FotoFestival('天下都城隍诞')],
    '5-12': [new FotoFestival('炳灵公诞')],
    '5-13': [new FotoFestival('关圣降', FotoUtil._XL)],
    '5-14': [new FotoFestival('夜子时为天地交泰', FotoUtil._JW), FotoUtil._T],
    '5-15': [FotoUtil._W, FotoUtil._J, FotoUtil._T],
    '5-16': [
      new FotoFestival('九毒日', FotoUtil._JW),
      new FotoFestival('天地元气造化万物之辰', FotoUtil._JW),
    ],
    '5-17': [FotoUtil._J],
    '5-18': [new FotoFestival('张天师诞')],
    '5-22': [new FotoFestival('孝娥神诞', FotoUtil._DJ)],
    '5-23': [FotoUtil._T],
    '5-25': [FotoUtil._J, FotoUtil._H],
    '5-26': [FotoUtil._J],
    '5-27': [FotoUtil._J, FotoUtil._D],
    '5-28': [FotoUtil._R],
    '5-29': [FotoUtil._T],
    '5-30': [FotoUtil._HH, FotoUtil._M, FotoUtil._T],
    '6-1': [FotoUtil._S],
    '6-3': [new FotoFestival('韦驮菩萨圣诞'), FotoUtil._D, FotoUtil._Y],
    '6-5': [new FotoFestival('南赡部洲转大轮', FotoUtil._SS)],
    '6-6': [new FotoFestival('天地仓开日', FotoUtil._SS), FotoUtil._L],
    '6-8': [FotoUtil._T],
    '6-10': [new FotoFestival('金粟如来诞')],
    '6-14': [FotoUtil._T],
    '6-15': [FotoUtil._W, FotoUtil._T],
    '6-19': [new FotoFestival('观世音菩萨成道', FotoUtil._DJ)],
    '6-23': [new FotoFestival('南方火神诞', '犯者遭回禄'), FotoUtil._T],
    '6-24': [new FotoFestival('雷祖诞', FotoUtil._XL), new FotoFestival('关帝诞', FotoUtil._XL)],
    '6-25': [FotoUtil._H],
    '6-27': [FotoUtil._D],
    '6-28': [FotoUtil._R],
    '6-29': [FotoUtil._T],
    '6-30': [FotoUtil._HH, FotoUtil._M, FotoUtil._T],
    '7-1': [FotoUtil._S, FotoUtil._Y],
    '7-3': [FotoUtil._D],
    '7-5': [new FotoFestival('中会日', FotoUtil._SS, false, '一作初七')],
    '7-6': [FotoUtil._L],
    '7-7': [
      new FotoFestival('道德腊', FotoUtil._XL),
      new FotoFestival('五帝校生人善恶', FotoUtil._XL),
      new FotoFestival('魁星诞', FotoUtil._XL),
    ],
    '7-8': [FotoUtil._T],
    '7-10': [new FotoFestival('阴毒日', '', false, '大忌')],
    '7-12': [new FotoFestival('长真谭真人诞')],
    '7-13': [new FotoFestival('大势至菩萨诞', FotoUtil._JS)],
    '7-14': [new FotoFestival('三元降', FotoUtil._JS), FotoUtil._T],
    '7-15': [
      FotoUtil._W,
      new FotoFestival('三元降', FotoUtil._DJ),
      new FotoFestival('地官校籍', FotoUtil._DJ),
      FotoUtil._T,
    ],
    '7-16': [new FotoFestival('三元降', FotoUtil._JS)],
    '7-18': [new FotoFestival('西王母诞', FotoUtil._DJ)],
    '7-19': [new FotoFestival('太岁诞', FotoUtil._DJ)],
    '7-22': [new FotoFestival('增福财神诞', FotoUtil._XL)],
    '7-23': [FotoUtil._T],
    '7-25': [FotoUtil._H],
    '7-27': [FotoUtil._D],
    '7-28': [FotoUtil._R],
    '7-29': [FotoUtil._Y, FotoUtil._T],
    '7-30': [new FotoFestival('地藏菩萨诞', FotoUtil._DJ), FotoUtil._HH, FotoUtil._M, FotoUtil._T],
    '8-1': [FotoUtil._S, new FotoFestival('许真君诞')],
    '8-3': [
      FotoUtil._D,
      new FotoFestival('北斗诞', FotoUtil._XL),
      new FotoFestival('司命灶君诞', '犯者遭回禄'),
    ],
    '8-5': [new FotoFestival('雷声大帝诞', FotoUtil._DJ)],
    '8-6': [FotoUtil._L],
    '8-8': [FotoUtil._T],
    '8-10': [new FotoFestival('北斗大帝诞')],
    '8-12': [new FotoFestival('西方五道诞')],
    '8-14': [FotoUtil._T],
    '8-15': [
      FotoUtil._W,
      new FotoFestival('太明朝元', '犯者暴亡', false, '宜焚香守夜'),
      FotoUtil._T,
    ],
    '8-16': [new FotoFestival('天曹掠刷真君降', '犯者贫夭')],
    '8-18': [new FotoFestival('天人兴福之辰', '', false, '宜斋戒，存想吉事')],
    '8-23': [new FotoFestival('汉恒候张显王诞'), FotoUtil._T],
    '8-24': [new FotoFestival('灶君夫人诞')],
    '8-25': [FotoUtil._H],
    '8-27': [FotoUtil._D, new FotoFestival('至圣先师孔子诞', FotoUtil._XL), FotoUtil._Y],
    '8-28': [FotoUtil._R, new FotoFestival('四天会事')],
    '8-29': [FotoUtil._T],
    '8-30': [new FotoFestival('诸神考校', '犯者夺算'), FotoUtil._HH, FotoUtil._M, FotoUtil._T],
    '9-1': [
      FotoUtil._S,
      new FotoFestival('南斗诞', FotoUtil._XL),
      new FotoFestival('北斗九星降世', FotoUtil._DJ, false, '此九日俱宜斋戒'),
    ],
    '9-3': [FotoUtil._D, new FotoFestival('五瘟神诞')],
    '9-6': [FotoUtil._L],
    '9-8': [FotoUtil._T],
    '9-9': [
      new FotoFestival('斗母诞', FotoUtil._XL),
      new FotoFestival('酆都大帝诞'),
      new FotoFestival('玄天上帝飞升'),
    ],
    '9-10': [new FotoFestival('斗母降', FotoUtil._DJ)],
    '9-11': [new FotoFestival('宜戒')],
    '9-13': [new FotoFestival('孟婆尊神诞')],
    '9-14': [FotoUtil._T],
    '9-15': [FotoUtil._W, FotoUtil._T],
    '9-17': [new FotoFestival('金龙四大王诞', '犯者遭水厄')],
    '9-19': [
      new FotoFestival('日宫月宫会合', FotoUtil._JS),
      new FotoFestival('观世音菩萨诞', FotoUtil._JS),
    ],
    '9-23': [FotoUtil._T],
    '9-25': [FotoUtil._H, FotoUtil._Y],
    '9-27': [FotoUtil._D],
    '9-28': [FotoUtil._R],
    '9-29': [FotoUtil._T],
    '9-30': [
      new FotoFestival('药师琉璃光佛诞', '犯者危疾'),
      FotoUtil._HH,
      FotoUtil._M,
      FotoUtil._T,
    ],
    '10-1': [
      FotoUtil._S,
      new FotoFestival('民岁腊', FotoUtil._DJ),
      new FotoFestival('四天王降', '犯者一年内死'),
    ],
    '10-3': [FotoUtil._D, new FotoFestival('三茅诞')],
    '10-5': [
      new FotoFestival('下会日', FotoUtil._JS),
      new FotoFestival('达摩祖师诞', FotoUtil._JS),
    ],
    '10-6': [FotoUtil._L, new FotoFestival('天曹考察', FotoUtil._DJ)],
    '10-8': [new FotoFestival('佛涅槃日', '', false, '大忌色欲'), FotoUtil._T],
    '10-10': [new FotoFestival('四天王降', '犯者一年内死')],
    '10-11': [new FotoFestival('宜戒')],
    '10-14': [new FotoFestival('三元降', FotoUtil._JS), FotoUtil._T],
    '10-15': [
      FotoUtil._W,
      new FotoFestival('三元降', FotoUtil._DJ),
      new FotoFestival('下元水府校籍', FotoUtil._DJ),
      FotoUtil._T,
    ],
    '10-16': [new FotoFestival('三元降', FotoUtil._JS), FotoUtil._T],
    '10-23': [FotoUtil._Y, FotoUtil._T],
    '10-25': [FotoUtil._H],
    '10-27': [FotoUtil._D, new FotoFestival('北极紫徽大帝降')],
    '10-28': [FotoUtil._R],
    '10-29': [FotoUtil._T],
    '10-30': [FotoUtil._HH, FotoUtil._M, FotoUtil._T],
    '11-1': [FotoUtil._S],
    '11-3': [FotoUtil._D],
    '11-4': [new FotoFestival('至圣先师孔子诞', FotoUtil._XL)],
    '11-6': [new FotoFestival('西岳大帝诞')],
    '11-8': [FotoUtil._T],
    '11-11': [
      new FotoFestival('天地仓开日', FotoUtil._DJ),
      new FotoFestival('太乙救苦天尊诞', FotoUtil._DJ),
    ],
    '11-14': [FotoUtil._T],
    '11-15': [
      new FotoFestival('月望', '上半夜犯男死 下半夜犯女死'),
      new FotoFestival('四天王巡行', '上半夜犯男死 下半夜犯女死'),
    ],
    '11-17': [new FotoFestival('阿弥陀佛诞')],
    '11-19': [new FotoFestival('太阳日宫诞', '犯者得奇祸')],
    '11-21': [FotoUtil._Y],
    '11-23': [new FotoFestival('张仙诞', '犯者绝嗣'), FotoUtil._T],
    '11-25': [new FotoFestival('掠刷大夫降', '犯者遭大凶'), FotoUtil._H],
    '11-26': [new FotoFestival('北方五道诞')],
    '11-27': [FotoUtil._D],
    '11-28': [FotoUtil._R],
    '11-29': [FotoUtil._T],
    '11-30': [FotoUtil._HH, FotoUtil._M, FotoUtil._T],
    '12-1': [FotoUtil._S],
    '12-3': [FotoUtil._D],
    '12-6': [new FotoFestival('天地仓开日', FotoUtil._JS), FotoUtil._L],
    '12-7': [new FotoFestival('掠刷大夫降', '犯者得恶疾')],
    '12-8': [
      new FotoFestival('王侯腊', FotoUtil._DJ),
      new FotoFestival('释迦如来成佛之辰'),
      FotoUtil._T,
      new FotoFestival('初旬内戊日，亦名王侯腊', FotoUtil._DJ),
    ],
    '12-12': [new FotoFestival('太素三元君朝真')],
    '12-14': [FotoUtil._T],
    '12-15': [FotoUtil._W, FotoUtil._T],
    '12-16': [new FotoFestival('南岳大帝诞')],
    '12-19': [FotoUtil._Y],
    '12-20': [new FotoFestival('天地交道', '犯者促寿')],
    '12-21': [new FotoFestival('天猷上帝诞')],
    '12-23': [new FotoFestival('五岳诞降'), FotoUtil._T],
    '12-24': [new FotoFestival('司今朝天奏人善恶', '犯者得大祸')],
    '12-25': [new FotoFestival('三清玉帝同降，考察善恶', '犯者得奇祸'), FotoUtil._H],
    '12-27': [FotoUtil._D],
    '12-28': [FotoUtil._R],
    '12-29': [new FotoFestival('华严菩萨诞'), FotoUtil._T],
    '12-30': [new FotoFestival('诸神下降，察访善恶', '犯者男女俱亡')],
  };

  static OTHER_FESTIVAL: { [key: string]: string[] } = {
    '1-1': ['弥勒菩萨圣诞'],
    '1-6': ['定光佛圣诞'],
    '2-8': ['释迦牟尼佛出家'],
    '2-15': ['释迦牟尼佛涅槃'],
    '2-19': ['观世音菩萨圣诞'],
    '2-21': ['普贤菩萨圣诞'],
    '3-16': ['准提菩萨圣诞'],
    '4-4': ['文殊菩萨圣诞'],
    '4-8': ['释迦牟尼佛圣诞'],
    '4-15': ['佛吉祥日'],
    '4-28': ['药王菩萨圣诞'],
    '5-13': ['伽蓝菩萨圣诞'],
    '6-3': ['韦驮菩萨圣诞'],
    '6-19': ['观音菩萨成道'],
    '7-13': ['大势至菩萨圣诞'],
    '7-15': ['佛欢喜日'],
    '7-24': ['龙树菩萨圣诞'],
    '7-30': ['地藏菩萨圣诞'],
    '8-15': ['月光菩萨圣诞'],
    '8-22': ['燃灯佛圣诞'],
    '9-9': ['摩利支天菩萨圣诞'],
    '9-19': ['观世音菩萨出家'],
    '9-30': ['药师琉璃光佛圣诞'],
    '10-5': ['达摩祖师圣诞'],
    '10-20': ['文殊菩萨出家'],
    '11-17': ['阿弥陀佛圣诞'],
    '11-19': ['日光菩萨圣诞'],
    '12-8': ['释迦牟尼佛成道'],
    '12-23': ['监斋菩萨圣诞'],
    '12-29': ['华严菩萨圣诞'],
  };

  static getXiu(month: number, day: number): string {
    return FotoUtil.XIU_27[
      (FotoUtil.XIU_OFFSET[Math.abs(month) - 1] + day - 1) % FotoUtil.XIU_27.length
    ];
  }
}
