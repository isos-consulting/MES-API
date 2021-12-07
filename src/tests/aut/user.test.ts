// import * as request from 'supertest'
// import app from '../../app'
// import sequelize from '../../models'
// import AutUser from '../../models/aut/user.model';
// import AutUserRepo from '../../repositories/aut/user.repository';
// import encrypt from '../../utils/encrypt';
// import getAuthToken from '../../utils/getAuthToken';

// let token: any;
// let user1: AutUser;
// let user2: AutUser;
// let user3: AutUser;

// beforeAll(async () => { 
//   token = await getAuthToken(process.env.ADMIN_ID as string, process.env.ADMIN_PWD as string); 
//   user1 = await new AutUserRepo().readById('cyj') as AutUser;
//   user2 = await new AutUserRepo().readById('shs') as AutUser;
//   user3 = await new AutUserRepo().readById('ybr') as AutUser;
// });
// afterAll(async () => await sequelize.close());

// //#region POST: /user/sign-in
// describe ('POST: /user/sign-in', () => {
//   describe('✅ 로그인 성공', () => {
//     test('SUCCESS | 200', async() => {
//       let response = await request(app)
//         .post('/aut/user/sign-in')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .send({ id: 'KISOS', pwd: encrypt('1234', process.env.CRYPTO_SECRET as string)});

//         expect(response.status).toBe(200);
//         expect(response.body.datas.raws[0].token).toBeDefined();
//     });
//   });

//   describe('❗️ 로그인 실패(아이디 없음)', () => {
//     test('FAIL | 404', async() => {
//       let response = await request(app)
//         .post('/aut/user/sign-in')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .send({ id: 'KISOSS', pwd: encrypt('1234', process.env.CRYPTO_SECRET as string)});

//         expect(response.body.message).toEqual('사용자 아이디 또는 비밀번호 불일치');
//         expect(response.status).toBe(404);
//     });
//   });

//   describe('❗️ 로그인 실패(패스워드 불일치)', () => {
//     test('FAIL | 404', async() => {
//       let response = await request(app)
//         .post('/aut/user/sign-in')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .send({ id: 'KISOS', pwd: encrypt('1235', process.env.CRYPTO_SECRET as string)});

//         expect(response.body.message).toEqual('사용자 아이디 또는 비밀번호 불일치');
//         expect(response.status).toBe(404);
//     });
//   });
// });
// //#endregion

// //#region GET: /user/:uuid
// describe('GET: /user/:uuid', () => {
//   describe('✅ 단일 사용자 조회 성공', () => {
//     test('SUCCESS | 200', async() => {
//       const user = await new AutUserRepo().readById('KISOS') as AutUser;

//       let response = await request(app)
//         .get(`/aut/user/${user.uuid}`)
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })

//       expect(response.status).toBe(200);
//     });
//   });

//   describe('❗️ 단일 사용자 조회 실패(사용자 없음)', () => {
//     test('FAIL | 404', async() => {
//       const missingUuid = 'f07573b6-d474-44bc-a4e5-0967849b6c40';
//       let response = await request(app)
//         .get(`/aut/user/${missingUuid}`)
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })

//       expect(response.body.message).toEqual('사용자를 찾을 수 없습니다.');
//       expect(response.status).toBe(404);
//     });
//   });

//   describe('❗️ 단일 사용자 조회 실패(UUID 형식 오류)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .get(`/aut/user/${1234}`)
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })

//       expect(response.body.message).toEqual('uuid 자료형 대한 잘못된 입력: "1234"');
//       expect(response.status).toBe(500);
//     });
//   });
// });
// //#endregion

// //#region GET: /user
// describe('GET: /user', () => {
//   describe('✅ 모든 사용자 조회 성공', () => {
//     test('SUCCESS | 200', async() => {
//       let response = await request(app)
//         .get('/aut/user/')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })

//       expect(response.status).toBe(200);
//     });
//   });
// })
// //#endregion

