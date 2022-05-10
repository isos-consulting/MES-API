import { Sequelize } from 'sequelize-typescript';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import { readRowData } from '../../queries/gat/temp-graph.query';
import { DatabaseError } from 'sequelize';
import { readInterfaceGraph } from '../../queries/gat/interface-graph.query';

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

  // 📒 Fn[readRowData]: 인터페이스 row data
  public readRowData = async(params?: any) => {
    try {
      const result = await this.sequelize.query(readRowData(params));
      return convertReadResult(result[0]);
    } catch (error) {
			if (error instanceof DatabaseError) { 
				return convertReadResult('');; 
			} else {
				throw error;
			}
      
    }
  };

	// 📒 Fn[readGraph]: 인터페이스 그래프
	public readGraph = async(params?: any) => {
		try {
			const result = await this.sequelize.query(readInterfaceGraph(params));
			return convertReadResult(result[0]);
		} catch (error) {
			if (error instanceof DatabaseError) { 
				return convertReadResult('');; 
			} else {
				throw error;
			}
			
		}
	};

  //#endregion
}

export default GatDataHistoryRepo;