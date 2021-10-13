// import * as request from 'supertest'
// import app from '../../app'
// import sequelize from '../../models'
// import AutUser from '../../models/aut/user.model';
// import StdFactory from '../../models/std/factory.model';
// import AutUserRepo from '../../repositories/aut/user.repository';
// import StdFactoryRepo from '../../repositories/std/factory.repository';
// import encrypt from '../../utils/encrypt';
// import getAuthToken from '../../utils/getAuthToken';

// let token: any;
// let factory1: StdFactory;
// let factory2: StdFactory;
// let factory3: StdFactory;

// beforeAll(async () => { 
//   token = await getAuthToken(process.env.ADMIN_ID as string, process.env.ADMIN_PWD as string); 

//   const factory = await new StdFactoryRepo().read() as AutUser;

//   factory1 = await new AutUserRepo().readById('cyj') as AutUser;
//   factory2 = await new AutUserRepo().readById('shs') as AutUser;
//   factory3 = await new AutUserRepo().readById('ybr') as AutUser;
// });
// afterAll(async () => await sequelize.close());

// //#region POST: /user/sign-in
// describe ('POST: /user/sign-in', () => {
//   describe('✅ 로그인 성공', () => {
//     test('SUCCESS | 200', async() => {
//       let response = await request(app)
//         .post('/aut/user/sign-in')
//         .accept('Accept')
//         .type('application/json')
//         .send({ id: 'KISOS', pwd: encrypt('1234', process.env.CRYPTO_SECRET as string) });

//         expect(response.status).toBe(200);
//         expect(response.body.datas.raws[0].token).toBeDefined();
//     });
//   });

//   describe('❗️ 로그인 실패(아이디 없음)', () => {
//     test('FAIL | 404', async() => {
//       let response = await request(app)
//         .post('/aut/user/sign-in')
//         .accept('Accept')
//         .type('application/json')
//         .send({ id: 'KISOSS', pwd: encrypt('1234', process.env.CRYPTO_SECRET as string) });

//         expect(response.status).toBe(404);
//     });
//   });

//   describe('❗️ 로그인 실패(패스워드 불일치)', () => {
//     test('FAIL | 404', async() => {
//       let response = await request(app)
//         .post('/aut/user/sign-in')
//         .accept('Accept')
//         .type('application/json')
//         .send({ id: 'KISOS', pwd: encrypt('1235', process.env.CRYPTO_SECRET as string) });

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
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })

//       expect(response.status).toBe(200);
//     });
//   });

//   describe('❗️ 단일 사용자 조회 실패(사용자 없음)', () => {
//     test('FAIL | 404', async() => {
//       const missingUuid = 'f07573b6-d474-44bc-a4e5-0967849b6c40';
//       let response = await request(app)
//         .get(`/aut/user/${missingUuid}`)
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })

//       expect(response.status).toBe(404);
//     });
//   });

//   describe('❗️ 단일 사용자 조회 실패(UUID 형식 오류)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .get(`/aut/user/${1234}`)
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })

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
//         .accept('Accept')
//         .type('application/json')
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
//         .accept('Accept')
//         .type('application/json')
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
//         .accept('Accept')
//         .type('application/json')
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

//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 생성 실패(이메일 중복)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .post('/aut/user')
//         .accept('Accept')
//         .type('application/json')
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
//             id : 'kej',
//             user_nm : '김은정',
//             email : 'ej.kim@kisos.net',
//             admin_fg : false,
//             pwd : '1234'
//           }
//         ]);

//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 생성 실패(사용자그룹 오입력)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .post('/aut/user')
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             id : 'nkb1',
//             user_nm : '남기백',
//             group_id: 99,
//             email : 'kisos@kisos.net',
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

//       expect(response.status).toBe(500);
//     });
//   });
// });
// //#endregion