// //#region POST: /user
// describe('POST: /user', () => {
//   describe('✅ 사용자 생성 성공', () => {
//     test('SUCCESS | 201', async() => {
//       let response = await request(app)
//         .post('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             id : 'dkc',
//             user_nm : '도규찬',
//             email : 'kc.do@kisos.net',
//             admin_fg : false,
//             pwd : '1234'
//           },
//           {
//             id : 'nkb',
//             user_nm : '남기백',
//             email : 'kb.nam@kisos.net',
//             admin_fg : false,
//             pwd : '1234'
//           },
//           {
//             id : 'kej',
//             user_nm : '김은정',
//             email : 'ej.kim@kisos.net',
//             admin_fg : false,
//             pwd : '1234'
//           }
//         ]);

//       expect(response.status).toBe(201);
//     });
//   });

//   describe('❗️ 사용자 생성 실패(아이디 중복)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .post('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             id : 'KISOS',
//             user_nm : '남기백',
//             email : 'kb.nam@kisos.net',
//             admin_fg : false,
//             pwd : '1234'
//           },
//           {
//             id : 'kej',
//             user_nm : '김은정',
//             email : 'ej.kim@kisos.net',
//             admin_fg : false,
//             pwd : '1234'
//           }
//         ]);

//       expect(response.body.message).toEqual('(id)=(KISOS) 키가 이미 있습니다.');
//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 생성 실패(이메일 중복)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .post('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             id : 'nkb1',
//             user_nm : '남기백',
//             email : 'kisos@kisos.net',
//             admin_fg : false,
//             pwd : '1234'
//           },
//           {
//             id : 'kej1',
//             user_nm : '김은정',
//             email : 'ej.kim@kisos.net',
//             admin_fg : false,
//             pwd : '1234'
//           }
//         ]);


//       expect(response.body.message).toEqual('(email)=(kisos@kisos.net) 키가 이미 있습니다.');
//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 생성 실패(사용자그룹 오입력)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .post('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             id : 'nkb1',
//             user_nm : '남기백',
//             group_id: 99,
//             email : 'kisos12@kisos.net',
//             admin_fg : false,
//             pwd : '1234'
//           },
//           {
//             id : 'kej1',
//             user_nm : '김은정',
//             email : 'ej.kim1@kisos.net',
//             admin_fg : false,
//             pwd : '1234'
//           }
//         ]);

//       expect(response.body.message).toEqual('"aut_user_tb" 테이블에서 자료 추가, 갱신 작업이 "aut_user_tb_group_id_fkey" 참조키(foreign key) 제약 조건을 위배했습니다');
//       expect(response.status).toBe(500);
//     });
//   });
// });
// //#endregion

// //#region PUT: /user
// describe('PUT: /user', () => {
//   describe('✅ 사용자 수정 성공', () => {
//     test('SUCCESS | 201', async() => {
//       let response = await request(app)
//         .put('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: user1.uuid,
//             group_id: 2,
//             email : 'yj.cho1@kisos.net',
//             pwd_fg: true,
//             admin_fg : true,
//           },
//           {
//             uuid: user2.uuid,
//             group_id: 1,
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.status).toBe(201);
//     });
//   });

//   describe('❗️ 사용자 수정 실패(UUID 형식 오류)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .put('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: '1234',
//             group_id: 2,
//             email : 'kisos@kisos.net',
//             pwd_fg: true,
//             admin_fg : true,
//           },
//           {
//             uuid: user2.uuid,
//             group_id: 1,
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.body.message).toEqual('uuid 자료형 대한 잘못된 입력: "1234"');
//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 수정 실패(이메일 중복)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .put('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: user1.uuid,
//             group_id: 2,
//             email : 'kisos@kisos.net',
//             pwd_fg: true,
//             admin_fg : true,
//           },
//           {
//             uuid: user2.uuid,
//             group_id: 1,
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.body.message).toEqual('(email)=(kisos@kisos.net) 키가 이미 있습니다.');
//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 수정 실패(사용자그룹 오입력)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .put('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: user1.uuid,
//             group_id: 99,
//             email : 'yj.cho@kisos.net',
//             pwd_fg: true,
//             admin_fg : true,
//           },
//           {
//             uuid: user2.uuid,
//             group_id: 1,
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.body.message).toEqual('"aut_user_tb" 테이블에서 자료 추가, 갱신 작업이 "aut_user_tb_group_id_fkey" 참조키(foreign key) 제약 조건을 위배했습니다');
//       expect(response.status).toBe(500);
//     });
//   });
// });
// //#endregion

