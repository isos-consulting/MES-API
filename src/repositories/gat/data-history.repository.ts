import { Sequelize } from 'sequelize-typescript';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import { readTempGraph } from '../../queries/gat/temp-graph.query';

class GatDataHistoryRepo {
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🔵 Read Functions

  // 📒 Fn[readTempGraph]: 온도 그래프
  public readTempGraph = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readTempGraph(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion
}

export default GatDataHistoryRepo;