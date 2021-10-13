import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmPatternHistory from '../../models/adm/pattern-history.model';
import IAdmPatternHistory from '../../interfaces/adm/pattern-history.interface';
import sequelize from '../../models';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Sequelize, Transaction } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from './log.repository';
import convertReadResult from '../../utils/convertReadResult';

class AdmPatternHistoryRepo {
  repo: Repository<AdmPatternHistory>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(AdmPatternHistory);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IAdmPatternHistory[], uid: number, transaction?: Transaction) => {
    try {
      const patternHistories = body.map((patternHistory) => {
        return {
          factory_id: patternHistory.factory_id,
          table_nm: patternHistory.table_nm,
          col_nm: patternHistory.col_nm,
          pattern: patternHistory.pattern,
          reg_date: patternHistory.reg_date,
          seq: patternHistory.seq,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(patternHistories, { individualHooks: true, transaction });

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
          { model: sequelize.models.StdFactory, attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('admPatternHistory.uuid'), 'pattern_history_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'table_nm',
          'col_nm',
          'pattern',
          'reg_date',
          'seq',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'factory_id', 'table_nm', 'col_nm', 'pattern', 'reg_date' ],
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
          { model: sequelize.models.StdFactory, attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('admPatternHistory.uuid'), 'pattern_history_uuid' ],
          [ Sequelize.col('stdFactory.uuid'), 'factory_uuid' ],
          [ Sequelize.col('stdFactory.factory_cd'), 'factory_cd' ],
          [ Sequelize.col('stdFactory.factory_nm'), 'factory_nm' ],
          'table_nm',
          'col_nm',
          'pattern',
          'reg_date',
          'seq',
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

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IAdmPatternHistory[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let patternHistory of body) {
        const result = await this.repo.update(
          {
            seq: patternHistory.seq != null ? patternHistory.seq : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: patternHistory.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AdmPatternHistory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  // 📒 Fn[updateSeqByGroup]: 자동발행 기준으로부터 seq Update Function
  public updateSeqByGroup = async(body: IAdmPatternHistory, uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await this.repo.findAll({ 
        where: { 
          factory_id: body.factory_id,
          table_nm: body.table_nm,
          col_nm: body.col_nm,
          pattern: body.pattern,
          reg_date: body.reg_date
        }
      });

      const result = await this.repo.update(
        {
          seq: body.seq,
          updated_uid: uid,
        } as any,
        { 
          where: { 
            factory_id: body.factory_id,
            table_nm: body.table_nm,
            col_nm: body.col_nm,
            pattern: body.pattern,
            reg_date: body.reg_date
          },
          returning: true,
          individualHooks: true,
          transaction
        },
      );

      raws.push(result);

      await new AdmLogRepo().create('update', sequelize.models.AdmPatternHistory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IAdmPatternHistory[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let patternHistory of body) {
        const result = await this.repo.update(
          {
            seq: patternHistory.seq,
            updated_uid: uid,
          },
          { 
            where: { uuid: patternHistory.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo().create('update', sequelize.models.AdmPatternHistory.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IAdmPatternHistory[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let patternHistory of body) {
        count += await this.repo.destroy({ where: { uuid: patternHistory.uuid }, transaction});
      };

      await new AdmLogRepo().create('delete', sequelize.models.AdmPatternHistory.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion

  //#region ✅ Other Functions

  // 📒 Fn[getMaxSeq]: 자동번호발행의 Max Sequence 조회
  /**
   * 자동번호발행의 Max Sequence 조회
   * @param params 발행될 번호의 Max Sequence를 조회 할 Parameter
   * @param transaction Transaction
   * @returns Max Sequence
   */
  getMaxSeq = async(params: IAdmPatternHistory, transaction?: Transaction) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [ 'seq' ],
        where: { 
          factory_id: params.factory_id,
          table_nm: params.table_nm,
          col_nm: params.col_nm,
          pattern: params.pattern,
          reg_date: params.reg_date,
        },
        transaction
      });

      if (!result) { return 0; }

      const maxSeq: number = (result as any).dataValues.seq;

      return maxSeq;
    } catch (error) {
      throw error;
    }
  }

  //#endregion
}

export default AdmPatternHistoryRepo;