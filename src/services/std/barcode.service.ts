import { Transaction } from "sequelize/types";
import StdBarcodeRepo from "../../repositories/std/barcode.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdProdRepo from "../../repositories/std/prod.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class StdBarcodeService {
  tenant: string;
  stateTag: string;
  repo: StdBarcodeRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'stdBarcodeType';
    this.repo = new StdBarcodeRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid',
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid',
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  }
  
  public create = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
    catch (error) { throw error; }
  }

  public read = async (params: any) => {
    try { return await this.repo.read(params); }
		catch (error) { throw error; }
  };

  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); }
    catch (error) { throw error; }
  };

  public readRawById = async (id: number) => {
    try { return await this.repo.readRawById(id); }
    catch (error) { throw error; }
  };

  public update = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); }
    catch (error) { throw error; }
  };

  public patch = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); }
    catch (error) { throw error; }
  };

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
    catch (error) { throw error; }
  };
}

export default StdBarcodeService;