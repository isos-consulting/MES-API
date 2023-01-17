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

	public readOrderWork = async (params: any) => {
    try { return await this.repo.readOrderWork(params); } 
		catch (error) { throw error; }
  };

	public readOrderWorkMonth = async (params: any) => {
    try { return await this.repo.readOrderWorkMonth(params); } 
		catch (error) { throw error; }
  };

	public readWorkerWorkPrice = async (params: any) => {
    try { return await this.repo.readWorkerWorkPrice(params); } 
		catch (error) { throw error; }
  };

	public readWorkerWorkPriceMonth = async (params: any) => {
    try { return await this.repo.readWorkerWorkPriceMonth(params); } 
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

	public convertToPivotOfProductivity = async (datas: any[]) => {
    try { 
			const workingsNm = [...new Set(datas.map(value => value.workings_nm))];

			let convertPivotDatas: any[] = []
			workingsNm.forEach((workingsNmValue) => {
				let object: any = {workings_nm: workingsNmValue};
				datas.forEach((dataValue) => {
					if (workingsNmValue === dataValue.workings_nm ) {
							object[dataValue.proc_nm] = dataValue.productivity
					}
				})
				convertPivotDatas.push(object);
			})

			return convertPivotDatas;
		} 
		catch (error) { throw error; }
  };

	public convertToPivotOfOrderWorkDay = async (datas: any[]) => {
    try { 
			let convertPivotDatas = datas.reduce((base,data) => {
				base[0][data.date] = data.order_total_price;
				base[1][data.date] = data.work_total_price;
				base[2][data.date] = data.rate;
				return base;
			},[{fg: '계획금액'}, {fg: '실적금액'}, {fg: '달성율'}]);

			return convertPivotDatas;
		} 
		catch (error) { throw error; }
  };

	public convertToPivotOfOrderWorkWeek = async (datas: any[]) => {
    try { 
			let convertPivotDatas = datas.reduce((base,data) => {
				base[0][data.week] = data.order_total_price;
				base[1][data.week] = data.work_total_price;
				base[2][data.week] = data.rate;
				return base;
			},[{fg: '계획금액'}, {fg: '실적금액'}, {fg: '달성율'}]);

			return convertPivotDatas;
		} 
		catch (error) { throw error; }
  };

	public convertToPivotOfOrderWorkMonth = async (datas: any[]) => {
    try { 
			let convertPivotDatas = datas.reduce((base,data) => {
				base[0][data.month_date] = data.plan_total_price;
				base[1][data.month_date] = data.work_total_price;
				base[2][data.month_date] = data.rate;
				return base;
			},[{fg: '계획금액'}, {fg: '실적금액'}, {fg: '달성율'}]);

			return convertPivotDatas;
		} 
		catch (error) { throw error; }
  };

	public convertToPivotOfWorkerWorkPriceDay = async (datas: any[]) => {
    try { 
			let convertPivotDatas = datas.reduce((base,data) => {
				base[0][data.date] = data.worker;
				base[1][data.date] = data.work_total_price;
				base[2][data.date] = data.rate;
				return base;
			},[{fg: '인원수'}, {fg: '실적금액'}, {fg: '인당금액'}]);

			return convertPivotDatas;
		} 
		catch (error) { throw error; }
  };

	public convertToPivotOfWorkerWorkPriceWeek = async (datas: any[]) => {
    try { 
			let convertPivotDatas = datas.reduce((base,data) => {
				base[0][data.week] = data.worker;
				base[1][data.week] = data.work_total_price;
				base[2][data.week] = data.rate;
				return base;
			},[{fg: '인원수'}, {fg: '실적금액'}, {fg: '인당금액'}]);

			return convertPivotDatas;
		} 
		catch (error) { throw error; }
  };

	public convertToPivotOfWorkerWorkPriceMonth = async (datas: any[]) => {
    try { 
			let convertPivotDatas = datas.reduce((base,data) => {
				base[0][data.month_date] = data.worker;
				base[1][data.month_date] = data.work_total_price;
				base[2][data.month_date] = data.rate;
				return base;
			},[{fg: '인원수'}, {fg: '실적금액'}, {fg: '인당금액'}]);

			return convertPivotDatas;
		} 
		catch (error) { throw error; }
  };
};

export default KpiProductionService;
