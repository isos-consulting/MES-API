import { Sequelize } from 'sequelize-typescript';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import { readPurchasedSalesByDay, readPurchasedSalesByMonth, readPurchasedSalesByYear } from '../../queries/das/overall-status.query';
import { readFacilityOperationRate, readRejectRate, readPrdProgressRate } from '../../queries/das/realtime-status.query';

class DashboardRepo {
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions
  //#endregion

  //#region 🔵 Read Functions
  // 📒 Fn[readPurchasedSalesByDay]: 일별 매입, 매출 금액 Read Function
  public readPurchasedSalesByDay = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readPurchasedSalesByDay(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readPurchasedSalesByMonth]: 월별 매입, 매출 금액 Read Function
  public readPurchasedSalesByMonth = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readPurchasedSalesByMonth(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readPurchasedSalesByYear]: 연도별 매입, 매출 금액 Read Function
  public readPurchasedSalesByYear = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readPurchasedSalesByYear(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readFacilityOperationRate]: 설비가동율 Read Function
  public readFacilityOperationRate = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readFacilityOperationRate());

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readRejectRate]: 불량율 Read Function
  public readRejectRate = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readRejectRate(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readPrdProgressRate]: 생산진척율 Read Function
  public readPrdProgressRate = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readPrdProgressRate(params));

      return convertReadResult(result[0]);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#region 🟡 Update Functions
  //#endregion

  //#region 🟠 Patch Functions
  //#endregion

  //#region 🔴 Delete Functions
  //#endregion

  //#endregion
}

export default DashboardRepo;