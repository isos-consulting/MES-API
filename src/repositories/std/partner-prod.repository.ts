import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdPartnerProd from '../../models/std/partner-prod.model';
import IStdPartnerProd from '../../interfaces/std/partner-prod.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdPartnerProdRepo {
  repo: Repository<StdPartnerProd>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdPartnerProd);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdPartnerProd[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((partnerProd: any) => {
        return this.repo.create(
          {
            partner_id: partnerProd.partner_id,
            prod_id: partnerProd.prod_id,
            partner_prod_no: partnerProd.partner_prod_no,
            remark: partnerProd.remark,
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
            model: this.sequelize.models.StdPartner, 
            attributes: [], 
            required: true,
            where: { uuid: params.partner_uuid ? params.partner_uuid : { [Op.ne]: null } },
            include: [{ model: this.sequelize.models.StdPartnerType, attributes: [], required: false }]
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
            ]
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdPartnerProd.uuid'), 'partner_prod_uuid' ],
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdPartner.partner_type_id'), 'partner_type_id' ],
          [ Sequelize.col('stdPartner.stdPartnerType.partner_type_cd'), 'partner_type_cd' ],
          [ Sequelize.col('stdPartner.stdPartnerType.partner_type_nm'), 'partner_type_nm' ],
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          'partner_prod_no',
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
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 
          Sequelize.col('stdPartner.partner_type_id'),
          'partner_id', 
          'prod_id', 
          'partner_prod_id' 
        ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findOne({ 
        include: [
          { 
            model: this.sequelize.models.StdPartner, 
            attributes: [], 
            required: true,
            include: [{ model: this.sequelize.models.StdPartnerType, attributes: [], required: false }]
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
            ]
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdPartnerProd.uuid'), 'partner_prod_uuid' ],
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdPartner.partner_type_id'), 'partner_type_id' ],
          [ Sequelize.col('stdPartner.stdPartnerType.partner_type_cd'), 'partner_type_cd' ],
          [ Sequelize.col('stdPartner.stdPartnerType.partner_type_nm'), 'partner_type_nm' ],
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          'partner_prod_no',
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
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { uuid },
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

  // 📒 Fn[readRawByUnique]: Unique Key를 통하여 Raw Data Read Function
  public readRawByUnique = async(
    params: { partner_id: number, prod_id: number }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { partner_id: params.partner_id },
          { prod_id: params.prod_id }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdPartnerProd[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((partnerProd: any) => {
        return this.repo.update(
          {
            partner_prod_no: partnerProd.partner_prod_no ?? null,
            remark: partnerProd.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: partnerProd.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdPartnerProd.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdPartnerProd[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((partnerProd: any) => {
        return this.repo.update(
          {
            partner_prod_no: partnerProd.partner_prod_no,
            remark: partnerProd.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: partnerProd.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdPartnerProd.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdPartnerProd[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((partnerProd: any) => {
        return this.repo.destroy({ where: { uuid: partnerProd.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdPartnerProd.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdPartnerProdRepo;