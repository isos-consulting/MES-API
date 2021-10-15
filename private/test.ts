import * as moment from "moment";

// let result = '{YYYY}/{YY}/{Y}/{MM}/{DD}/{DDD}/{W}/{WW}/{0000}'

// // result = result.replace('{YYYY}', moment('2021-08-03').format('YYYY'));
// // result = result.replace('{YY}', moment('2021-08-03').format('YY'));
// // result = result.replace('{Y}', moment('2021-08-03').format('Y'));
// // result = result.replace('{MM}', moment('2021-08-03').format('MM'));
// // result = result.replace('{DD}', moment('2021-08-03').format('DD'));
// // result = result.replace('{DDD}', moment('2021-08-03').format('DDD'));
// // result = result.replace('{W}', moment('2021-08-03').format('W'));
// // result = result.replace('{WW}', moment('2021-08-03').format('WW'));

// result = result.replace('{YYYY}', moment('2021-02-27').format('YYYY'));
// result = result.replace('{YY}', moment('2021-02-27').format('YY'));
// result = result.replace('{Y}', moment('2021-02-27').format('YYYY').substr(-1));
// result = result.replace('{MM}', moment('2021-02-27').format('MM'));
// result = result.replace('{DD}', moment('2021-02-27').format('DD'));
// result = result.replace('{DDD}', moment('2021-02-27').format('DDD'));
// result = result.replace('{W}', moment('2021-08-06').format('W'));
// result = result.replace('{WW}', moment('2021-03-01').format('WW'));
// const seq = 11;

// const re = new RegExp(/{0*}/);
// const seqStartIndex = result.search(re);
// if (seqStartIndex) {
//   const seqEndIndex = result.indexOf('}', seqStartIndex);
//   const countOfZero = seqEndIndex - seqStartIndex - 1;
//   const countString = '{' + '0'.repeat(countOfZero) + '}';
  
//   result = result.replace(countString, `${seq}`.padStart(countOfZero, '0'));
// }

// // console.log(result);

// // console.log(moment('2021-07-31').format('W'))
// // console.log(moment('2021-08-01').format('W'))
// // console.log(moment('2021-08-02').format('W'))

// // console.log(moment('2021-07-31').format('E'))
// // console.log(moment('2021-08-01').format('E'))
// // console.log(moment('2021-08-02').format('E'))

// // console.log(moment('2018-01-01').format('W'))
// // console.log(moment('2019-01-01').format('W'))
// // console.log(moment('2020-01-01').format('W'))
// // console.log(moment('2021-01-01').format('W'))
// // console.log(moment('2020-12-31').format('WW'))
// // console.log(moment('2021-01-01').format('WW'))
// // console.log(moment('2021-01-04').format('WW'))
// // console.log(moment('2021-12-31').format('WW'))
// // console.log(moment('2022-01-01').format('WW'))
// // console.log(moment('2022-01-03').format('WW'))
// // console.log(moment('2021-08-01').format('E'))
// // console.log(moment('2021-08-02').format('E'))
// // console.log(moment('2021-08-07').format('E'))

// // 월: 1
// // 일: 7

// // const printMsg = (text: any) => {
// //   console.log(text ?? '에베베베베벱');     // undefined, null
// //   console.log(text || '에베베베베벱2222'); // Falsy

// //   const object1 = {
// //     a: 3,
// //     b: 2
// //   }

// //   const object2 = {
// //     a: 1,
// //     c: 5,
// //     d: 4
// //   }

// //   const object12 = { ...object1, ...object2 }
// //   console.log(object12);

// //   const object3 = Object.assign({}, object1, object2); // classic syntax
// //   const object4 = { ...object1, ...object2 } // spread syntax 가독성 압승

// //   const array1 = [1, 2, 3];
// //   const array2 = [4, 5, 6, 3];

// //   const evenSum = array2.filter(x => x % 2 == 0).reduce((a, b) => a + b);
// //   console.log('evenSum: ', evenSum);
// //   const sum = array2.reduce((a, b) => a + b);
// //   console.log('sum: ', sum);

// //   const array3 = array1.concat(array2);
// //   const array4 = [...array1, ...array2];

// //   const array5 = [...new Set([...array1, ...array2])];

// //   console.log(object3);
// //   console.log(object4);
// //   console.log(array3);
// //   console.log(array4);
// //   console.log(array5);
// // }

// // printMsg('aaaa');


// const abc: any = {};

// console.log(abc.abcd);

const abc = ['a', 'b', 'c']
// const bcd: any = { a: 'abc' }
const [abcd, bcde] = abc;
// const [bcde] = bcd;

console.log(abcd);
console.log(bcde);
// console.log(bcde);

console.log(moment('2015-09-15111').isValid())