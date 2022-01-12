import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import EqmRepairHistory from '../../models/eqm/repair-history.model';
import IEqmRepairHistory from '../../interfaces/eqm/repair-history.interface';
import { Sequelize } from 'sequelize-typescript';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class EqmRepairHistoryRepo {
  repo: Repository<EqmRepairHistory>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(EqmRepairHistory);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IEqmRepairHistory[], uid: number, transaction?: Transaction) => {
		try {
			const eqmRepairHistories = body.map((eqmRepairHistory) => {
				return {
					factory_id: eqmRepairHistory.factory_id,
					equip_id: eqmRepairHistory.equip_id,
					occur_start_date: eqmRepairHistory.occur_start_date,
					occur_end_date: eqmRepairHistory.occur_end_date,
					occur_emp_id: eqmRepairHistory.occur_emp_id,
					occur_reason: eqmRepairHistory.occur_reason,
					occur_contents: eqmRepairHistory.occur_contents,
					repair_start_date: eqmRepairHistory.repair_start_date,
					repair_end_date: eqmRepairHistory.repair_end_date,
					repair_time: eqmRepairHistory.repair_time,
					repair_place: eqmRepairHistory.repair_place,
					repair_price: eqmRepairHistory.repair_price,
					check_date: eqmRepairHistory.check_date,
					check_emp_id: eqmRepairHistory.check_emp_id,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(eqmRepairHistories, { individualHooks: true, transaction });

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
            model: this.sequelize.models.StdFactory, 
            attributes: [], 
            required: true, 
            where: { uuid: params.factory_uuid ?? { [Op.ne]: null } }
          },
					{ 
            model: this.sequelize.models.StdEquip, 
            attributes: [], 
            required: true,
            where: { uuid: params.equip_uuid ?? { [Op.ne]: null } }
          },
					{ model: this.sequelize.models.StdEmp, as: 'occurEmp', attributes: [], required: false },
					{ model: this.sequelize.models.StdEmp, as: 'checkEmp', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
					[ Sequelize.col('eqmRepairHistory.uuid'), 'repair_history_uuid' ],
					[ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
					[ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          'occur_start_date',
          'occur_end_date',
          [ Sequelize.col('occurEmp.uuid'), 'occurEmp_uuid' ],
          [ Sequelize.col('occurEmp.emp_cd'), 'occurEmp_cd' ],
          [ Sequelize.col('occurEmp.emp_nm'), 'occurEmp_nm' ],
          'occur_reason',
          'occur_contents',
          'repair_start_date',
          'repair_end_date',
          'repair_time',
          'repair_place',
          'repair_price',
          'check_date',
					[ Sequelize.col('checkEmp.uuid'), 'checkEmp_uuid' ],
          [ Sequelize.col('checkEmp.emp_cd'), 'checkEmp_cd' ],
          [ Sequelize.col('checkEmp.emp_nm'), 'checkEmp_nm' ],
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'occur_start_date', 'equip_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

	// 📒 Fn[readByUuid]: Default Read With Uuid Function
	public readByUuid = async(uuid: string, params?: any) => {
		try {
			const result = await this.repo.findOne({ 
				include: [
					{ model: this.sequelize.models.StdFactory, attributes: [], required: true },
					{ model: this.sequelize.models.StdEquip, attributes: [], required: true },
					{ model: this.sequelize.models.StdEmp, as: 'occurEmp', attributes: [], required: false },
					{ model: this.sequelize.models.StdEmp, as: 'checkEmp', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
					[ Sequelize.col('eqmRepairHistory.uuid'), 'repair_history_uuid' ],
					[ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
					[ Sequelize.col('stdEquip.uuid'), 'equip_uuid' ],
          [ Sequelize.col('stdEquip.equip_cd'), 'equip_cd' ],
          [ Sequelize.col('stdEquip.equip_nm'), 'equip_nm' ],
          'occur_start_date',
          'occur_end_date',
          [ Sequelize.col('occurEmp.uuid'), 'occurEmp_uuid' ],
          [ Sequelize.col('occurEmp.emp_cd'), 'occurEmp_cd' ],
          [ Sequelize.col('occurEmp.emp_nm'), 'occurEmp_nm' ],
          'occur_reason',
          'occur_contents',
          'repair_start_date',
          'repair_end_date',
          'repair_time',
          'repair_place',
          'repair_price',
          'check_date',
					[ Sequelize.col('checkEmp.uuid'), 'checkEmp_uuid' ],
          [ Sequelize.col('checkEmp.emp_cd'), 'checkEmp_cd' ],
          [ Sequelize.col('checkEmp.emp_nm'), 'checkEmp_nm' ],
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
    params: { factory_id: number, equip_id: number, occur_start_date: Date }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { equip_id: params.equip_id },
					{ occur_start_date: params.occur_start_date}
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IEqmRepairHistory[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let molRepairHistory of body) {
        const result = await this.repo.update(
          {
						equip_id: molRepairHistory.equip_id ?? null,
						occur_start_date: molRepairHistory.occur_start_date ?? null,
						occur_end_date: molRepairHistory.occur_end_date ?? null,
						occur_emp_id: molRepairHistory.occur_emp_id ?? null,
						occur_reason: molRepairHistory.occur_reason ?? null,
						occur_contents: molRepairHistory.occur_contents ?? null,
						repair_start_date: molRepairHistory.repair_start_date ?? null,
						repair_end_date: molRepairHistory.repair_end_date ?? null,
						repair_time: molRepairHistory.repair_time ?? null,
						repair_place: molRepairHistory.repair_place ?? null,
						repair_price: molRepairHistory.repair_price ?? null,
						check_date: molRepairHistory.check_date ?? null,
						check_emp_id: molRepairHistory.check_emp_id ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: molRepairHistory.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', sequelize.models.EqmRepairHistory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IEqmRepairHistory[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let molRepairHistory of body) {
        const result = await this.repo.update(
          {
						equip_id: molRepairHistory.equip_id,
						occur_start_date: molRepairHistory.occur_start_date,
						occur_end_date: molRepairHistory.occur_end_date,
						occur_emp_id: molRepairHistory.occur_emp_id,
						occur_reason: molRepairHistory.occur_reason,
						occur_contents: molRepairHistory.occur_contents,
						repair_start_date: molRepairHistory.repair_start_date,
						repair_end_date: molRepairHistory.repair_end_date,
						repair_time: molRepairHistory.repair_time,
						repair_place: molRepairHistory.repair_place,
						repair_price: molRepairHistory.repair_price,
						check_date: molRepairHistory.check_date,
						check_emp_id: molRepairHistory.check_emp_id,
            updated_uid: uid,
          },
          { 
            where: { uuid: molRepairHistory.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', sequelize.models.EqmRepairHistory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IEqmRepairHistory[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let molRepairHistory of body) {
        count += await this.repo.destroy({ where: { uuid: molRepairHistory.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', sequelize.models.EqmRepairHistory.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default EqmRepairHistoryRepo;