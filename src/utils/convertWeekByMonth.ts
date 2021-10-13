import moment = require('moment');

/**
 * 📌 월요일을 주의 시작으로 하는 월단위 주차 계산
 * @param date Date Format의 String 변수
 * @returns 해당 월의 주차
 */
const convertWeekByMonth = (date: string) => {
  const firstDay = moment(date).format('YYYY-MM-01');
  const firstDayOfWeek = Number(moment(firstDay).format('E'));

  const diff = 7 - firstDayOfWeek;
  const endDayOfFirstWeek = 1 + diff;

  const dayOfWeek = Number(moment(date).format('D'));
  if (dayOfWeek <= endDayOfFirstWeek) { return 1; }

  return Math.ceil((dayOfWeek - endDayOfFirstWeek) / 7) + 1;
}

export default convertWeekByMonth;