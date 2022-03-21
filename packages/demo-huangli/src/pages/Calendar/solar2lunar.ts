 // https://github.com/jjonline/calendar.js/blob/master/calendar.js
 /**
 * 阳历节日
 */
const festival: Record<string, any> = {
    '1-1': {title: '元旦节'},
    '2-14': {title: '情人节'},
    '5-1': {title: '劳动节'},
    '5-4': {title: '青年节'},
    '6-1': {title: '儿童节'},
    '9-10': {title: '教师节'},
    '10-1': {title: '国庆节'},
    '12-25': {title: '圣诞节'},

    '3-8': {title: '妇女节'},
    '3-12': {title: '植树节'},
    '4-1': {title: '愚人节'},
    '5-12': {title: '护士节'},
    '7-1': {title: '建党节'},
    '8-1': {title: '建军节'},
    '12-24': {title: '平安夜'},
};

/**
 * 农历节日
 */
const lFestival: Record<string, any> = {
    '12-30': {title: '除夕'},
    '1-1': {title: '春节'},
    '1-15': {title: '元宵节'},
    '2-2': {title: '龙抬头'},
    '5-5': {title: '端午节'},
    '7-7': {title: '七夕节'},
    '7-15': {title: '中元节'},
    '8-15': {title: '中秋节'},
    '9-9': {title: '重阳节'},
    '10-1': {title: '寒衣节'},
    '10-15': {title: '下元节'},
    '12-8': {title: '腊八节'},
    '12-23': {title: '小年'},
};

/**
 * 农历1900-2100的润大小信息表
 * @Array Of Property
 * @return Hex
 */
const lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
 0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
 0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
 /**Add By JJonline@JJonline.Cn**/
 0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
 0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
 0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
 0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
 0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
 0x0d520]; //2100

/**
 * 数字转中文速查表
 * @Array Of Property
 * @trans ['日','一','二','三','四','五','六','七','八','九','十']
 * @return Cn string
 */
const nStr1 = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341"];

/**
 * 日期转农历称呼速查表
 * @Array Of Property
 * @trans ['初','十','廿','卅']
 * @return Cn string
 */
const nStr2 = ["\u521d", "\u5341", "\u5eff", "\u5345"]

/**
 * 月份转农历称呼速查表
 * @Array Of Property
 * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
 * @return Cn string
 */
