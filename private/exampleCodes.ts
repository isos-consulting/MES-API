// Models

// Validation Error Exception Example
// @Column({
//   comment: '관리자 유무(0: 일반, 1: 관리자)',
//   type: DataType.SMALLINT,
//   allowNull: false,
//   defaultValue: 0,
//   validate: {
//     invailedAdminFg(admin_fg: number) {
//       if (admin_fg < 0 || admin_fg > 1) {
//         throw new Error(`Invailed value entered in 'admin_fg' (Value: ${admin_fg}) (Correct Value: [0, 1])`);
//       }
//     }
//   }
// })
// admin_fg: number;

// Index Example
// const idUniqueIndex = createIndexDecorator({
//   name: 'aut_user_tb_id_un_idx',
//   type: 'UNIQUE',
//   unique: true,
//   where: { deleted_at: null },
//   concurrently: true,
//   using: 'BTREE',
//   // operator: 'text_pattern_ops', Like 많이하는 Index
// });

// const emailUniqueIndex = createIndexDecorator({
//   name: 'aut_user_tb_email_un_idx',
//   type: 'UNIQUE',
//   unique: true,
//   where: { deleted_at: null },
//   concurrently: true,
//   using: 'BTREE',
//   // operator: 'text_pattern_ops',
// });


// Repositories

// Validation Error Exception Example
// if (error instanceof AggregateError) { throw new Error(error.errors[0].message); }


// ❗❗❗ InterLock: start_date 가 end_date 보다 큰 경우
// // Date 비교 함수
// /**
//  * 시작일자(입사일자)가 종료일자(퇴사일자)보다 큰 경우에 대한 InterLock
//  * @param _startDate 시작일자(입사일자)
//  * @param _endDate 종료일자(퇴사일자)
//  */
// checkDate = (_startDate: string, _endDate: string) => {
//   if (!_startDate && !_endDate) { return; }
//   if (_startDate > _endDate) { throw new Error('일자 입력형식이 잘못되었습니다.'); }
// }

// /**
//  * DB 내 Data 기준으로 시작일자(입사일자)가 종료일자(퇴사일자)보다 큰 경우에 대한 InterLock
//  * @param _data 입력 요청 Data
//  */
// checkDateFromDB = async (_data: any) => {
//   if (!_data.uuid) { return; } // uuid 가 없는 경우 pass
//   if (!_data.start_date && !_data.end_date) { return; } // 입력 params 에 start_date, end_date 가 없는 경우 pass

//   // 입력 params 에 start_date, end_date 가 모두 있는 경우 DB 에 접근하지 않고 비교 진행
//   if (_data.start_date && _data.end_date) {
//     this.checkDate(_data.start_date, _data.end_date);
//     return;
//   }

//   const readed = await (this.repo as StdEmpRepo).readByUuid(_data.uuid);
//   if (!readed.raws) { return; }

//   // 입력 params 에 start_date 만 있는 경우 DB 에서 읽어온 end_date 와 비교 진행
//   if (_data.start_date) {
//     this.checkDate(_data.start_date, readed.raws.end_date);
//     return;
//   }
  
//   // 입력 params 에 end_date 만 있는 경우 DB 에서 읽어온 start_date 와 비교 진행
//   if (_data.end_date) {
//     this.checkDate(readed.raws.start_date, _data.end_date);
//     return;
//   }
// }