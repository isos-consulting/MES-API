const moment = require('moment');

let dayNum = moment('2022-06-12').day();

if (dayNum == 0) { dayNum = 7; }

const monday = moment('2022-06-12').add((dayNum-1)*(-1), 'days').format('yyyy-MM-DD');
const sunday = moment('2022-06-12').add(7-dayNum, 'days').format('yyyy-MM-DD');

console.log(moment('2022-06-12').format('dddd'));