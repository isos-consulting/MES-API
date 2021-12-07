import { Sequelize } from "sequelize-typescript";
import config from "../configs/config";
import { getSequelize } from "../utils/getSequelize";
import rearrangeSequence from "../utils/rearrangeSequence";

/**
 * Migration Base Class
 */
class BaseMigration {
  sequelize: Sequelize;
  tableName: string;
  modelName: string;
  pkName?: string;
  model: any;
  seedDatas: any;

  /**
   * [ constructor ] : Migration Base Class 생성자
   * @param _modelName Migration 정보를 정의 할 Model 의 이름
   * @param _pkName Migration 정보를 정의 할 Model의 PK(Seq) 이름
   * @param _seedDatas Migration 과 동시에 Seed를 이용하여 입력 할 DataSet
   */
  constructor(_modelName: string, _pkName?: string, _seedDatas?: any) {
    this.sequelize = getSequelize('test');
    this.model = this.sequelize.model(_modelName);
    this.tableName = this.model.tableName;
    this.modelName = _modelName;
    this.pkName = _pkName;
    this.seedDatas = _seedDatas;
  }

  /**
   * [ createTable ] : Model 을 기준으로하여 Table 생성
   * @param _modelName 생성할 Model 의 이름
   * @param _tableName 생성할 Table 의 이름
   */
  createTable = async(_modelName: string, _tableName: string) => {
    await this.sequelize.models[_modelName].sync({ force: true })
    .then(() => {
      console.log(`✅Success Create ${_tableName}`);
    })
    .catch((err) => { 
      console.log(`❗️Error in Create ${_tableName} : ${err}`);
    });
  }

  /**
   * [ seedTable ] : Test 를 위한 Seed Data 입력
   * @param _tableName Seed Data 를 입력 할 Table 의 이름
   * @param _model Seed Data 를 입력 할 Model Class
   * @param _datas Seed DataSet
   * @param _datas Seed Data 를 입력 할 Table 의 PK(Seq) 이름
   */
  seedTable = async(_tableName: string, _model: any, _datas: any, _pkName?: string) => {
    if (!_datas) { return; }
    await this.sequelize.getRepository(_model).bulkCreate(_datas, { individualHooks: true })
    .then(() => {
      console.log(`✅Success Seed ${_tableName}`);
    })
    .catch((err) => {
      console.log(`❗️Error in Seed ${_tableName} : ${err}`);
    });;

    if (!_pkName) { return; }
    await rearrangeSequence('test', _tableName, _pkName)
    .then(() => {
      console.log(`✅Success Rearrange Sequence ${_tableName}[${_pkName}]`);
    })
    .catch((err) => {
      console.log(`❗️Error in Rearrange Sequence ${_tableName}[${_pkName}] : ${err}`);
    });;
  }

  /**
   * [ dropTable ] : Model 을 기준으로하여 Table 삭제
   * @param _modelName 삭제할 Model 의 이름
   * @param _tableName 삭제할 Table 의 이름
   */
  dropTable = async(_modelName: string, _tableName: string) => {
    if (config.db.reset_type === 'admin' && this.modelName.indexOf('AdmStd') < 0 ) { return; }

    await this.sequelize.models[_modelName].drop()
      .then(() => {
        console.log(`✅Success Drop ${_tableName}`);
      })
      .catch((err) => {
        console.log(`❗️Error in Drop ${_tableName} : ${err}`);
      });
  }

  /**
   * [ migration ] : Model 기준으로 Table Migration (Test 환경에서 Data Seed 진행)
   */
  public migration = async () => {
    try {
      if (config.node_env !== 'test') { return; }

      await this.createTable(this.modelName, this.tableName);
      await this.seedTable(this.tableName, this.modelName, this.seedDatas, this.pkName);

      if (this.modelName === 'AutUser') {
        await this.sequelize.query(`
          ALTER TABLE AUT_GROUP_TB 
          ADD CONSTRAINT aut_group_tb_created_uid_fkey 
          FOREIGN KEY (created_uid) 
          REFERENCES AUT_USER_TB (uid);

          ALTER TABLE AUT_GROUP_TB 
          ADD CONSTRAINT aut_group_tb_updated_uid_fkey 
          FOREIGN KEY (updated_uid) 
          REFERENCES AUT_USER_TB (uid);
        `);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * [ migrationUndo ] : Model 기준으로 Table Migration Undo (Test 환경에서만 Drop)
   */
  public migrationUndo = async () => {
    try {
      if (config.node_env !== 'test') { return; }

      if (this.modelName === 'AutUser') {
        await this.sequelize.query(`
          ALTER TABLE AUT_GROUP_TB 
          DROP CONSTRAINT IF EXISTS aut_group_tb_created_uid_fkey;
          
          ALTER TABLE AUT_GROUP_TB 
          DROP CONSTRAINT IF EXISTS aut_group_tb_updated_uid_fkey;
        `);

        await this.dropTable(this.modelName, this.tableName);
      }
    } catch (err) {
      console.log(err);
    }
  };
}

export default BaseMigration;