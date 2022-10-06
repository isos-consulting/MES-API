import express from 'express';
import { matchedData } from 'express-validator';
import config from '../../configs/config';
import QmsReworkService from '../../services/qms/rework.service';
import QmsReworkDisassembleService from '../../services/qms/rework-disassemble.service';
import AdmReworkTypeService from '../../services/adm/rework-type.service';
import InvStoreService from '../../services/inv/store.service';
import createDatabaseError from '../../utils/createDatabaseError';
import createUnknownError from '../../utils/createUnknownError';
import { sequelizes } from '../../utils/getSequelize';
import isServiceResult from '../../utils/isServiceResult';
import response from '../../utils/response_new';
import ApiResult from '../../interfaces/common/api-result.interface';
import createApiResult from '../../utils/createApiResult_new';
import { successState } from '../../states/common.state';

class QmsReworkCtl {
  stateTag: string

  //#region ✅ Constructor
  constructor() {
    this.stateTag = 'qmsRework'
  };
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create] (✅ Inheritance): Default Create Function
  public create = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsReworkService(req.tenant.uuid);
			const reworkTypeService = new AdmReworkTypeService(req.tenant.uuid);
			const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
				// 📌 재작업 내역 생성
        const reworkResult = await service.create(datas, req.user?.uid as number, tran)
				let fromStoreResult: ApiResult<any> = { raws: [], count: 0 };
        let toStoreResult: ApiResult<any> = { raws: [], count: 0 };

				for (let rework of reworkResult.raws) {
					let tempFromStoreResult: ApiResult<any> = { raws: [], count: 0 };
					let tempToStoreResult: ApiResult<any> = { raws: [], count: 0 };
					
					const reworkTypeCd = await reworkTypeService.readRawById(rework.rework_type_id);
					switch (reworkTypeCd.raws[0].rework_type_cd) {
						case 'REWORK':
							tempFromStoreResult = await inventoryService.transactInventory(
								[ rework ], 'CREATE', 
								{ inout: 'FROM', tran_type: 'QMS_REWORK', store_alias: 'from_store_id',tran_id_alias: 'rework_id' },
								req.user?.uid as number, tran
							);
							tempToStoreResult = await inventoryService.transactInventory(
								[ rework ], 'CREATE', 
								{ inout: 'TO', tran_type: 'QMS_REWORK', store_alias: 'to_store_id', tran_id_alias: 'rework_id' },
								req.user?.uid as number, tran
							);
							break;
						case 'DISPOSAL':
							tempFromStoreResult = await inventoryService.transactInventory(
								[ rework ], 'CREATE', 
								{ inout: 'FROM', tran_type: 'QMS_DISPOSAL', store_alias: 'from_store_id', tran_id_alias: 'rework_id' },
								req.user?.uid as number, tran
							);
							break;
						case 'RETURN':
							tempFromStoreResult = await inventoryService.transactInventory(
								[ rework ], 'CREATE', 
								{ inout: 'FROM', tran_type: 'QMS_RETURN', store_alias: 'from_store_id', tran_id_alias: 'rework_id' },
								req.user?.uid as number, tran
							);
							tempToStoreResult = await inventoryService.transactInventory(
								[ rework ], 'CREATE', 
								{ inout: 'TO', tran_type: 'QMS_RETURN', store_alias: 'to_store_id', tran_id_alias: 'rework_id' },
								req.user?.uid as number, tran
							);
							break;
					};
					fromStoreResult.raws.push(tempFromStoreResult.raws);
					toStoreResult.raws.push(tempToStoreResult.raws);

					fromStoreResult.count += tempFromStoreResult.count;
					toStoreResult.count += tempToStoreResult.count;
				}
				
				result.raws.push({
					rework: reworkResult.raws,
					fromStore: fromStoreResult.raws,
					toStore: toStoreResult.raws
				});

				result.count += reworkResult.count + fromStoreResult.count + toStoreResult.count;
      });

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag , successState.CREATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[createDisassemble]: Create Disassemble Function
  public createDisassemble = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsReworkService(req.tenant.uuid);
			const reworkDisassembleService = new QmsReworkDisassembleService(req.tenant.uuid);
			const reworkTypeService = new AdmReworkTypeService(req.tenant.uuid);
			const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const data = {
        header: (await service.convertFk(matched.header))[0],
        details: await reworkDisassembleService.convertFk(matched.details),
      }

			const reworkTypeId = await reworkTypeService.readRawByCd('DISASSEMBLE');
			data.header['rework_type_id'] = reworkTypeId.raws[0]['rework_type_id'];
			
      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
				let reworkId: number;
				let regDate: string;
				let headerResult: ApiResult<any> = { count: 0, raws: [] };

				if (!data.header.uuid) {
					headerResult = await service.create([data.header], req.user?.uid as number, tran);
					reworkId = headerResult.raws[0].rework_id;
					regDate = headerResult.raws[0].reg_date;
				} else {
					reworkId = data.header.rework_id;
					regDate = data.header.reg_date
				};

				data.details = data.details.map((detail: any) => {
					detail.rework_id = reworkId;
					return detail;
				});

				// 📌 창고 수불
				const storeResult = await inventoryService.transactInventory(
					headerResult.raws, 'CREATE', 
					{ inout: 'FROM', tran_type: 'QMS_DISASSEMBLE', tran_id_alias: 'rework_id' },
					req.user?.uid as number, tran
				);

				// 📌 재작업 분해 상세이력 
				const detailResult = await reworkDisassembleService.create(data.details, req.user?.uid as number, tran);
				
				// 📌 분해 후 입고 창고 수불 내역 생성
				const detailResult_incom = detailResult.raws.filter((raws: any) => raws.income_qyt > 0)
				const detailResult_return = detailResult.raws.filter((raws: any) => raws.return_qty > 0)

				const detailStoreResult_incom = await inventoryService.transactInventory(
					detailResult_incom, 'CREATE', 
					{ inout: 'TO', tran_type: 'QMS_DISASSEMBLE_INCOME', reg_date: regDate, tran_id_alias: 'rework_disassemble_id' },
					req.user?.uid as number, tran
				);
				const detailStoreResult_return = await inventoryService.transactInventory(
					detailResult_return, 'CREATE', 
					{ inout: 'TO', tran_type: 'QMS_DISASSEMBLE_RETURN', reg_date: regDate, tran_id_alias: 'rework_disassemble_id' },
					req.user?.uid as number, tran
				);

				result.raws.push({
					rework: {
						header: headerResult.raws,
						details: detailResult.raws,
					},
					store: storeResult.raws,
					disassembleStore: [...detailStoreResult_incom.raws, ...detailStoreResult_return.raws]
				});

				result.count += headerResult.count + detailResult.count + storeResult.count + detailStoreResult_incom.count + detailStoreResult_return.count;
      });

      return createApiResult(res, result, 201, '데이터 생성 성공', this.stateTag , successState.CREATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };
  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[read] (✅ Inheritance): Default Read Function
  public read = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsReworkService(req.tenant.uuid);
      const params = matchedData(req, { locations: [ 'query', 'params' ] });

      result = await service.read(params);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }
      
      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  // 📒 Fn[readByUuid] (✅ Inheritance): Default ReadByUuid Function
  public readByUuid = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsReworkService(req.tenant.uuid);

      result = await service.readByUuid(req.params.uuid);

      return createApiResult(res, result, 200, '데이터 조회 성공', this.stateTag, successState.READ);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#region 🟡 Update Functions

  // 📒 Fn[update] (✅ Inheritance): Default Update Function
  public update = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count: 0, raws: [] };
      const service = new QmsReworkService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.update(datas, req.user?.uid as number, tran)
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.UPDATE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch] (✅ Inheritance): Default Patch Function
  public patch = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsReworkService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
        result = await service.patch(datas, req.user?.uid as number, tran)
      });

      return createApiResult(res, result, 200, '데이터 수정 성공', this.stateTag, successState.PATCH);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#region 🔴 Delete Functions

  // 📒 Fn[delete] (✅ Inheritance): Default Delete Function
  public delete = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let result: ApiResult<any> = { count:0, raws: [] };
      const service = new QmsReworkService(req.tenant.uuid);
			const reworkDisassembleService = new QmsReworkDisassembleService(req.tenant.uuid);
			const reworkTypeService = new AdmReworkTypeService(req.tenant.uuid);
			const inventoryService = new InvStoreService(req.tenant.uuid);
      const matched = matchedData(req, { locations: [ 'body' ] });
      const datas = await service.convertFk(Object.values(matched));

      await sequelizes[req.tenant.uuid].transaction(async(tran: any) => { 
				for (let data of datas) {
					// 📌 재작업 내역 생성
					const rework = await service.readRawById(data.rework_id); 
					const reworkTypeCd = await reworkTypeService.readRawById(rework.raws[0].rework_type_id);
					let fromStoreResult: ApiResult<any> = { raws: [], count: 0 };
					let toStoreResult: ApiResult<any> = { raws: [], count: 0 };
					let reworkIds: string[] = [];

					switch (reworkTypeCd.raws[0].rework_type_cd) {
						case 'REWORK':
							fromStoreResult = await inventoryService.transactInventory(
								rework.raws, 'DELETE', 
								{ inout: 'FROM', tran_type: 'QMS_REWORK', reg_date: '', tran_id_alias: 'rework_id' },
								req.user?.uid as number, tran
							);
							toStoreResult = await inventoryService.transactInventory(
								rework.raws, 'DELETE', 
								{ inout: 'TO', tran_type: 'QMS_REWORK', reg_date: '', tran_id_alias: 'rework_id' },
								req.user?.uid as number, tran
							);
							break;
						case 'DISPOSAL':
							fromStoreResult = await inventoryService.transactInventory(
								rework.raws, 'DELETE', 
								{ inout: 'FROM', tran_type: 'QMS_DISPOSAL', reg_date: '', tran_id_alias: 'rework_id' },
								req.user?.uid as number, tran
							);
							break;
						case 'RETURN':
							fromStoreResult = await inventoryService.transactInventory(
								rework.raws, 'DELETE', 
								{ inout: 'FROM', tran_type: 'QMS_RETURN', reg_date: '', tran_id_alias: 'rework_id' },
								req.user?.uid as number, tran
							);
							toStoreResult = await inventoryService.transactInventory(
								rework.raws, 'DELETE', 
								{ inout: 'TO', tran_type: 'QMS_RETURN', reg_date: '', tran_id_alias: 'rework_id' },
								req.user?.uid as number, tran
							);
							break;
					};

					const disassembleRaws = await reworkDisassembleService.readRawsByReworkIds(reworkIds);
					// 📌 분해 후 입고 창고 수불 내역 생성
					const detailResult_incom = disassembleRaws.raws.filter((raws: any) => raws.income_qyt > 0)
					const detailResult_return = disassembleRaws.raws.filter((raws: any) => raws.return_qty > 0)

					const detailStoreResult_incom = await inventoryService.transactInventory(
						detailResult_incom, 'DELETE', 
						{ inout: 'TO', tran_type: 'QMS_DISASSEMBLE_INCOME', reg_date: '', tran_id_alias: 'rework_disassemble_id' },
						req.user?.uid as number, tran
					);
					const detailStoreResult_return = await inventoryService.transactInventory(
						detailResult_return, 'DELETE', 
						{ inout: 'TO', tran_type: 'QMS_DISASSEMBLE_RETURN', reg_date: '', tran_id_alias: 'rework_disassemble_id' },
						req.user?.uid as number, tran
					);

					const disassembleResult = await reworkDisassembleService.delete(disassembleRaws.raws, req.user?.uid as number, tran);

					// 📌 재작업 내역 삭제
					const reworkResult = await service.delete(datas, req.user?.uid as number, tran);

					result.raws.push({
						rework: reworkResult.raws,
						fromStore: fromStoreResult.raws,
						toStore: toStoreResult.raws,
						disassemble: disassembleResult.raws,
						disassembleStore: [...detailStoreResult_incom.raws, ...detailStoreResult_return.raws],
					});

					result.count += reworkResult.count + fromStoreResult.count + toStoreResult.count + disassembleResult.count + disassembleResult.count + detailStoreResult_return.count;
				}
      });

      return createApiResult(res, result, 200, '데이터 삭제 성공', this.stateTag, successState.DELETE);
    } catch (error) {
      if (isServiceResult(error)) { return response(res, error.result_info, error.log_info); }

      const dbError = createDatabaseError(error, this.stateTag);
      if (dbError) { return response(res, dbError.result_info, dbError.log_info); }

      return config.node_env === 'test' ? createUnknownError(req, res, error) : next(error);
    }
  };

  //#endregion

  //#endregion
}

export default QmsReworkCtl;