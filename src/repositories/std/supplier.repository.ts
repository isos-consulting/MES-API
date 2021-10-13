import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdSupplier from '../../models/std/supplier.model';
import IStdSupplier from '../../interfaces/std/supplier.interface';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';

class StdSupplierRepo {
  repo: Repository<StdSupplier>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(StdSupplier);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdSupplier[], uid: number, transaction?: Transaction) => {
    try {
      const supplier = body.map((supplier) => {
        return {
          supplier_cd: supplier.supplier_cd,
          supplier_nm: supplier.supplier_nm,
          partner_id: supplier.partner_id,
          manager: supplier.manager,
          email: supplier.email,
          tel: supplier.tel,
          fax: supplier.fax,
          post: supplier.post,
          addr: supplier.addr,
          addr_detail: supplier.addr_detail,
          use_fg: supplier.use_fg,
          remark: supplier.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(supplier, { individualHooks: true, transaction });

      return convertBulkResult(result);
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
            model: sequelize.models.StdPartner, 
            attributes: [],
            where: { uuid: params.partner_uuid ? params.partner_uuid : { [Op.ne]: null } }
          },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdSupplier.uuid'), 'supplier_uuid' ],
          'supplier_cd',
          'supplier_nm',
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
        order: [ 'partner_id', 'supplier_id' ],
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
          { model: sequelize.models.StdPartner, attributes: [], required: false },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdSupplier.uuid'), 'supplier_uuid' ],
          'supplier_cd',
          'supplier_nm',
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
  public readRawByUnique = async(params: { supplier_cd: string }) => {
    const result = await this.repo.findOne({ where: { supplier_cd: params.supplier_cd } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdSupplier[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let supplier of body) {
        const result = await this.repo.update(
          {
            supplier_cd: supplier.supplier_cd != null ? supplier.supplier_cd : null,
            supplier_nm: supplier.supplier_nm != null ? supplier.supplier_nm : null,
            partner_id: supplier.partner_id != null ? supplier.partner_id : null,
            manager: supplier.manager != null ? supplier.manager : null,
            email: supplier.email != null ? supplier.email : null,
            tel: supplier.tel != null ? supplier.tel : null,
            fax: supplier.fax != null ? supplier.fax : null,
            post: supplier.post != null ? supplier.post : null,
            addr: supplier.addr != null ? supplier.addr : null,
            addr_detail: supplier.addr_detail != null ? supplier.addr_detail : null,
            use_fg: supplier.use_fg != null ? supplier.use_fg : null,
            remark: supplier.remark != null ? supplier.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: supplier.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.StdSupplier.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdSupplier[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let supplier of body) {
        const result = await this.repo.update(
          {
            supplier_cd: supplier.supplier_cd,
            supplier_nm: supplier.supplier_nm,
            partner_id: supplier.partner_id,
            manager: supplier.manager,
            email: supplier.email,
            tel: supplier.tel,
            fax: supplier.fax,
            post: supplier.post,
            addr: supplier.addr,
            addr_detail: supplier.addr_detail,
            use_fg: supplier.use_fg,
            remark: supplier.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: supplier.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.StdSupplier.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdSupplier[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let supplier of body) {
        count += await this.repo.destroy({ where: { uuid: supplier.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.StdSupplier.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  
  //#endregion

  //#endregion
}

export default StdSupplierRepo;