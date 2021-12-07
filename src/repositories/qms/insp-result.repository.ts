import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError, WhereOptions } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import QmsInspResult from '../../models/qms/insp-result.model';
import IQmsInspResult from '../../interfaces/qms/insp-result.interface';
import getInspTypeCd from '../../utils/getInspTypeCd';
import { readWaitingReceive } from '../../queries/qms/waiting-receive.query';

class QmsInspResultRepo {
  repo: Repository<QmsInspResult>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(QmsInspResult);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IQmsInspResult[], uid: number, transaction?: Transaction) => {
    try {
      const insp = body.map((insp) => {
        return {
          factory_id: insp.factory_id,
          insp_type_cd: insp.insp_type_cd,
          insp_detail_type_cd: insp.insp_detail_type_cd,
          insp_handling_type_cd: insp.insp_handling_type_cd,
          insp_reference_id: insp.insp_reference_id,
          seq: insp.seq,
          insp_id: insp.insp_id,
          prod_id: insp.prod_id,
          lot_no: insp.lot_no,
          emp_id: insp.emp_id,
          reg_date: insp.reg_date,
          insp_result_fg: insp.insp_result_fg,
          insp_qty: insp.insp_qty,
          pass_qty: insp.pass_qty,
          reject_qty: insp.reject_qty,
          reject_id: insp.reject_id,
          from_store_id: insp.from_store_id,
          from_location_id: insp.from_location_id,
          to_store_id: insp.to_store_id,
          to_location_id: insp.to_location_id,
          reject_store_id: insp.reject_store_id,
          reject_location_id: insp.reject_location_id,
          remark: insp.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(insp, { individualHooks: true, transaction });

      return convertBulkResult(result);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  //#endregion

  //#region 🔵 Read Functions
  
  //#region 📌 Receive Insp (수입검사)
  // 📒 Fn[readWaitingReceive]: 수입검사 성적서 대기 List Read Function
  public readWaitingReceive = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readWaitingReceive(params));
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readMatReceive]: 수입검사(자재입하기준) Read Function
  public readMatReceive = async(params?: any) => {
    try {
      const dateWhereOptions: WhereOptions<QmsInspResult> = {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('date', Sequelize.col('qmsInspResult.reg_date')), '>=', params.start_date),
          Sequelize.where(Sequelize.fn('date', Sequelize.col('qmsInspResult.reg_date')), '<=', params.end_date),
        ]
      };

      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AdmInspType, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspDetailType, attributes: [], required: false },
          { model: this.sequelize.models.AdmInspHandlingType, attributes: [], required: false },
          { 
            model: this.sequelize.models.MatReceiveDetail,
            attributes: [],
            required: true,
            include: [
              { 
                model: this.sequelize.models.MatReceive, 
                attributes: [], 
                required: true,
                include: [{ model: this.sequelize.models.StdPartner, attributes: [], required: true }]
              },
              { model: this.sequelize.models.StdUnit, attributes: [], required: true },
            ],
            where: { uuid: params.receive_detail_uuid ? params.receive_detail_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.QmsInsp, attributes: [], required: true },
          {
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
            ],
            where: { uuid: params.prod_uuid ? params.prod_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdReject, 
            attributes: [], 
            required: false,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }]
          },
          { model: this.sequelize.models.StdStore, as: 'toStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'toLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'rejectStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'rejectLocation', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_type_cd',
          [ Sequelize.col('admInspType.insp_type_nm'), 'insp_type_nm' ],
          'insp_detail_type_cd',
          [ Sequelize.col('admInspDetailType.insp_detail_type_nm'), 'insp_detail_type_nm' ],
          'insp_handling_type_cd',
          [ Sequelize.col('admInspHandlingType.insp_handling_type_nm'), 'insp_handling_type_nm' ],
          [ Sequelize.col('matReceiveDetail.uuid'), 'receive_detail_uuid' ],
          [ Sequelize.fn('concat', Sequelize.col('matReceiveDetail.matReceive.stmt_no'), '-', Sequelize.col('matReceiveDetail.seq')), 'stmt_no_sub'],
          [ Sequelize.col('matReceiveDetail.matReceive.reg_date'), 'receive_date' ],
          [ Sequelize.col('matReceiveDetail.matReceive.stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('matReceiveDetail.matReceive.stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('qmsInsp.insp_no'), 'insp_no' ],
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
          [ Sequelize.col('matReceiveDetail.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('matReceiveDetail.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('matReceiveDetail.stdUnit.unit_nm'), 'unit_nm' ],
          'lot_no',
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'reg_date',
          'insp_result_fg',
          [ Sequelize.literal(`CASE qmsInspResult.insp_result_fg WHEN TRUE THEN '합격' WHEN FALSE THEN '불합격' ELSE '검사중' END`), 'insp_result_state' ],
          'insp_qty',
          'pass_qty',
          'reject_qty',
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('toStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('toStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('toStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('toLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('toLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('toLocation.location_nm'), 'to_location_nm' ],
          [ Sequelize.col('rejectStore.uuid'), 'reject_store_uuid' ],
          [ Sequelize.col('rejectStore.store_cd'), 'reject_store_cd' ],
          [ Sequelize.col('rejectStore.store_nm'), 'reject_store_nm' ],
          [ Sequelize.col('rejectLocation.uuid'), 'reject_location_uuid' ],
          [ Sequelize.col('rejectLocation.location_cd'), 'reject_location_cd' ],
          [ Sequelize.col('rejectLocation.location_nm'), 'reject_location_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.and]: [
            params.start_date && params.end_date ? dateWhereOptions : {},
            { insp_detail_type_cd: 'MAT_RECEIVE' },
            { insp_type_cd: getInspTypeCd('RECEIVE_INSP') }
          ]
        },
        order: [ 'factory_id', 'insp_reference_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readMatReceiveByUuid]: 수입검사(자재입하기준) Read With Uuid Function
  public readMatReceiveByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findOne({ 
        include: [
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspType, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspDetailType, attributes: [], required: false },
          { model: this.sequelize.models.AdmInspHandlingType, attributes: [], required: false },
          { 
            model: this.sequelize.models.MatReceiveDetail,
            attributes: [],
            required: true,
            include: [
              { 
                model: this.sequelize.models.MatReceive, 
                attributes: [], 
                required: true,
                include: [{ model: this.sequelize.models.StdPartner, attributes: [], required: true }]
              },
              { model: this.sequelize.models.StdUnit, attributes: [], required: true }
            ],
          },
          { model: this.sequelize.models.QmsInsp, attributes: [], required: true },
          {
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
            ]
          },
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdReject, 
            attributes: [], 
            required: false,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }]
          },
          { model: this.sequelize.models.StdStore, as: 'toStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'toLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'rejectStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'rejectLocation', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_type_cd',
          [ Sequelize.col('admInspType.insp_type_nm'), 'insp_type_nm' ],
          'insp_detail_type_cd',
          [ Sequelize.col('admInspDetailType.insp_detail_type_nm'), 'insp_detail_type_nm' ],
          'insp_handling_type_cd',
          [ Sequelize.col('admInspHandlingType.insp_handling_type_nm'), 'insp_handling_type_nm' ],
          [ Sequelize.col('matReceiveDetail.uuid'), 'receive_detail_uuid' ],
          [ Sequelize.fn('concat', Sequelize.col('matReceiveDetail.matReceive.stmt_no'), '-', Sequelize.col('matReceiveDetail.seq')), 'stmt_no_sub'],
          [ Sequelize.col('matReceiveDetail.matReceive.reg_date'), 'receive_date' ],
          [ Sequelize.col('matReceiveDetail.matReceive.stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('matReceiveDetail.matReceive.stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('qmsInsp.insp_no'), 'insp_no' ],
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
          [ Sequelize.col('matReceiveDetail.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('matReceiveDetail.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('matReceiveDetail.stdUnit.unit_nm'), 'unit_nm' ],
          'lot_no',
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'reg_date',
          'insp_result_fg',
          [ Sequelize.literal(`CASE qmsInspResult.insp_result_fg WHEN TRUE THEN '합격' WHEN FALSE THEN '불합격' ELSE '검사중' END`), 'insp_result_state' ],
          'insp_qty',
          'pass_qty',
          'reject_qty',
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('toStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('toStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('toStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('toLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('toLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('toLocation.location_nm'), 'to_location_nm' ],
          [ Sequelize.col('rejectStore.uuid'), 'reject_store_uuid' ],
          [ Sequelize.col('rejectStore.store_cd'), 'reject_store_cd' ],
          [ Sequelize.col('rejectStore.store_nm'), 'reject_store_nm' ],
          [ Sequelize.col('rejectLocation.uuid'), 'reject_location_uuid' ],
          [ Sequelize.col('rejectLocation.location_cd'), 'reject_location_cd' ],
          [ Sequelize.col('rejectLocation.location_nm'), 'reject_location_nm' ],
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

  // 📒 Fn[readMatReceiveByReceiveUuids]: 자재입하상세 UUID에 해당하는 수입검사 데이터 조회
  public readMatReceiveByReceiveUuids = async(uuids: string[]) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.MatReceiveDetail,
            attributes: [],
            required: true,
            where: { uuid: uuids }
          },
        ],
        where: {
          [Op.and]: [
            { insp_detail_type_cd: 'MAT_RECEIVE' },
            { insp_type_cd: getInspTypeCd('RECEIVE_INSP') }
          ]
        }
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readOutReceive]: 수입검사(외주입하기준) Read Function
  public readOutReceive = async(params?: any) => {
    try {
      const dateWhereOptions: WhereOptions<QmsInspResult> = {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('date', Sequelize.col('qmsInspResult.reg_date')), '>=', params.start_date),
          Sequelize.where(Sequelize.fn('date', Sequelize.col('qmsInspResult.reg_date')), '<=', params.end_date),
        ]
      };

      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AdmInspType, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspDetailType, attributes: [], required: false },
          { model: this.sequelize.models.AdmInspHandlingType, attributes: [], required: false },
          { 
            model: this.sequelize.models.OutReceiveDetail,
            attributes: [],
            required: true,
            include: [
              { 
                model: this.sequelize.models.OutReceive, 
                attributes: [], 
                required: true,
                include: [{ model: this.sequelize.models.StdPartner, attributes: [], required: true }]
              },
              { model: this.sequelize.models.StdUnit, attributes: [], required: true }
            ],
            where: { uuid: params.receive_detail_uuid ? params.receive_detail_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.QmsInsp, attributes: [], required: true },
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
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdReject, 
            attributes: [], 
            required: false,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }]
          },
          { model: this.sequelize.models.StdStore, as: 'toStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'toLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'rejectStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'rejectLocation', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_type_cd',
          [ Sequelize.col('admInspType.insp_type_nm'), 'insp_type_nm' ],
          'insp_detail_type_cd',
          [ Sequelize.col('admInspDetailType.insp_detail_type_nm'), 'insp_detail_type_nm' ],
          'insp_handling_type_cd',
          [ Sequelize.col('admInspHandlingType.insp_handling_type_nm'), 'insp_handling_type_nm' ],
          [ Sequelize.col('outReceiveDetail.uuid'), 'receive_detail_uuid' ],
          [ Sequelize.fn('concat', Sequelize.col('outReceiveDetail.outReceive.stmt_no'), '-', Sequelize.col('outReceiveDetail.seq')), 'stmt_no_sub'],
          [ Sequelize.col('outReceiveDetail.outReceive.reg_date'), 'receive_date' ],
          [ Sequelize.col('outReceiveDetail.outReceive.stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('outReceiveDetail.outReceive.stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('qmsInsp.insp_no'), 'insp_no' ],
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
          [ Sequelize.col('outReceiveDetail.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('outReceiveDetail.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('outReceiveDetail.stdUnit.unit_nm'), 'unit_nm' ],
          'lot_no',
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'reg_date',
          'insp_result_fg',
          [ Sequelize.literal(`CASE qmsInspResult.insp_result_fg WHEN TRUE THEN '합격' WHEN FALSE THEN '불합격' ELSE '검사중' END`), 'insp_result_state' ],
          'insp_qty',
          'pass_qty',
          'reject_qty',
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('toStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('toStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('toStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('toLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('toLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('toLocation.location_nm'), 'to_location_nm' ],
          [ Sequelize.col('rejectStore.uuid'), 'reject_store_uuid' ],
          [ Sequelize.col('rejectStore.store_cd'), 'reject_store_cd' ],
          [ Sequelize.col('rejectStore.store_nm'), 'reject_store_nm' ],
          [ Sequelize.col('rejectLocation.uuid'), 'reject_location_uuid' ],
          [ Sequelize.col('rejectLocation.location_cd'), 'reject_location_cd' ],
          [ Sequelize.col('rejectLocation.location_nm'), 'reject_location_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.and]: [
            params.start_date && params.end_date ? dateWhereOptions : {},
            { insp_detail_type_cd: 'OUT_RECEIVE' },
            { insp_type_cd: getInspTypeCd('RECEIVE_INSP') }
          ]
        },
        order: [ 'factory_id', 'insp_reference_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readOutReceiveByUuid]: 수입검사(외주입하기준) Read With Uuid Function
  public readOutReceiveByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspType, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspDetailType, attributes: [], required: false },
          { model: this.sequelize.models.AdmInspHandlingType, attributes: [], required: false },
          { 
            model: this.sequelize.models.OutReceiveDetail,
            attributes: [],
            required: true,
            include: [
              { 
                model: this.sequelize.models.OutReceive, 
                attributes: [], 
                required: true,
                include: [{ model: this.sequelize.models.StdPartner, attributes: [], required: true }]
              },
              { model: this.sequelize.models.StdUnit, attributes: [], required: true }
            ],
          },
          { model: this.sequelize.models.QmsInsp, attributes: [], required: true },
          {
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ]
          },
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdReject, 
            attributes: [], 
            required: false,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }]
          },
          { model: this.sequelize.models.StdStore, as: 'toStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'toLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'rejectStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'rejectLocation', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_type_cd',
          [ Sequelize.col('admInspType.insp_type_nm'), 'insp_type_nm' ],
          'insp_detail_type_cd',
          [ Sequelize.col('admInspDetailType.insp_detail_type_nm'), 'insp_detail_type_nm' ],
          'insp_handling_type_cd',
          [ Sequelize.col('admInspHandlingType.insp_handling_type_nm'), 'insp_handling_type_nm' ],
          [ Sequelize.col('outReceiveDetail.uuid'), 'receive_detail_uuid' ],
          [ Sequelize.fn('concat', Sequelize.col('outReceiveDetail.outReceive.stmt_no'), '-', Sequelize.col('outReceiveDetail.seq')), 'stmt_no_sub'],
          [ Sequelize.col('outReceiveDetail.outReceive.reg_date'), 'receive_date' ],
          [ Sequelize.col('outReceiveDetail.outReceive.stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('outReceiveDetail.outReceive.stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('qmsInsp.insp_no'), 'insp_no' ],
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
          [ Sequelize.col('outReceiveDetail.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('outReceiveDetail.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('outReceiveDetail.stdUnit.unit_nm'), 'unit_nm' ],
          'lot_no',
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'reg_date',
          'insp_result_fg',
          [ Sequelize.literal(`CASE qmsInspResult.insp_result_fg WHEN TRUE THEN '합격' WHEN FALSE THEN '불합격' ELSE '검사중' END`), 'insp_result_state' ],
          'insp_qty',
          'pass_qty',
          'reject_qty',
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('toStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('toStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('toStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('toLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('toLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('toLocation.location_nm'), 'to_location_nm' ],
          [ Sequelize.col('rejectStore.uuid'), 'reject_store_uuid' ],
          [ Sequelize.col('rejectStore.store_cd'), 'reject_store_cd' ],
          [ Sequelize.col('rejectStore.store_nm'), 'reject_store_nm' ],
          [ Sequelize.col('rejectLocation.uuid'), 'reject_location_uuid' ],
          [ Sequelize.col('rejectLocation.location_cd'), 'reject_location_cd' ],
          [ Sequelize.col('rejectLocation.location_nm'), 'reject_location_nm' ],
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

  // 📒 Fn[readOutReceiveByReceiveUuids]: 외주입하상세 UUID에 해당하는 수입검사 데이터 조회
  public readOutReceiveByReceiveUuids = async(uuids: string[]) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.OutReceiveDetail,
            attributes: [],
            required: true,
            where: { uuid: uuids }
          },
        ],
        where: {
          [Op.and]: [
            { insp_detail_type_cd: 'OUT_RECEIVE' },
            { insp_type_cd: getInspTypeCd('RECEIVE_INSP') }
          ]
        }
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };
  //#endregion

  //#region 📌 Proc Insp (공정검사)
  // 📒 Fn[readProc]: 공정검사 Read Function
  public readProc = async(params?: any) => {
    try {
      const dateWhereOptions: WhereOptions<QmsInspResult> = {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('date', Sequelize.col('qmsInspResult.reg_date')), '>=', params.start_date),
          Sequelize.where(Sequelize.fn('date', Sequelize.col('qmsInspResult.reg_date')), '<=', params.end_date),
        ]
      };

      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AdmInspType, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspDetailType, attributes: [], required: false },
          { 
            model: this.sequelize.models.PrdWork,
            attributes: [],
            required: true,
            where: { uuid: params.work_uuid ? params.work_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.QmsInsp, attributes: [], required: true },
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
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_type_cd',
          [ Sequelize.col('admInspType.insp_type_nm'), 'insp_type_nm' ],
          'insp_detail_type_cd',
          [ Sequelize.col('admInspDetailType.insp_detail_type_nm'), 'insp_detail_type_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          'seq',
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('qmsInsp.insp_no'), 'insp_no' ],
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
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'reg_date',
          'insp_result_fg',
          [ Sequelize.literal(`CASE qmsInspResult.insp_result_fg WHEN TRUE THEN '합격' WHEN FALSE THEN '불합격' ELSE '검사중' END`), 'insp_result_state' ],
          'insp_qty',
          'pass_qty',
          'reject_qty',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.and]: [
            params.start_date && params.end_date ? dateWhereOptions : {},
            { insp_type_cd: getInspTypeCd('PROC_INSP') },
            { insp_detail_type_cd: params.insp_detail_type_cd ? params.insp_detail_type_cd : { [Op.ne]: null } },
            { seq: params.seq ? params.seq : { [Op.ne]: null } }
          ]
        },
        order: [ 'factory_id', 'insp_reference_id', 'seq' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readProcByUuid]: 공정검사 Read With Uuid Function
  public readProcByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findOne({ 
        include: [
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspType, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspDetailType, attributes: [], required: false },
          { model: this.sequelize.models.PrdWork, attributes: [], required: true },
          { model: this.sequelize.models.QmsInsp, attributes: [], required: true },
          {
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ]
          },
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_type_cd',
          [ Sequelize.col('admInspType.insp_type_nm'), 'insp_type_nm' ],
          'insp_detail_type_cd',
          [ Sequelize.col('admInspDetailType.insp_detail_type_nm'), 'insp_detail_type_nm' ],
          [ Sequelize.col('prdWork.uuid'), 'work_uuid' ],
          'seq',
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('qmsInsp.insp_no'), 'insp_no' ],
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
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'reg_date',
          'insp_result_fg',
          [ Sequelize.literal(`CASE qmsInspResult.insp_result_fg WHEN TRUE THEN '합격' WHEN FALSE THEN '불합격' ELSE '검사중' END`), 'insp_result_state' ],
          'insp_qty',
          'pass_qty',
          'reject_qty',
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

  // 📒 Fn[readProcByWorkId]: 생산실적 UUID에 해당하는 공정검사 데이터 조회
  public readProcByWorkId = async(workId: number) => {
    try {
      const result = await this.repo.findAll({ 
        where: {
          [Op.and]: [
            { insp_reference_id: workId },
            { insp_detail_type_cd: [ 'SELF_PROC', 'PATROL_PROC' ] },
            { insp_type_cd: getInspTypeCd('PROC_INSP') }
          ]
        }
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };
  //#endregion

  //#region 📌 Final Insp (최종검사)
  // 📒 Fn[readFinal]: 최종검사 Read Function
  public readFinal = async(params?: any) => {
    try {
      const dateWhereOptions: WhereOptions<QmsInspResult> = {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('date', Sequelize.col('qmsInspResult.reg_date')), '>=', params.start_date),
          Sequelize.where(Sequelize.fn('date', Sequelize.col('qmsInspResult.reg_date')), '<=', params.end_date),
        ]
      };

      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AdmInspType, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspHandlingType, attributes: [], required: false },
          { model: this.sequelize.models.QmsInsp, attributes: [], required: true },
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
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdReject, 
            attributes: [], 
            required: false,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }]
          },
          { model: this.sequelize.models.StdStore, as: 'fromStore', attributes: [], required: true },
          { model: this.sequelize.models.StdLocation, as: 'fromLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'toStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'toLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'rejectStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'rejectLocation', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_type_cd',
          [ Sequelize.col('admInspType.insp_type_nm'), 'insp_type_nm' ],
          'insp_handling_type_cd',
          [ Sequelize.col('admInspHandlingType.insp_handling_type_nm'), 'insp_handling_type_nm' ],
          'seq',
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('qmsInsp.insp_no'), 'insp_no' ],
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
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'reg_date',
          'insp_result_fg',
          [ Sequelize.literal(`CASE qmsInspResult.insp_result_fg WHEN TRUE THEN '합격' WHEN FALSE THEN '불합격' ELSE '검사중' END`), 'insp_result_state' ],
          'insp_qty',
          'pass_qty',
          'reject_qty',
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('fromStore.uuid'), 'from_store_uuid' ],
          [ Sequelize.col('fromStore.store_cd'), 'from_store_cd' ],
          [ Sequelize.col('fromStore.store_nm'), 'from_store_nm' ],
          [ Sequelize.col('fromLocation.uuid'), 'from_location_uuid' ],
          [ Sequelize.col('fromLocation.location_cd'), 'from_location_cd' ],
          [ Sequelize.col('fromLocation.location_nm'), 'from_location_nm' ],
          [ Sequelize.col('toStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('toStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('toStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('toLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('toLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('toLocation.location_nm'), 'to_location_nm' ],
          [ Sequelize.col('rejectStore.uuid'), 'reject_store_uuid' ],
          [ Sequelize.col('rejectStore.store_cd'), 'reject_store_cd' ],
          [ Sequelize.col('rejectStore.store_nm'), 'reject_store_nm' ],
          [ Sequelize.col('rejectLocation.uuid'), 'reject_location_uuid' ],
          [ Sequelize.col('rejectLocation.location_cd'), 'reject_location_cd' ],
          [ Sequelize.col('rejectLocation.location_nm'), 'reject_location_nm' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: {
          [Op.and]: [
            params.start_date && params.end_date ? dateWhereOptions : {},
            { insp_type_cd: getInspTypeCd('FINAL_INSP') }
          ]
        },
        order: [ 'factory_id', 'insp_reference_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readFinalByUuid]: 최종검사 Read With Uuid Function
  public readFinalByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspType, attributes: [], required: true },
          { model: this.sequelize.models.AdmInspHandlingType, attributes: [], required: false },
          { model: this.sequelize.models.QmsInsp, attributes: [], required: true },
          {
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ]
          },
          { model: this.sequelize.models.StdEmp, attributes: [], required: true },
          { 
            model: this.sequelize.models.StdReject, 
            attributes: [], 
            required: false,
            include: [{ model: this.sequelize.models.StdRejectType, attributes: [], required: false }]
          },
          { model: this.sequelize.models.StdStore, as: 'fromStore', attributes: [], required: true },
          { model: this.sequelize.models.StdLocation, as: 'fromLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'toStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'toLocation', attributes: [], required: false },
          { model: this.sequelize.models.StdStore, as: 'rejectStore', attributes: [], required: false },
          { model: this.sequelize.models.StdLocation, as: 'rejectLocation', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('qmsInspResult.uuid'), 'insp_result_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'insp_type_cd',
          [ Sequelize.col('admInspType.insp_type_nm'), 'insp_type_nm' ],
          'insp_handling_type_cd',
          [ Sequelize.col('admInspHandlingType.insp_handling_type_nm'), 'insp_handling_type_nm' ],
          'seq',
          [ Sequelize.col('qmsInsp.uuid'), 'insp_uuid' ],
          [ Sequelize.col('qmsInsp.insp_no'), 'insp_no' ],
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
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          [ Sequelize.col('stdEmp.emp_cd'), 'emp_cd' ],
          [ Sequelize.col('stdEmp.emp_nm'), 'emp_nm' ],
          'reg_date',
          'insp_result_fg',
          [ Sequelize.literal(`CASE qmsInspResult.insp_result_fg WHEN TRUE THEN '합격' WHEN FALSE THEN '불합격' ELSE '검사중' END`), 'insp_result_state' ],
          'insp_qty',
          'pass_qty',
          'reject_qty',
          [ Sequelize.col('stdReject.stdRejectType.uuid'), 'reject_type_uuid' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_cd'), 'reject_type_cd' ],
          [ Sequelize.col('stdReject.stdRejectType.reject_type_nm'), 'reject_type_nm' ],
          [ Sequelize.col('stdReject.uuid'), 'reject_uuid' ],
          [ Sequelize.col('stdReject.reject_cd'), 'reject_cd' ],
          [ Sequelize.col('stdReject.reject_nm'), 'reject_nm' ],
          [ Sequelize.col('fromStore.uuid'), 'from_store_uuid' ],
          [ Sequelize.col('fromStore.store_cd'), 'from_store_cd' ],
          [ Sequelize.col('fromStore.store_nm'), 'from_store_nm' ],
          [ Sequelize.col('fromLocation.uuid'), 'from_location_uuid' ],
          [ Sequelize.col('fromLocation.location_cd'), 'from_location_cd' ],
          [ Sequelize.col('fromLocation.location_nm'), 'from_location_nm' ],
          [ Sequelize.col('toStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('toStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('toStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('toLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('toLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('toLocation.location_nm'), 'to_location_nm' ],
          [ Sequelize.col('rejectStore.uuid'), 'reject_store_uuid' ],
          [ Sequelize.col('rejectStore.store_cd'), 'reject_store_cd' ],
          [ Sequelize.col('rejectStore.store_nm'), 'reject_store_nm' ],
          [ Sequelize.col('rejectLocation.uuid'), 'reject_location_uuid' ],
          [ Sequelize.col('rejectLocation.location_cd'), 'reject_location_cd' ],
          [ Sequelize.col('rejectLocation.location_nm'), 'reject_location_nm' ],
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
  //#endregion

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

  // 📒 Fn[readByRegDate]: RegDate를 통하여 Raw Data Read Function
  public readByRegDate = async(date: string) => {
    const result = await this.repo.findAll({ where: { reg_date: date } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IQmsInspResult[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        const result = await this.repo.update(
          {
            emp_id: insp.emp_id != null ? insp.emp_id : null,
            insp_result_fg: insp.insp_result_fg != null ? insp.insp_result_fg : null,
            insp_qty: insp.insp_qty != null ? insp.insp_qty : null,
            pass_qty: insp.pass_qty != null ? insp.pass_qty : null,
            reject_qty: insp.reject_qty != null ? insp.reject_qty : null,
            reject_id: insp.reject_id != null ? insp.reject_id : null,
            from_store_id: insp.from_store_id != null ? insp.from_store_id : null,
            from_location_id: insp.from_location_id != null ? insp.from_location_id : null,
            to_store_id: insp.to_store_id != null ? insp.to_store_id : null,
            to_location_id: insp.to_location_id != null ? insp.to_location_id : null,
            reject_store_id: insp.reject_store_id != null ? insp.reject_store_id : null,
            reject_location_id: insp.reject_location_id != null ? insp.reject_location_id : null,
            remark: insp.remark != null ? insp.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: insp.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.QmsInspResult.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions

  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IQmsInspResult[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        const result = await this.repo.update(
          {
            emp_id: insp.emp_id,
            insp_result_fg: insp.insp_result_fg,
            insp_qty: insp.insp_qty,
            pass_qty: insp.pass_qty,
            reject_qty: insp.reject_qty,
            remark: insp.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: insp.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.QmsInspResult.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IQmsInspResult[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let insp of body) {
        count += await this.repo.destroy({ where: { uuid: insp.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.QmsInspResult.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion

  //#region ✅ Other Functions

  // 📒 Fn[getMaxSeq]: 성적서의 Max Sequence 조회
  /**
   * 성적서의 Max Sequence 조회
   * @param inspTypeCd 검사유형 코드
   * @param inspDetailTypeCd 세부검사유형 코드
   * @param inspReferenceId 전표 ID
   * @param transaction Transaction
   * @returns Max Sequence
   */
  getMaxSeq = async(inspTypeCd: string, inspDetailTypeCd: string, inspReferenceId: number, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [
          [ Sequelize.fn('max', Sequelize.col('seq')), 'seq' ],
        ],
        where: { 
          [Op.and]: [
            { insp_type_cd: inspTypeCd },
            { insp_detail_type_cd: inspDetailTypeCd },
            { insp_reference_id: inspReferenceId },
          ]
        },
        group: [ 'insp_type_cd', 'insp_detail_type_cd', 'insp_reference_id' ],
        transaction
      });

      if (!result) { return result; }

      const maxSeq: number = (result as any).dataValues.seq;

      return maxSeq;
    } catch (error) {
      return 0;
    }
  }

  //#endregion
}

export default QmsInspResultRepo;