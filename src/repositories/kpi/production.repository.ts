import { Sequelize } from 'sequelize-typescript';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import { readEquipProductivity } from '../../queries/kpi/production-equip-productivity.query';

class KpiProductionRepo {
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

  // 📒 Fn[readStockAccordingToType]: 유형에 따라 재고 조회
  public readEquipProductivity = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readEquipProductivity(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion

}

export default KpiProductionRepo;