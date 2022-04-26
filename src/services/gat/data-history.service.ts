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
  
  // 📒 Fn[readTempGraph]: 온도 그래프 
  public readTempGraph = async(params?: any) => {
    try { return await this.repo.readTempGraph(params); }
    catch (error) { throw error; }
  }
}

export default InvMoveService;