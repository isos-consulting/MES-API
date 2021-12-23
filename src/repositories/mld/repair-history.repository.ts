import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import MldRepairHistory from '../../models/mld/repair-history.model';
import IMldRepairHistory from '../../interfaces/mld/repair-history.interface';
import { Sequelize } from 'sequelize-typescript';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class MldRepairHistoryRepo {
  repo: Repository<MldRepairHistory>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(MldRepairHistory);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IMldRepairHistory[], uid: number, transaction?: Transaction) => {
		try {
			const mldRepairHistory = body.map((mldRepairHistory) => {
				return {
					factory_id: mldRepairHistory.factory_id,
					mold_id: mldRepairHistory.mold_id,
					prod_id: mldRepairHistory.prod_id,
					problem_id: mldRepairHistory.problem_id,
					occur_date: mldRepairHistory.occur_date,
					occur_emp_id: mldRepairHistory.occur_emp_id,
					repair_emp_id: mldRepairHistory.repair_emp_id,
					repair_partner: mldRepairHistory.repair_partner,
					repair_no: mldRepairHistory.repair_no,
					start_date: mldRepairHistory.start_date,
					end_date: mldRepairHistory.end_date,
					contents: mldRepairHistory.contents,
					created_uid: uid,
					updated_uid: uid,
				}
			});

			const result = await this.repo.bulkCreate(mldRepairHistory, { individualHooks: true, transaction });

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
            where: { uuid: params.factory_uuid ? params.factory_uuid : { [Op.ne]: null } }
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
          },
					{ model: this.sequelize.models.MldMold, attributes: [], required: true },
					{ model: this.sequelize.models.MldProblem, attributes: [], required: true },
					{ model: this.sequelize.models.StdEmp, as: 'occurEmp', attributes: [], required: true },
					{ model: this.sequelize.models.StdEmp, as: 'repairEmp', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
					[ Sequelize.col('mldRepairHistory.uuid'), 'repair_history_uuid' ],
					[ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
					[ Sequelize.col('mldMold.uuid'), 'mold_uuid' ],
          [ Sequelize.col('mldMold.mold_cd'), 'mold_cd' ],
          [ Sequelize.col('mldMold.mold_nm'), 'mold_nm' ],
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
					[ Sequelize.col('mldProblem.uuid'), 'problem_uuid' ],
          [ Sequelize.col('mldProblem.problem_cd'), 'problem_cd' ],
          [ Sequelize.col('mldProblem.problem_nm'), 'problem_nm' ],
          'occur_date',
					[ Sequelize.col('occurEmp.uuid'), 'occurEmp_uuid' ],
          [ Sequelize.col('occurEmp.emp_cd'), 'occurEmp_cd' ],
          [ Sequelize.col('occurEmp.emp_nm'), 'occurEmp_nm' ],
					[ Sequelize.col('repairEmp.uuid'), 'repairEmp_uuid' ],
          [ Sequelize.col('repairEmp.emp_cd'), 'repairEmp_cd' ],
          [ Sequelize.col('repairEmp.emp_nm'), 'repairEmp_nm' ],
					'repair_partner',
					'repair_no',
					'start_date',
					'end_date',
					'contents',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'start_date' ],
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
					{ model: this.sequelize.models.MldMold, attributes: [], required: true },
					{ model: this.sequelize.models.MldProblem, attributes: [], required: true },
					{ model: this.sequelize.models.StdEmp, as: 'occurEmp', attributes: [], required: true },
					{ model: this.sequelize.models.StdEmp, as: 'repairEmp', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
					[ Sequelize.col('mldRepairHistory.uuid'), 'repair_history_uuid' ],
					[ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
					[ Sequelize.col('mldMold.uuid'), 'mold_uuid' ],
          [ Sequelize.col('mldMold.mold_cd'), 'mold_cd' ],
          [ Sequelize.col('mldMold.mold_nm'), 'mold_nm' ],
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
					[ Sequelize.col('mldProblem.uuid'), 'problem_uuid' ],
          [ Sequelize.col('mldProblem.problem_cd'), 'problem_cd' ],
          [ Sequelize.col('mldProblem.problem_nm'), 'problem_nm' ],
          'occur_date',
					[ Sequelize.col('occurEmp.uuid'), 'occurEmp_uuid' ],
          [ Sequelize.col('occurEmp.emp_cd'), 'occurEmp_cd' ],
          [ Sequelize.col('occurEmp.emp_nm'), 'occurEmp_nm' ],
					[ Sequelize.col('repairEmp.uuid'), 'repairEmp_uuid' ],
          [ Sequelize.col('repairEmp.emp_cd'), 'repairEmp_cd' ],
          [ Sequelize.col('repairEmp.emp_nm'), 'repairEmp_nm' ],
					'repair_partner',
					'repair_no',
					'start_date',
					'end_date',
					'contents',
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
    params: { factory_id: number, mold_id: number, start_date: Date }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { factory_id: params.factory_id },
          { mold_id: params.mold_id },
					{ start_date: params.start_date}
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IMldRepairHistory[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let molRepairHistory of body) {
        const result = await this.repo.update(
          {
						mold_id: molRepairHistory.mold_id != null? molRepairHistory.mold_id : null,
						prod_id: molRepairHistory.prod_id != null? molRepairHistory.prod_id : null,
						problem_id: molRepairHistory.problem_id != null? molRepairHistory.problem_id : null,
						occur_date: molRepairHistory.occur_date != null? molRepairHistory.occur_date : null,
						occur_emp_id: molRepairHistory.occur_emp_id != null? molRepairHistory.occur_emp_id : null,
						repair_emp_id: molRepairHistory.repair_emp_id != null? molRepairHistory.repair_emp_id : null,
						repair_partner: molRepairHistory.repair_partner != null? molRepairHistory.repair_partner : null,
						repair_no: molRepairHistory.repair_no != null? molRepairHistory.repair_no : null,
						start_date: molRepairHistory.start_date != null? molRepairHistory.start_date : null,
						end_date: molRepairHistory.end_date != null? molRepairHistory.end_date : null,
						contents: molRepairHistory.contents != null? molRepairHistory.contents : null,
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

      await new AdmLogRepo(this.tenant).create('update', sequelize.models.MldRepairHistory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IMldRepairHistory[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let molRepairHistory of body) {
        const result = await this.repo.update(
          {
						mold_id: molRepairHistory.mold_id,
						prod_id: molRepairHistory.prod_id,
						problem_id: molRepairHistory.problem_id,
						occur_date: molRepairHistory.occur_date,
						occur_emp_id: molRepairHistory.occur_emp_id,
						repair_emp_id: molRepairHistory.repair_emp_id,
						repair_partner: molRepairHistory.repair_partner,
						repair_no: molRepairHistory.repair_no,
						start_date: molRepairHistory.start_date,
						end_date: molRepairHistory.end_date,
						contents: molRepairHistory.contents,
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

      await new AdmLogRepo(this.tenant).create('update', sequelize.models.MldRepairHistory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IMldRepairHistory[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let molRepairHistory of body) {
        count += await this.repo.destroy({ where: { uuid: molRepairHistory.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', sequelize.models.MldRepairHistory.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default MldRepairHistoryRepo;