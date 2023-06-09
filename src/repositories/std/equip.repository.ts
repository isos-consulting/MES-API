import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdEquip from '../../models/std/equip.model';
import IStdEquip from '../../interfaces/std/equip.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdEquipRepo {
  repo: Repository<StdEquip>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdEquip);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdEquip[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((equip: any) => {
        return this.repo.create(
          {
            factory_id: equip.factory_id,
            equip_type_id: equip.equip_type_id,
            equip_cd: equip.equip_cd,
            equip_nm: equip.equip_nm,
            workings_id: equip.workings_id,
            manager_emp_id: equip.manager_emp_id,
            sub_manager_emp_id: equip.sub_manager_emp_id,
            equip_no: equip.equip_no,
            equip_grade: equip.equip_grade,
            equip_model: equip.equip_model,
            equip_std: equip.equip_std,
            equip_spec: equip.equip_spec,
            voltage: equip.voltage,
            manufacturer: equip.manufacturer,
            purchase_partner: equip.purchase_partner,
            purchase_date: equip.purchase_date,
            purchase_tel: equip.purchase_tel,
            purchase_price: equip.purchase_price,
            use_fg: equip.use_fg,
            prd_fg: equip.prd_fg,
            remark: equip.remark,
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
            where: { uuid: params.factory_uuid ?? { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.StdEquipType, 
            attributes: [], 
            required: false, 
            where: { uuid: params.equip_type_uuid ?? { [Op.ne]: null } }
          },
          { 
            model: this.sequelize.models.StdWorkings, 
            attributes: [], 
            required: false, 
            where: { uuid: params.workings_uuid ?? { [Op.ne]: null } }
          },
          { model: this.sequelize.models.StdEmp, as: 'managerEmp', attributes: [], required: false },
          { model: this.sequelize.models.StdEmp, as: 'subManagerEmp', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdEquipType.uuid'), 'equip_type_uuid' ],
          [ Sequelize.col('stdEquipType.equip_type_cd'), 'equip_type_cd' ],
          [ Sequelize.col('stdEquipType.equip_type_nm'), 'equip_type_nm' ],
          'equip_cd',
          'equip_nm',
          [ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.col('managerEmp.uuid'), 'manager_emp_uuid' ],
          [ Sequelize.col('managerEmp.emp_cd'), 'manager_emp_cd' ],
          [ Sequelize.col('managerEmp.emp_nm'), 'manager_emp_nm' ],
          [ Sequelize.col('subManagerEmp.uuid'), 'sub_manager_emp_uuid' ],
          [ Sequelize.col('subManagerEmp.emp_cd'), 'sub_manager_emp_cd' ],
          [ Sequelize.col('subManagerEmp.emp_nm'), 'sub_manager_emp_nm' ],
					'equip_no',
					'equip_grade',
					'equip_model',
					'equip_std',
					'equip_spec',
					'manufacturer',
					'voltage',
					'purchase_partner',
					'purchase_date',
					'purchase_tel',
					'purchase_price',
          'use_fg',
          'prd_fg',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { 
          [Op.and]: [
            { use_fg: params.use_fg != null ? params.use_fg : { [Op.ne]: null } },
            { prd_fg: params.prd_fg != null ? params.prd_fg : { [Op.ne]: null } }
          ]
        },
        order: [ 'factory_id', 'equip_type_id', 'equip_id' ],
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
          { model: this.sequelize.models.StdFactory, attributes: [], required: true },
          { model: this.sequelize.models.StdEquipType, attributes: [], required: false },
          { model: this.sequelize.models.StdWorkings, attributes: [], required: false },
          { model: this.sequelize.models.StdEmp, as: 'managerEmp', attributes: [], required: false },
          { model: this.sequelize.models.StdEmp, as: 'subManagerEmp', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          [ Sequelize.col('stdEquipType.uuid'), 'equip_type_uuid' ],
          [ Sequelize.col('stdEquipType.equip_type_cd'), 'equip_type_cd' ],
          [ Sequelize.col('stdEquipType.equip_type_nm'), 'equip_type_nm' ],
          'equip_cd',
          'equip_nm',
					[ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('stdWorkings.workings_nm'), 'workings_nm' ],
          [ Sequelize.col('managerEmp.uuid'), 'manager_emp_uuid' ],
          [ Sequelize.col('managerEmp.emp_cd'), 'manager_emp_cd' ],
          [ Sequelize.col('managerEmp.emp_nm'), 'manager_emp_nm' ],
          [ Sequelize.col('subManagerEmp.uuid'), 'sub_manager_emp_uuid' ],
          [ Sequelize.col('subManagerEmp.emp_cd'), 'sub_manager_emp_cd' ],
          [ Sequelize.col('subManagerEmp.emp_nm'), 'sub_manager_emp_nm' ],
					'equip_no',
					'equip_grade',
					'equip_model',
					'equip_std',
					'equip_spec',
					'manufacturer',
					'voltage',
					'purchase_partner',
					'purchase_date',
					'purchase_tel',
					'purchase_price',
          'use_fg',
          'prd_fg',
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
    params: { factory_id: number, equip_cd: string }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { equip_cd: params.equip_cd }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdEquip[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((equip: any) => {
        return this.repo.update(
          {
            equip_type_id: equip.equip_type_id ?? null,
            equip_cd: equip.equip_cd ?? null,
            equip_nm: equip.equip_nm ?? null,
            workings_id: equip.workings_id ?? null,
            manager_emp_id: equip.manager_emp_id ?? null,
            sub_manager_emp_id: equip.sub_manager_emp_id ?? null,
            equip_no: equip.equip_no ?? null,
            equip_grade: equip.equip_grade ?? null,
						equip_model: equip.equip_model ?? null,
						equip_std: equip.equip_std ?? null,
						equip_spec: equip.equip_spec ?? null,
            voltage: equip.voltage ?? null,
						manufacturer: equip.manufacturer ?? null,
						purchase_partner: equip.purchase_partner ?? null,
						purchase_date: equip.purchase_date ?? null,
						purchase_tel: equip.purchase_tel ?? null,
						purchase_price: equip.purchase_price ?? null,
            use_fg: equip.use_fg ?? null,
            prd_fg: equip.prd_fg ?? null,
            remark: equip.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: equip.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdEquip.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdEquip[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((equip: any) => {
        return this.repo.update(
          {
            equip_type_id: equip.equip_type_id,
            equip_cd: equip.equip_cd,
            equip_nm: equip.equip_nm,
            workings_id: equip.workings_id,
            manager_emp_id: equip.manager_emp_id,
            sub_manager_emp_id: equip.sub_manager_emp_id,
            equip_no: equip.equip_no,
            equip_grade: equip.equip_grade,
						equip_model: equip.equip_model,
						equip_std: equip.equip_std,
						equip_spec: equip.equip_spec,
            voltage: equip.voltage,
						manufacturer: equip.manufacturer,
						purchase_partner: equip.purchase_partner,
						purchase_date: equip.purchase_date,
						purchase_tel: equip.purchase_tel,
						purchase_price: equip.purchase_price,
            use_fg: equip.use_fg,
            prd_fg: equip.prd_fg,
            remark: equip.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: equip.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdEquip.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdEquip[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((equip: any) => {
        return this.repo.destroy({ where: { uuid: equip.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdEquip.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdEquipRepo;