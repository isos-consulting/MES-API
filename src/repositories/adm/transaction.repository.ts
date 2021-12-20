import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmTransaction from '../../models/adm/transaction.model';
import IAdmTransaction from '../../interfaces/adm/transaction.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class AdmTransactionRepo {
  repo: Repository<AdmTransaction>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmTransaction);
  }
  //#endregion

  //#region ✅ CRUD Functions

	// 📒 Fn[create]: Default Create Function
	public create = async(body: IAdmTransaction[], uid: number, transaction?: Transaction) => {
	try {
		const amdtransaction = body.map((amdtransaction) => {
			return {
				tran_id: amdtransaction.tran_id,
				tran_cd: amdtransaction.tran_cd,
				tran_nm: amdtransaction.tran_nm,
				sortby: amdtransaction.sortby,
				remark: amdtransaction.remark,
				created_uid: uid,
				updated_uid: uid,
			}
		});

		const result = await this.repo.bulkCreate(amdtransaction, { individualHooks: true, transaction });

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
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          'tran_cd',
          'tran_nm',
					'sortby',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'sortby' ],
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
					{ model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
					{ model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
				],
				attributes: [
					[ Sequelize.col('admTransaction.uuid'), 'transaction_uuid' ],
					'tran_cd',
          'tran_nm',
					'sortby',
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
	public readRawByUnique = async(params: { tran_cd: string }) => {
		const result = await this.repo.findOne({ where: { tran_cd: params.tran_cd } });
		return convertReadResult(result);
	};

  //#endregion

  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmTransaction[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let tran of body) {
        const result = await this.repo.update(
          {
            tran_id: tran.tran_id != null ? tran.tran_id : null,
            tran_cd: tran.tran_cd != null ? tran.tran_cd : null,
						tran_nm: tran.tran_nm != null ? tran.tran_nm : null,
						sortby: tran.sortby != null ? tran.sortby : null,
						remark: tran.remark != null ? tran.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: tran.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmTransaction.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	//#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmTransaction[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let tran of body) {
        const result = await this.repo.update(
          {
            tran_id: tran.tran_id,
						tran_cd: tran.tran_cd,
						tran_nm: tran.tran_nm,
						sortby: tran.sortby,
						remark: tran.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: tran.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.AdmTransaction.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

	//#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmTransaction[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let tran of body) {
        count += await this.repo.destroy({ where: { uuid: tran.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.AdmTransaction.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default AdmTransactionRepo;