// //#region PATCH: /user
// describe('PATCH: /user', () => {
//   describe('✅ 사용자 부분 수정 성공', () => {
//     test('SUCCESS | 201', async() => {
//       let response = await request(app)
//         .patch('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: user1.uuid,
//             group_id: 2,
//             pwd: '12345',
//             email : 'yj.cho1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           },
//           {
//             uuid: user2.uuid,
//             group_id: 1,
//             pwd: '123456',
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.status).toBe(201);

//       // 수정된 사용자 기준 로그인 테스트
//       let loginResponse = await request(app)
//         .post('/aut/user/sign-in')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .send({ id: 'cyj', pwd: encrypt('12345', process.env.CRYPTO_SECRET as string)});

//         expect(loginResponse.status).toBe(200);
//         expect(loginResponse.body.datas.raws[0].token).toBeDefined();
//     });
//   });

//   describe('❗️ 사용자 부분 수정 실패(UUID 형식 오류)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .patch('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: '1234',
//             group_id: 2,
//             pwd: '12345',
//             email : 'yj.cho1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           },
//           {
//             uuid: user2.uuid,
//             group_id: 1,
//             pwd: '123456',
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.body.message).toEqual('uuid 자료형 대한 잘못된 입력: "1234"');
//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 부분 수정 실패(이메일 중복)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .patch('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: user1.uuid,
//             group_id: 2,
//             pwd: '12345',
//             email : 'kisos@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           },
//           {
//             uuid: user2.uuid,
//             group_id: 1,
//             pwd: '123456',
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.body.message).toEqual('(email)=(kisos@kisos.net) 키가 이미 있습니다.');
//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 부분 수정 실패(사용자그룹 오입력)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .patch('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: user1.uuid,
//             group_id: 99,
//             pwd: '12345',
//             email : 'yj.cho1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           },
//           {
//             uuid: user2.uuid,
//             group_id: 1,
//             pwd: '123456',
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.body.message).toEqual('"aut_user_tb" 테이블에서 자료 추가, 갱신 작업이 "aut_user_tb_group_id_fkey" 참조키(foreign key) 제약 조건을 위배했습니다');
//       expect(response.status).toBe(500);
//     });
//   });
// });
// //#endregion

// //#region DELETE: /user
// describe('DELETE: /user', () => {
//   describe('✅ 사용자 삭제 성공', () => {
//     test('SUCCESS | 200', async() => {
//       let response = await request(app)
//         .delete('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([{ uuid: user3.uuid }]);

//       expect(response.status).toBe(200);

//       // 삭제된 사용자 기준 로그인 테스트
//       let loginResponse = await request(app)
//         .post('/aut/user/sign-in')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .send({ id: 'ybr', pwd: '1234'});

//         expect(loginResponse.status).toBe(404);
//     });
//   });

//   describe('❗️ 사용자 삭제 실패(UUID 형식 오류)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .delete('/aut/user')
//         .type('application/json')
//         .set('Accept', 'application/json')
//         .set({ Authorization: token })
//         .send([{ uuid: '1234' }]);

//       expect(response.body.message).toEqual('uuid 자료형 대한 잘못된 입력: "1234"');
//       expect(response.status).toBe(500);
//     });
//   });
// });
// //#endregion