const nStr3 = ["\u6b63", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341", "\u51ac", "\u814a"]

/**
 * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
 * @param y lunar Year
 * @return Number (0-12)
 * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
 */
function leapMonth(y: number) { //闰字编码 \u95f0
    return (lunarInfo[y - 1900] & 0xf);
}

 /**
 * 返回农历y年闰月的天数 若该年没有闰月则返回0
 * @param y lunar Year
 * @return Number (0、29、30)
 * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
 */
function leapDays(y: number) {
    if (leapMonth(y)) {
        return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
    }
    return (0);
}

/**
 * 返回农历y年一整年的总天数
 * @param y lunar Year
 * @return Number
 * @eg:var count = calendar.lYearDays(1987) ;//count=387
 */
function lYearDays(y: number) {
    let i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
        sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return (sum + leapDays(y));
}

 /**
 * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
 * @param y lunar Year
 * @param m lunar Month
 * @return Number (-1、29、30)
 * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
 */
function monthDays(y: number, m: number) {
    if (m > 12 || m < 1) {
        return -1
    }//月份参数从1至12，参数错误返回-1
    return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
}

/**
 * 传入农历日期数字返回汉字表示法
 * @param d lunar day
 * @return Cn string
 * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
 */
function toChinaDay (d: number) { //日 => \u65e5
    let s;
    switch (d) {
        case 10:
            s = '\u521d\u5341';
            break;
        case 20:
            s = '\u4e8c\u5341';
            break;
        case 30:
            s = '\u4e09\u5341';
            break;
        default :
            s = nStr2[Math.floor(d / 10)];
            s += nStr1[d % 10];
    }
    return (s);
}

/**
 * 传入农历数字月份返回汉语通俗表示法
 * @param m lunar month
 * @return Cn string
 * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
 */
function toChinaMonth (m: number) { // 月 => \u6708
    if (m > 12 || m < 1) {
        return -1
    } //若参数错误 返回-1
    let s = nStr3[m - 1];
    s += "\u6708";//加上月字
    return s;
}

export function solar2lunar(y: number, m: number, d: number) {
    if (y < 1900 || y > 2100) {
        throw new Error('年份限定、上限')
    }
    if (y === 1900 && m === 1 && d < 31) {
        throw new Error('公历传参最下限')
    }

    //未传参  获得当天
    const objDate = new Date(y, m - 1, d);
    let i, leap = 0, temp = 0;
    //修正ymd参数
    y = objDate.getFullYear();
    m = objDate.getMonth() + 1;
    d = objDate.getDate();
    let offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
    for (i = 1900; i < 2101 && offset > 0; i++) {
        temp = lYearDays(i);
        offset -= temp;
    }
    if (offset < 0) {
        offset += temp;
        i--;
    }

    //是否今天
    let isTodayObj = new Date(),
        isToday = false;
    if (isTodayObj.getFullYear() === y && isTodayObj.getMonth() + 1 === m && isTodayObj.getDate() === d) {
        isToday = true;
    }
    //星期几
    let nWeek = objDate.getDay(),
        cWeek = nStr1[nWeek];
    //数字表示周几顺应天朝周一开始的惯例
    if (nWeek === 0) {
        nWeek = 7;
    }
    //农历年
    const year = i;
    leap = leapMonth(i); //闰哪个月
    let isLeap = false;

    //效验闰月
    for (i = 1; i < 13 && offset > 0; i++) {
        //闰月
        if (leap > 0 && i === (leap + 1) && isLeap === false) {
            --i;
            isLeap = true;
            temp = leapDays(year); //计算农历闰月天数
        } else {
            temp = monthDays(year, i);//计算农历普通月天数
        }
        //解除闰月
        if (isLeap === true && i === (leap + 1)) {
            isLeap = false;
        }
        offset -= temp;
    }
    // 闰月导致数组下标重叠取反
    if (offset === 0 && leap > 0 && i === leap + 1) {
        if (isLeap) {
            isLeap = false;
        } else {
            isLeap = true;
            --i;
        }
    }
    if (offset < 0) {
        offset += temp;
        --i;
    }
    //农历月
    const month = i;
    //农历日
    const day = offset + 1;

    const solarDate = y + '-' + m + '-' + d;
    const lunarDate = year + '-' + month + '-' + day;

    const festivalDate = m + '-' + d;
    let lunarFestivalDate = month + '-' + day;

    // bugfix https://github.com/jjonline/calendar.js/issues/29
    // 农历节日修正：农历12月小月则29号除夕，大月则30号除夕
    // 此处取巧修正：当前为农历12月29号时增加一次判断并且把lunarFestivalDate设置为12-30以正确取得除夕
    // 天朝农历节日遇闰月过前不过后的原则，此处取农历12月天数不考虑闰月
    // 农历润12月在本工具支持的200年区间内仅1574年出现
    if (month === 12 && day === 29 && monthDays(year, month) === 29) {
        lunarFestivalDate = '12-30';
    }
    return {
        date: solarDate,
        lunarDate: lunarDate,
        festival: festival[festivalDate] ? festival[festivalDate].title : null,
        lunarFestival: lFestival[lunarFestivalDate] ? lFestival[lunarFestivalDate].title : null,
        'lYear': year,
        'lMonth': month,
        'lDay': day,
        'IMonthCn': (isLeap ? "\u95f0" : '') + toChinaMonth(month),
        'IDayCn': toChinaDay(day),
        'cYear': y,
        'cMonth': m,
        'cDay': d,
        'isToday': isToday,
        'isLeap': isLeap,
        'nWeek': nWeek,
        'ncWeek': "\u661f\u671f" + cWeek,
    };
}