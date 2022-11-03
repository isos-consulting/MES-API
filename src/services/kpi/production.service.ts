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

	public convertToPivot = async (datas: any[]) => {
    try { 
			let convertPivotDatas: any[] = [];
			datas.forEach((item) => {
				
				
			});

			return convertPivotDatas;
		} 
		catch (error) { throw error; }
  };
};

export default KpiProductionService;