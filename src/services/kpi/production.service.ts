import KpiProductionRepo from '../../repositories/kpi/production.repository';

class KpiProductionService {
  tenant: string;
  stateTag: string;
  repo: KpiProductionRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'kpiProduction';
    this.repo = new KpiProductionRepo(tenant);

  }

  public readEquipProductivity = async (params: any) => {
    try { return await this.repo.readEquipProductivity(params); } 
		catch (error) { throw error; }
  };

	public readDowntime = async (params: any) => {
    try { return await this.repo.readDowntime(params); } 
		catch (error) { throw error; }
  };

	public readWorkPlanAchievementRate = async (params: any) => {
    try { return await this.repo.readWorkPlanAchievementRate(params); } 
		catch (error) { throw error; }
  };

	public readWorkerProductivity = async (params: any) => {
    try { return await this.repo.readWorkerProductivity(params); } 
		catch (error) { throw error; }
  };

	public readWorkRejectsRate = async (params: any) => {
    try { return await this.repo.readWorkRejectsRate(params); } 
		catch (error) { throw error; }
  };

	public convertToPivotOfEquipProductivity = async (datas: any[]) => {
    try { 
			
			let convertPivotDatas = datas.reduce((base,data) => {
				base[0][data.workings_cd] = data.equip_operation_rate;
				base[1][data.workings_cd] = data.equip_work_rate;
				return base;
			},[{fg: '설비운영율'}, {fg: '설비가동율'}]);

			return convertPivotDatas;
		} 
		catch (error) { throw error; }
  };

	public convertToPivotOfDowntime = async (datas: any[]) => {
    try { 
			
			let convertPivotDatas = datas.reduce((base,data) => {
				base[0][data.workings_cd] = data.work_min;
				return base;
			},[{}]);

			return convertPivotDatas;
		} 
		catch (error) { throw error; }
  };
};

export default KpiProductionService;
