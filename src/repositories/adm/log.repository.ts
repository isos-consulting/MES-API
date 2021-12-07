import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmLog from '../../models/adm/log.model';
import { Sequelize } from 'sequelize-typescript';
import checkArray from '../../utils/checkArray';
import { Transaction } from 'sequelize';
import { getSequelize } from '../../utils/getSequelize';

class AdmLogRepo {
  repo: Repository<AdmLog>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmLog);
  }

  public create = async (_type: 'update' | 'delete', _tableName: string, _datas: any, _uid: number, transaction?: Transaction) => {
    try {
      const datas = checkArray(_datas);
      const type = this.getLogType(_type);
  
      let logDatas: any[] = [];
      datas.forEach((data: any) => {
        data = data?.dataValues;
        if (!data) { return; }

        logDatas.push({
          table_nm: _tableName,
          logged_uid: _uid,
          tran_fg: type,
          tran_values: data
        });
      });
  
      await this.repo.bulkCreate(logDatas, { transaction });
    } catch (error) {
      throw new Error(`${_tableName} ${_type} Log 작성 중 Error 발생`);
    }
  }

  private getLogType = (_type: 'update' | 'delete') => {
    switch (_type) {
      case 'update':
        return true;
      case 'delete':
        return false;
    }
  }
}

export default AdmLogRepo;