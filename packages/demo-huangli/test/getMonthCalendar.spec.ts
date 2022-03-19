import { getMonthCalendarStart } from '../src/pages/getMonthCalendarStart';

test('2022', () => {
    expect(getMonthCalendarStart(2022, 0)).toEqual(new Date(2021, 11, 27));
    expect(getMonthCalendarStart(2022, 1)).toEqual(new Date(2022, 0, 31));
    expect(getMonthCalendarStart(2022, 2)).toEqual(new Date(2022, 1, 28));
})