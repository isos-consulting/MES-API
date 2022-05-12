import GatDataHistoryRepo from "../../repositories/gat/data-history.repository";

class InvMoveService {
  tenant: string;
  stateTag: string;
  repo: GatDataHistoryRepo;

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'gatDataHistory';
    this.repo = new GatDataHistoryRepo(tenant);
  };
  
  // 📒 Fn[readRowData]: 인터페이스 row data
  public readRowData = async(params?: any) => {
    try { return await this.repo.readRowData(params); }
    catch (error) { throw error; }
  };

	// 📒 Fn[readGraph]: 인터페이스 그래프 
	public readGraph = async (params: any) => {
    try { return await this.repo.readGraph(params); } 
		catch (error) { throw error; }
  };

	public parserGraphData = async (datas: any[]) => {
    try { 
			let reusltSub: any = [];			
			let label: string ='';
			let data: any ='';
			let backgroundColor: string ='';

			datas.forEach((values: any) => {
				if (values.data_map_nm !== label) {
					reusltSub.push({label, data, backgroundColor });
					data = [];
					label = values.data_map_nm
					backgroundColor = "#" + Math.round(Math.random() * 0xffffff).toString(16);
				}
				data.push({x: values.created_at, y: values.value});
			});

			reusltSub.push({label, data, backgroundColor });
			
			const reuslt = reusltSub.filter((values: any) =>{ return (!!values.label) });

			return reuslt; 
		} catch (error) { throw error; }
  };
}

export default InvMoveService;