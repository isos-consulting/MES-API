import { Sequelize } from 'sequelize-typescript';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import { readEquipProductivity } from '../../queries/kpi/production-equip-productivity.query';
import { readDowntime } from '../../queries/kpi/production-downtime.query';
import { readWorkPlanAchievementRate } from '../../queries/kpi/production-work-plan-achievement-rate.query';
import { readWorkerProductivity } from '../../queries/kpi/production-worker-productivity.query';
import { readWorkRejectsRate } from '../../queries/kpi/production-work-rejects-rate.query';

class KpiProductionRepo {
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
  }
  //#endregion

  //#region 🔵 Read Functions

  // 📒 Fn[readEquipProductivity]: 설비 생산성
  public readEquipProductivity = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readEquipProductivity(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

	// 📒 Fn[readEquipProductivity]: 작업잘별 비간동 시간
  public readDowntime = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readDowntime(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

	// 📒 Fn[readWorkPlanAchievementRate]: 생산계획 달성율
  public readWorkPlanAchievementRate = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readWorkPlanAchievementRate(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

	// 📒 Fn[readWorkerProductivity]: 인당 생산성
  public readWorkerProductivity = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readWorkerProductivity(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

	// 📒 Fn[readWorkRejectsRate]: 불량률
  public readWorkRejectsRate = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readWorkRejectsRate(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

}

export default KpiProductionRepo;