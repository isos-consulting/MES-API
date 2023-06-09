import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdDelivery from '../../models/std/delivery.model';
import IStdDelivery from '../../interfaces/std/delivery.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdDeliveryRepo {
  repo: Repository<StdDelivery>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdDelivery);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdDelivery[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((delivery: any) => {
        return this.repo.create(
          {
            delivery_cd: delivery.delivery_cd,
            delivery_nm: delivery.delivery_nm,
            partner_id: delivery.partner_id,
            manager: delivery.manager,
            email: delivery.email,
            tel: delivery.tel,
            fax: delivery.fax,
            post: delivery.post,
            addr: delivery.addr,
            addr_detail: delivery.addr_detail,
            use_fg: delivery.use_fg,
            remark: delivery.remark,
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
            where: { uuid: params.partner_uuid ? params.partner_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdDelivery.uuid'), 'delivery_uuid' ],
          'delivery_cd',
          'delivery_nm',
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          'manager',
          'email',
          'tel',
          'fax',
          'post',
          'addr',
          'addr_detail',
          'use_fg',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'delivery_id' ],
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
          { model: this.sequelize.models.StdPartner, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdDelivery.uuid'), 'delivery_uuid' ],
          'delivery_cd',
          'delivery_nm',
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          'manager',
          'email',
          'tel',
          'fax',
          'post',
          'addr',
          'addr_detail',
          'use_fg',
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
  public readRawByUnique = async(params: { delivery_cd: string }) => {
    const result = await this.repo.findOne({ where: { delivery_cd: params.delivery_cd } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdDelivery[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((delivery: any) => {
        return this.repo.update(
          {
            delivery_cd: delivery.delivery_cd ?? null,
            delivery_nm: delivery.delivery_nm ?? null,
            partner_id: delivery.partner_id ?? null,
            manager: delivery.manager ?? null,
            email: delivery.email ?? null,
            tel: delivery.tel ?? null,
            fax: delivery.fax ?? null,
            post: delivery.post ?? null,
            addr: delivery.addr ?? null,
            addr_detail: delivery.addr_detail ?? null,
            use_fg: delivery.use_fg ?? null,
            remark: delivery.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: delivery.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdDelivery.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Patch Functions
  
  // 📒 Fn[update]: Default Update Function
  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdDelivery[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((delivery: any) => {
        return this.repo.update(
          {
            delivery_cd: delivery.delivery_cd,
            delivery_nm: delivery.delivery_nm,
            partner_id: delivery.partner_id,
            manager: delivery.manager,
            email: delivery.email,
            tel: delivery.tel,
            fax: delivery.fax,
            post: delivery.post,
            addr: delivery.addr,
            addr_detail: delivery.addr_detail,
            use_fg: delivery.use_fg,
            remark: delivery.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: delivery.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdDelivery.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdDelivery[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);
      
      const promises = body.map((delivery: any) => {
        return this.repo.destroy({ where: { uuid: delivery.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdDelivery.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdDeliveryRepo;