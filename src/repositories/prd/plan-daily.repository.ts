import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import PrdPlanDaily from '../../models/prd/plan-daily.model';
import IPrdPlanDaily from '../../interfaces/prd/plan-daily.interface';
import { readPlanDaily } from '../../queries/prd/plan-daily.query';

class PrdPlanDailyRepo {
  repo: Repository<PrdPlanDaily>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(PrdPlanDaily);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IPrdPlanDaily[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((planDaily: any) => {
        return this.repo.create(
          {
						plan_monthly_id: planDaily.plan_monthly_id,
            factory_id: planDaily.factory_id,
            prod_id: planDaily.prod_id, 
            workings_id: planDaily.workings_id,
            plan_day: planDaily.plan_day,
            plan_daily_qty: planDaily.plan_daily_qty,
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
      const result = await this.sequelize.query(readPlanDaily(params));
			
      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.StdProd, 
            include: [
              { model: this.sequelize.models.StdProdType, attributes: [], as: 'stdProdType', required: true },
              { model: this.sequelize.models.StdItemType, attributes: [], as: 'stdItemType', required: true },
              { model: this.sequelize.models.StdModel, attributes: [], as: 'stdModel', required: true },
            ],
            attributes: [], 
            required: true
          },
          { model: this.sequelize.models.StdWorkings, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('PrdPlanDaily.uuid'), 'plan_daily_uuid' ],
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          [ Sequelize.col('stdProd.prod_nm'), 'prod_nm' ],
          [ Sequelize.col('stdProd.rev'), 'rev' ],
          [ Sequelize.col('stdProd.prod_std'), 'prod_std' ],
          [ Sequelize.col('stdProd.stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProd.stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdProd.stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdProd.stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdProd.stdModel.model_nm'), 'model_nm' ],
          [ Sequelize.col('stdWorkings.uuid'), 'workings_uuid' ],
          [ Sequelize.col('stdWorkings.workings_cd'), 'workings_cd' ],
          [ Sequelize.col('stdWorkings.workings_nm'), 'workings_nm' ],
          'plan_day',
          'plan_monthly_qty',
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

  // 📒 Fn[readRawByUuid]: Id 를 포함한 Raw Data Read Function
  public readRawByUuid = async(uuid: string) => {
    const result = await this.repo.findOne({ where: { uuid } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByIds]: Id 를 포함한 Raw Datas Read Function
  public readRawByIds = async(ids: number[]) => {
    const result = await this.repo.findAll({ where: { plan_daily_id: { [Op.in]: ids } } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IPrdPlanDaily[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((planDaily: any) => {
        return this.repo.update(
          {
						plan_monthly_id: planDaily.plan_monthly_id ?? null,
            factory_id: planDaily.factory_id ?? null,
            prod_id: planDaily.prod_id ?? null,
            workings_id: planDaily.workings_id ?? null,
            plan_day: planDaily.plan_day ?? null,
            plan_daily_qty: planDaily.plan_daily_qty ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: planDaily.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdPlanDaily.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IPrdPlanDaily[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((planDaily: any) => {
        return this.repo.update(
          {
						plan_monthly_id: planDaily.plan_monthly_id,
            factory_id: planDaily.factory_id,
            prod_id: planDaily.prod_id,
            workings_id: planDaily.workings_id,
            plan_day: planDaily.plan_day,
            plan_daily_qty: planDaily.plan_daily_qty,
            updated_uid: uid,
          },
          { 
            where: { uuid: planDaily.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.PrdPlanDaily.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IPrdPlanDaily[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((planDaily: any) => {
        return this.repo.destroy({ where: { uuid: planDaily.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.PrdPlanDaily.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default PrdPlanDailyRepo;