// //#region PUT: /user
// describe('PUT: /user', async() => {
//   describe('✅ 사용자 수정 성공', () => {
//     test('SUCCESS | 201', async() => {
//       let response = await request(app)
//         .put('/aut/user')
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: factory1.uuid,
//             group_id: 2,
//             email : 'yj.cho1@kisos.net',
//             pwd_fg: true,
//             admin_fg : true,
//           },
//           {
//             uuid: factory2.uuid,
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
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: 1234,
//             group_id: 2,
//             email : 'kisos@kisos.net',
//             pwd_fg: true,
//             admin_fg : true,
//           },
//           {
//             uuid: factory2.uuid,
//             group_id: 1,
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 수정 실패(이메일 중복)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .put('/aut/user')
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: factory1.uuid,
//             group_id: 2,
//             email : 'kisos@kisos.net',
//             pwd_fg: true,
//             admin_fg : true,
//           },
//           {
//             uuid: factory2.uuid,
//             group_id: 1,
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 수정 실패(사용자그룹 오입력)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .put('/aut/user')
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: factory1.uuid,
//             group_id: 99,
//             email : 'yj.cho@kisos.net',
//             pwd_fg: true,
//             admin_fg : true,
//           },
//           {
//             uuid: factory2.uuid,
//             group_id: 1,
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.status).toBe(500);
//     });
//   });
// });
// //#endregion

// //#region PATCH: /user
// describe('PATCH: /user', async() => {
//   describe('✅ 사용자 부분 수정 성공', () => {
//     test('SUCCESS | 201', async() => {
//       let response = await request(app)
//         .patch('/aut/user')
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: factory1.uuid,
//             group_id: 2,
//             pwd: encrypt('12345', process.env.CRYPTO_SECRET as string),
//             email : 'yj.cho1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           },
//           {
//             uuid: factory2.uuid,
//             group_id: 1,
//             pwd: encrypt('123456', process.env.CRYPTO_SECRET as string),
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.status).toBe(201);

//       // 수정된 사용자 기준 로그인 테스트
//       let loginResponse = await request(app)
//         .post('/aut/user/sign-in')
//         .accept('Accept')
//         .type('application/json')
//         .send({ id: 'cyj', pwd: encrypt('12345', process.env.CRYPTO_SECRET as string) });

//         expect(loginResponse.status).toBe(200);
//         expect(loginResponse.body.datas.raws[0].token).toBeDefined();
//     });
//   });

//   describe('❗️ 사용자 부분 수정 실패(UUID 형식 오류)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .patch('/aut/user')
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: 1234,
//             group_id: 2,
//             pwd: encrypt('12345', process.env.CRYPTO_SECRET as string),
//             email : 'yj.cho1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           },
//           {
//             uuid: factory2.uuid,
//             group_id: 1,
//             pwd: encrypt('123456', process.env.CRYPTO_SECRET as string),
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 부분 수정 실패(이메일 중복)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .patch('/aut/user')
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: factory1.uuid,
//             group_id: 2,
//             pwd: encrypt('12345', process.env.CRYPTO_SECRET as string),
//             email : 'kisos@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           },
//           {
//             uuid: factory2.uuid,
//             group_id: 1,
//             pwd: encrypt('123456', process.env.CRYPTO_SECRET as string),
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.status).toBe(500);
//     });
//   });

//   describe('❗️ 사용자 부분 수정 실패(사용자그룹 오입력)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .patch('/aut/user')
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([
//           {
//             uuid: factory1.uuid,
//             group_id: 99,
//             pwd: encrypt('12345', process.env.CRYPTO_SECRET as string),
//             email : 'yj.cho1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           },
//           {
//             uuid: factory2.uuid,
//             group_id: 1,
//             pwd: encrypt('123456', process.env.CRYPTO_SECRET as string),
//             email : 'hs.seo1@kisos.net',
//             pwd_fg: false,
//             admin_fg : false,
//           }
//         ]);

//       expect(response.status).toBe(500);
//     });
//   });
// });
// //#endregion

// describe('DELETE: /user', async() => {
//   describe('✅ 사용자 삭제 성공', () => {
//     test('SUCCESS | 200', async() => {
//       let response = await request(app)
//         .delete('/aut/user')
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([{ uuid: factory3.uuid }]);

//       expect(response.status).toBe(200);

//       // 삭제된 사용자 기준 로그인 테스트
//       let loginResponse = await request(app)
//         .post('/aut/user/sign-in')
//         .accept('Accept')
//         .type('application/json')
//         .send({ id: 'ybr', pwd: encrypt('1234', process.env.CRYPTO_SECRET as string) });

//         expect(loginResponse.status).toBe(404);
//     });
//   });

//   describe('❗️ 사용자 삭제 실패(UUID 형식 오류)', () => {
//     test('FAIL | 500', async() => {
//       let response = await request(app)
//         .delete('/aut/user')
//         .accept('Accept')
//         .type('application/json')
//         .set({ Authorization: token })
//         .send([{ uuid: 1234 }]);

//       expect(response.status).toBe(500);
//     });
//   });
// });
// //#endregion