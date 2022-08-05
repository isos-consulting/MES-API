import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmExcelForm from '../../models/adm/excel-form.model';
import IAdmExcelForm from '../../interfaces/adm/excel-form.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class AdmExcelFormRepo {
  repo: Repository<AdmExcelForm>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmExcelForm);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmExcelForm[], uid: number, transaction?: Transaction) => {
		try {
			const promises = body.map((excelForm: any) => {
        return this.repo.create(
          {
						menu_id: excelForm.menu_id,
            excel_form_cd: excelForm.excel_form_cd,
            excel_form_nm: excelForm.excel_form_nm,
            excel_form_column_nm: excelForm.excel_form_column_nm,
						excel_form_column_cd: excelForm.excel_form_column_cd,
            excel_form_type: excelForm.excel_form_type,
            reference_menu: excelForm?.reference_menu ?? null,
						column_fg: excelForm.column_fg,
            sortby: excelForm.sortby,
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
          { model: this.sequelize.models.AutMenu, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
					[ Sequelize.col('admExcelForm.uuid'), 'uuid' ],
					[ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
					[ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          'excel_form_nm',
          'excel_form_cd',
					'excel_form_column_nm',
					'excel_form_column_cd',
					'excel_form_type',
          'reference_menu',
					'column_fg',
					'sortby',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
				where: { excel_form_cd: params.excel_form_cd ?? { [Op.ne]: null } },
        order: [ 'excel_form_nm', 'sortby' ],
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
					{ model: this.sequelize.models.AutMenu, attributes: [], required: false },
					{ model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
					{ model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
				],
				attributes: [
					[ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
					[ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          'excel_form_nm',
          'excel_form_cd',
					'excel_form_column_nm',
					'excel_form_column_cd',
					'excel_form_type',
          'reference_menu',
					'column_fg',
					'sortby',
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

  // 📒 Fn[readByMenuId]: MenuId로 불러오기
  public readByMenuId = async(menu_id: string, transaction?: Transaction) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { model: this.sequelize.models.AutMenu, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
					[ Sequelize.col('admExcelForm.uuid'), 'uuid' ],
					[ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
					[ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
          'excel_form_nm',
          'excel_form_cd',
					'excel_form_column_nm',
					'excel_form_column_cd',
					'excel_form_type',
          'reference_menu',
					'column_fg',
					'sortby',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
				where: { menu_id },
        order: [ 'excel_form_nm', 'sortby' ],
        transaction
      });
      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

	// 📒 Fn[readByMenu]: menu 포함 엑셀 양식 데이터
	public readByMenu = async(params?: any) => {
		try {
			const result = await this.repo.findAll({ 
				include: [
					{ model: this.sequelize.models.AutMenu, attributes: [], required: true },
					{ model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
					{ model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
				],
				attributes: [
					[ Sequelize.col('autMenu.uuid'), 'menu_uuid' ],
					[ Sequelize.col('autMenu.menu_nm'), 'menu_nm' ],
					[ Sequelize.col('autMenu.menu_uri'), 'menu_uri' ],
					[ Sequelize.col('autMenu.excel_upload_fg'), 'excel_upload_fg' ],
					'excel_form_cd',
				],
				group: ['menu_uuid', 'menu_nm', 'menu_uri', 'excel_upload_fg', 'excel_form_cd'] ,
				order: [Sequelize.col('autMenu.menu_nm')]
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
	public readRawByUnique = async(params: { excel_form_cd: string }) => {
		const result = await this.repo.findOne({ where: { excel_form_cd: params.excel_form_cd } });
		return convertReadResult(result);
	};

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmExcelForm[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((excelForm: any) => {
        return this.repo.update(
          {
            excel_form_cd: excelForm.excel_form_cd ?? null,
						excel_form_nm: excelForm.excel_form_nm ?? null,
						excel_form_column_nm: excelForm.excel_form_column_nm ?? null,
						excel_form_column_cd: excelForm.excel_form_column_cd ?? null,
						excel_form_type: excelForm.excel_form_type ?? null,
            reference_menu: excelForm?.reference_menu ?? null,
						menu_id: excelForm.menu_id ?? null,
						column_fg: excelForm.column_fg ?? null,
						sortby: excelForm.sortby ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: excelForm.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmExcelForm.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmExcelForm[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((excelForm: any) => {
        return this.repo.update(
          {
						excel_form_cd: excelForm.excel_form_cd,
						excel_form_nm: excelForm.excel_form_nm,
            excel_form_column_nm: excelForm.excel_form_column_nm,
						excel_form_column_cd: excelForm.excel_form_column_cd,
						excel_form_type: excelForm.excel_form_type,
            reference_menu: excelForm?.reference_menu ?? null,
						menu_id: excelForm.menu_id,
						column_fg: excelForm.column_fg,
						sortby: excelForm.sortby,
            updated_uid: uid,
          },
          { 
            where: { uuid: excelForm.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmExcelForm.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	//#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmExcelForm[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((excelForm: any) => {
        return this.repo.destroy({ where: { uuid: excelForm.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AdmExcelForm.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmExcelFormRepo;
