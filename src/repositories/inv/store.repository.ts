import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import InvStore from '../../models/inv/store.model';
import IInvStore from '../../interfaces/inv/store.interface';
import { readStocks } from '../../queries/inv/store.query';
import { readStoreTotalInventory } from '../../queries/inv/store-total-history.query';
import { readStoreIndividualHistory } from '../../queries/inv/store-individual-history.query';
import { readStoreHistoryByTransaction } from '../../queries/inv/store-history-by-transaction.query';
import { readStoreTypeInventory } from '../../queries/inv/store-type-history.query';
import { readReturnStocks } from '../../queries/inv/store.return.query';

class InvStoreRepo {
  repo: Repository<InvStore>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(InvStore);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IInvStore[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((store: any) => {
        return this.repo.create(
          {
            factory_id: store.factory_id,
            tran_id: store.tran_id,
            inout_fg: store.inout_fg,
            tran_type_id: store.tran_type_id,
            reg_date: store.reg_date,
            store_id: store.store_id,
            location_id: store.location_id,
            prod_id: store.prod_id,
            reject_id: store.reject_id,
            partner_id: store.partner_id,
            lot_no: store.lot_no,
            qty: store.qty,
            remark: store.remark,
            created_uid: uid,
            updated_uid: uid,
          },
          { hooks: true, transaction }
        );
      });
      const raws = await Promise.all(promises);
      
			return { raws, count: raws.length } as ApiResult<any>;
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  //#endregion

  //#region 🔵 Read Functions
  
  // 📒 Fn[read]: Default Read Function
  public read = async(params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.AdmTranType, 
            attributes: [], 
            required: true, 
            where: { tran_type_cd: params.tran_type_cd ? params.tran_type_cd : { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
            where: { uuid: params.prod_uuid ? params.prod_uuid : { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.StdStore, 
            attributes: [], 
            required: true,
            where: { uuid: params.store_uuid ? params.store_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.StdLocation, attributes: [], required: false },
          { model: this.sequelize.models.StdReject, attributes: [], required: false },
					{ model: this.sequelize.models.StdPartner, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('invStore.uuid'), 'inv_store_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('admTranType.uuid'), 'tran_type_uuid' ],
          [ Sequelize.col('admTranType.tran_type_cd'), 'tran_type_cd' ],
          [ Sequelize.col('admTranType.tran_type_nm'), 'tran_type_nm' ],
          'reg_date',
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          [ Sequelize.col('stdProd.prod_nm'), 'prod_nm' ],
          [ Sequelize.col('stdProd.stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProd.stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdProd.stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdProd.stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdProd.stdModel.model_nm'), 'model_nm' ],
          [ Sequelize.col('stdProd.rev'), 'rev' ],
          [ Sequelize.col('stdProd.prod_std'), 'prod_std' ],
          [ Sequelize.col('stdProd.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdProd.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdProd.stdUnit.unit_nm'), 'unit_nm' ],
          'lot_no',
          'qty',
          [ Sequelize.literal(`CASE WHEN invStore.inout_fg = TRUE THEN '입고' ELSE '출고' END`), 'inout_state' ],
          [ Sequelize.col('stdStore.uuid'), 'store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'location_nm' ],
					[ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { 
          [Op.and]: [
            Sequelize.where(Sequelize.fn('date', Sequelize.col('invStore.reg_date')), '>=', params.start_date),
            Sequelize.where(Sequelize.fn('date', Sequelize.col('invStore.reg_date')), '<=', params.end_date),
          ]
        },
        order: [ 'factory_id', 'reg_date', 'store_id', 'location_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { model: this.sequelize.models.AdmTranType, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
          },
          { model: this.sequelize.models.StdStore, attributes: [], required: true },
          { model: this.sequelize.models.StdLocation, attributes: [], required: false },
          { model: this.sequelize.models.StdReject, attributes: [], required: false },
					{ model: this.sequelize.models.StdPartner, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('invStore.uuid'), 'inv_store_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('admTranType.uuid'), 'tran_type_uuid' ],
          [ Sequelize.col('admTranType.tran_type_cd'), 'tran_type_cd' ],
          [ Sequelize.col('admTranType.tran_type_nm'), 'tran_type_nm' ],
          'reg_date',
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          [ Sequelize.col('stdProd.prod_nm'), 'prod_nm' ],
          [ Sequelize.col('stdProd.stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProd.stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdProd.stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdProd.stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdProd.stdModel.model_nm'), 'model_nm' ],
          [ Sequelize.col('stdProd.rev'), 'rev' ],
          [ Sequelize.col('stdProd.prod_std'), 'prod_std' ],
          [ Sequelize.col('stdProd.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdProd.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdProd.stdUnit.unit_nm'), 'unit_nm' ],
          'lot_no',
          'qty',
          [ Sequelize.literal(`CASE WHEN invStore.inout_fg = TRUE THEN '입고' ELSE '출고' END`), 'inout_state' ],
          [ Sequelize.col('stdStore.uuid'), 'store_uuid' ],
          [ Sequelize.col('stdStore.store_cd'), 'store_cd' ],
          [ Sequelize.col('stdStore.store_nm'), 'store_nm' ],
          [ Sequelize.col('stdLocation.uuid'), 'location_uuid' ],
          [ Sequelize.col('stdLocation.location_cd'), 'location_cd' ],
          [ Sequelize.col('stdLocation.location_nm'), 'location_nm' ],
					[ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { uuid }
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readStocks]: 매개변수에 따른 재고수량 조회
  public readStocks = async(params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        attributes: [
          [ Sequelize.literal('SUM(invStore.qty * invStore.inout_fg:: int'), 'qty' ],
          'factory_id',
          'prod_id',
          'store_id',
          'location_id',
          'lot_no',
          'reject_id',
          'partner_id'
        ],
        where: { 
          [Op.and]: [
            params.factory_id ? { factory_id: params.factory_id } : {},
            params.prod_id ? { prod_id: params.prod_id } : {},
            params.store_id ? { store_id: params.store_id } : {},
            params.location_id ? { location_id: params.location_id } : {},
            params.lot_no ? { lot_no: params.lot_no } : {},
            params.reject_id ? { reject_id: params.reject_id } : {},
            params.partner_id ? { partner_id: params.partner_id } : {},
            params.exclude_zero_lot_fg ? { lot_no: { [Op.ne]: '0'} } : {},
            Sequelize.where(Sequelize.fn('date', Sequelize.col('invStore.reg_date')), '<=', params.reg_date),
          ]
        },
        group: [ 'factory_id', 'prod_id', 'store_id', 'location_id', 'lot_no', 'reject_id', 'partner_id' ],
        having: Sequelize.where(Sequelize.literal('SUM(invStore.qty * invStore.inout_fg:: int'), '>', '0'),
        order: [ 'reg_date' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readRawsByUuids]: Id 를 포함한 Raw Datas Read Function
  public readRawsByUuids = async(uuids: string[]) => {
    const result = await this.repo.findAll({ where: { uuid: { [Op.in]: uuids } } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByUuid]: Id 를 포함한 Raw Data Read Function
  public readRawByUuid = async(uuid: string) => {
    const result = await this.repo.findOne({ where: { uuid } });
    return convertReadResult(result);
  };

  // 📒 Fn[readStockAccordingToType]: 유형에 따라 재고 조회
  public readStockAccordingToType = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readStocks(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readReturnStock]: 유형에 따라 재고 조회
  public readReturnStock = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readReturnStocks(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readStoreHistoryByTransaction]: 수불유형에 따른 이력 조회
  public readStoreHistoryByTransaction = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readStoreHistoryByTransaction(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readTotalHistoryAccordingToType]: 유형에 따른 총괄수불부 조회
  public readTotalHistoryAccordingToType = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readStoreTotalInventory(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readIndividualHistoryAccordingToType]: 유형에 따른 개별수불부 조회
  public readIndividualHistoryAccordingToType = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readStoreIndividualHistory(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readTypeHistoryAccordingToType]: 유형에 따른 수불유형별 수불부 조회
  public readTypeHistoryAccordingToType = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readStoreTypeInventory(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };
  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IInvStore[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((store: any) => {
        return this.repo.update(
          {
            qty: store.qty != null ? store.qty : null,
            remark: store.remark != null ? store.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: store.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.InvStore.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  // 📒 Fn[updateToTransaction]: 전표 데이터 변경으로 수불 데이터 수정
  updateToTransaction = async(body: IInvStore[], uid: number, transaction?: Transaction) => {
    try {
      let previousPromises: any[] = [];
      let promises: any[] = [];

      body.forEach((store) => {
        const previousPromise = this.repo.findOne({
          where: {
            tran_id: store.tran_id,
            inout_fg: store.inout_fg,
            tran_type_id: store.tran_type_id
          }
        });

        const promise = this.repo.update(
          {
            qty: store.qty,
            remark: store.remark,
            updated_uid: uid,
          } as any,
          { 
            where: { 
              tran_id: store.tran_id,
              inout_fg: store.inout_fg,
              tran_type_id: store.tran_type_id
            },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        previousPromises = [...previousPromises, previousPromise];
        promises = [...promises, promise];
      });

      const previousRaws = await Promise.all(previousPromises);
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.InvStore.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  }

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IInvStore[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((store: any) => {
        return this.repo.update(
          {
            qty: store.qty,
            remark: store.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: store.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.InvStore.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IInvStore[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((store: any) => {
        return this.repo.destroy({ where: { uuid: store.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.InvStore.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[deleteToTransaction]: 전표 데이터 변경으로 수불 데이터 삭제
  deleteToTransaction = async(body: IInvStore[], uid: number, transaction?: Transaction) => {
    try {    
      let previousPromises: any[] = [];
      let promises: any[] = [];

      body.forEach((store) => {
        const previousPromise = this.repo.findOne({
          where: {
            tran_id: store.tran_id,
            inout_fg: store.inout_fg,
            tran_type_id: store.tran_type_id
          }
        });

        const promise = this.repo.destroy({
          where: { 
            tran_id: store.tran_id,
            inout_fg: store.inout_fg,
            tran_type_id: store.tran_type_id
          }, 
          transaction
        });

        previousPromises = [...previousPromises, previousPromise];
        promises = [...promises, promise];
      });

      const previousRaws = await Promise.all(previousPromises);
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.InvStore.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion

  //#region ✅ Other Functions
  // 📒 Fn[getTranTypeWhereOptions]: 수불 유형 Parameter에 따라 Where 문 생성
  /**
   * 수불 유형 Parameter에 따라 Where 문 생성
   * @param tranType 수불 유형 Parameter
   * @returns 유형에 따른 재고수불 조회 조건문
   */
  // getTranTypeWhereOptions = (tranType: string) => {
  //   let whereOptions: WhereOptions<InvStore> = {};
  //   let tranCd: string | undefined;

  //   switch (tranType) {
  //     // 📌 수불유형 전체 조회
  //     case 'all': break;
  //     // 📌 자재입하 수불내역 조회
  //     case 'matIncome': tranCd = getTranTypeCd('MAT_INCOME'); break;
  //     // 📌 자재반출 수불내역 조회
  //     case 'matReturn': tranCd = getTranTypeCd('MAT_RETURN'); break;
  //     // 📌 공정출고 수불내역 조회
  //     case 'matRelease': tranCd = getTranTypeCd('MAT_RELEASE'); break;
  //     // 📌 자재반납 수불내역 조회
  //     case 'prdReturn': tranCd = getTranTypeCd('PRD_RETURN'); break;
  //     // 📌 생산입고 수불내역 조회
  //     case 'prdOutput': tranCd = getTranTypeCd('PRD_OUTPUT'); break;
  //     // 📌 생산투입 수불내역 조회
  //     case 'prdInput': tranCd = getTranTypeCd('PRD_INPUT'); break;
  //     // 📌 생산부적합 수불내역 조회
  //     case 'prdReject': tranCd = getTranTypeCd('PRD_REJECT'); break;
  //     // 📌 제품입고 수불내역 조회
  //     case 'salRelease': tranCd = getTranTypeCd('SAL_INCOME'); break;
  //     // 📌 제품출고 수불내역 조회
  //     case 'salRelease': tranCd = getTranTypeCd('SAL_RELEASE'); break;
  //     // 📌 제품출하 수불내역 조회
  //     case 'salOutgo': tranCd = getTranTypeCd('SAL_OUTGO'); break;
  //     // 📌 제품반입 수불내역 조회
  //     case 'salReturn': tranCd = getTranTypeCd('SAL_RETURN'); break;
  //     // 📌 사급입고 수불내역 조회
  //     case 'outIncome': tranCd = getTranTypeCd('OUT_INCOME'); break;
  //     // 📌 사급출고 수불내역 조회
  //     case 'outRelease': tranCd = getTranTypeCd('OUT_RELEASE'); break;
  //     // 📌 재고실사 수불내역 조회
  //     case 'inventory': tranCd = getTranTypeCd('INVENTORY'); break;
  //     // 📌 재고이동 수불내역 조회
  //     case 'invMove': tranCd = getTranTypeCd('INV_MOVE'); break;
  //     // 📌 재고부적합 수불내역 조회
  //     case 'invReject': tranCd = getTranTypeCd('INV_REJECT'); break;
  //     // 📌 부적합품판정(재작업) 수불내역 조회
  //     case 'qmsRework': tranCd = getTranTypeCd('QMS_REWORK'); break;
  //     // 📌 부적합품판정(폐기) 수불내역 조회
  //     case 'qmsDisposal': tranCd = getTranTypeCd('QMS_DISPOSAL'); break;
  //     // 📌 부적합품판정(반출대기) 수불내역 조회
  //     case 'qmsReturn': tranCd = getTranTypeCd('QMS_RETURN'); break;
  //     // 📌 부적합품판정(분해) 수불내역 조회
  //     case 'qmsDisassemble': tranCd = getTranTypeCd('QMS_DISASSEMBLE'); break;
  //     // 📌 부적합품판정(분해입고) 수불내역 조회
  //     case 'qmsDisassembleIncome': tranCd = getTranTypeCd('QMS_DISASSEMBLE_INCOME'); break;
  //     // 📌 부적합품판정(분해반출대기) 수불내역 조회
  //     case 'qmsDisassembleReturn': tranCd = getTranTypeCd('QMS_DISASSEMBLE_RETURN'); break;
  //     // 📌 기타입고 수불내역 조회
  //     case 'etcIncome': tranCd = getTranTypeCd('ETC_INCOME'); break;
  //     // 📌 기타출고 수불내역 조회
  //     case 'etcRelease': tranCd = getTranTypeCd('ETC_RELEASE'); break;

  //     default: break;
  //   }

  //   if (tranCd) { whereOptions = { tran_cd: tranCd }; }

  //   return whereOptions;
  // }

  // 📒 Fn[getCurrentStock]: 
  getCurrentStock = async(prodId: number, storeId: number, lotNo?: string, locationNo?: number) => {
    try {
      return false;
      // const result = await this.repo.findOne({ 
      //   attributes: [
      //     [ Sequelize.fn('count', Sequelize.col('return_id')), 'count' ],
      //   ],
      //   where: { return_id: returnId },
      //   transaction
      // });


    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[getMaxTranId]: 재고 실사 진행 시 tran_id Max 값 발급 받아 +1 하여 사용
  /**
   * 재고 실사 진행 시 tran_id Max 값 발급 받아 +1 하여 사용
   * @param tranTypeId Max tran_id 를 생성 할 transaction type code 입력
   * @param transaction Transaction
   * @returns Max(tran_id)
   */
  getMaxTranId = async(tranTypeId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('max', Sequelize.col('tran_id')), 'tran_id' ],
        ],
        where: { tran_type_id: tranTypeId },
        group: [ 'tran_type_id' ],
        transaction
      });

      if (!result) { return 0; }

      const maxTranId: number = (result as any).dataValues.tran_id;

      return maxTranId;
    } catch (error) {
      throw error;
    }
  }

  //#endregion
}

export default InvStoreRepo;