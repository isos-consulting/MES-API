import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdPartner from '../../models/std/partner.model';
import IStdPartner from '../../interfaces/std/partner.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError, WhereOptions } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdPartnerRepo {
  repo: Repository<StdPartner>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdPartner);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdPartner[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((partner: any) => {
        return this.repo.create(
          {
            partner_cd: partner.partner_cd,
            partner_nm: partner.partner_nm,
            partner_type_id: partner.partner_type_id,
            partner_no: partner.partner_no,
            boss_nm: partner.boss_nm,
            manager: partner.manager,
            email: partner.email,
            tel: partner.tel,
            fax: partner.fax,
            post: partner.post,
            addr: partner.addr,
            addr_detail: partner.addr_detail,
            use_fg: partner.use_fg,
            vendor_fg: partner.vendor_fg,
            customer_fg: partner.customer_fg,
            remark: partner.remark,
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
      let whereOptions: WhereOptions<StdPartner> = {};

      // 협력사, 고객사 여부를 [전체, 협력사만, 고객사만] 으로 Filetering 
      // params.partner_fg 재직여부 Type 변수 [0: 전체 조회], [1: 협력사 조회], [2: 고객사 조회]
      // params.partner_fg == undefined || null : where 문 만들지 않음
      // params.partner_fg == 1 : vendor_fg true, customer_fg false
      // params.partner_fg == 2 : vendor_fg false, customer_fg true

      if (params.partner_fg != null) {
        whereOptions = {
          [Op.and] : [
            { vendor_fg: params.partner_fg == 1 ? true : {[Op.ne]: null}},
            { customer_fg: params.partner_fg == 2 ? true : {[Op.ne]: null}}
          ]
        }
      }

      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.StdPartnerType, 
            attributes: [],
            where: { uuid: params.partner_type_uuid ? params.partner_type_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          'partner_cd',
          'partner_nm',
          [ Sequelize.col('stdPartnerType.uuid'), 'partner_type_uuid' ],
          [ Sequelize.col('stdPartnerType.partner_type_cd'), 'partner_type_cd' ],
          [ Sequelize.col('stdPartnerType.partner_type_nm'), 'partner_type_nm' ],
          'partner_no',
          'boss_nm',
          'manager',
          'email',
          'tel',
          'fax',
          'post',
          'addr',
          'addr_detail',
          'use_fg',
          'vendor_fg',
          'customer_fg',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'partner_type_id', 'partner_id' ],
        where: whereOptions
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
          { model: this.sequelize.models.StdPartnerType, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          'partner_cd',
          'partner_nm',
          [ Sequelize.col('stdPartnerType.uuid'), 'partner_type_uuid' ],
          [ Sequelize.col('stdPartnerType.partner_type_cd'), 'partner_type_cd' ],
          [ Sequelize.col('stdPartnerType.partner_type_nm'), 'partner_type_nm' ],
          'partner_no',
          'boss_nm',
          'manager',
          'email',
          'tel',
          'fax',
          'post',
          'addr',
          'addr_detail',
          'use_fg',
          'vendor_fg',
          'customer_fg',
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
  public readRawByUnique = async(params: { partner_cd: string }) => {
    const result = await this.repo.findOne({ where: { partner_cd: params.partner_cd } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdPartner[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((partner: any) => {
        return this.repo.update(
          {
            partner_cd: partner.partner_cd ?? null,
            partner_nm: partner.partner_nm ?? null,
            partner_type_id: partner.partner_type_id ?? null,
            partner_no: partner.partner_no ?? null,
            boss_nm: partner.boss_nm ?? null,
            manager: partner.manager ?? null,
            email: partner.email ?? null,
            tel: partner.tel ?? null,
            fax: partner.fax ?? null,
            post: partner.post ?? null,
            addr: partner.addr ?? null,
            addr_detail: partner.addr_detail ?? null,
            use_fg: partner.use_fg ?? null,
            vendor_fg: partner.vendor_fg ?? null,
            customer_fg: partner.customer_fg ?? null,
            remark: partner.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: partner.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdPartner.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdPartner[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((partner: any) => {
        return this.repo.update(
          {
            partner_cd: partner.partner_cd,
            partner_nm: partner.partner_nm,
            partner_type_id: partner.partner_type_id,
            partner_no: partner.partner_no,
            boss_nm: partner.boss_nm,
            manager: partner.manager,
            email: partner.email,
            tel: partner.tel,
            fax: partner.fax,
            post: partner.post,
            addr: partner.addr,
            addr_detail: partner.addr_detail,
            use_fg: partner.use_fg,
            vendor_fg: partner.vendor_fg,
            customer_fg: partner.customer_fg,
            remark: partner.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: partner.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdPartner.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdPartner[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((partner: any) => {
        return this.repo.destroy({ where: { uuid: partner.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdPartner.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdPartnerRepo;