import { Transaction } from "sequelize/types";
import IQmsReworkDisassemble from '../../interfaces/qms/rework-disassemble.interface';
import QmsReworkRepo from '../../repositories/qms/rework.repository';
import QmsReworkDisassembleRepo from '../../repositories/qms/rework-disassemble.repository';
import StdFactoryRepo from '../../repositories/std/factory.repository';
import StdProdRepo from '../../repositories/std/prod.repository';
import StdStoreRepo from '../../repositories/std/store.repository';
import StdLocationRepo from '../../repositories/std/location.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class QmsReworkDisassembleService {
  tenant: string;
  stateTag: string;
  repo: QmsReworkDisassembleRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'qmsReworkDisassemble';
    this.repo = new QmsReworkDisassembleRepo(tenant);

    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
		this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: QmsReworkDisassembleRepo,
        idName: 'rework_disassemble_id',
        uuidName: 'rework_disassemble_uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'rework',
        TRepo: QmsReworkRepo,
        idName: 'rework_id',
        uuidName: 'rework_uuid'
      },
      {
        key: 'prod',
        TRepo: StdProdRepo,
        idName: 'prod_id',
        uuidName: 'prod_uuid'
      },
      {
        key: 'incomeStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'income_store_id',
        uuidName: 'income_store_uuid'
      },
      {
        key: 'incomeLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'income_location_id',
        uuidName: 'income_location_uuid'
      },
      {
        key: 'returnStore',
        TRepo: StdStoreRepo,
        idName: 'store_id',
        idAlias: 'return_store_id',
        uuidName: 'return_store_uuid'
      },
      {
        key: 'returnLocation',
        TRepo: StdLocationRepo,
        idName: 'location_id',
        idAlias: 'return_location_id',
        uuidName: 'return_location_uuid'
      },
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public create = async (datas: IQmsReworkDisassemble[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public read = async (params: any) => {
    try { return await this.repo.read(params); }
		catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
		catch (error) { throw error; }
  };

	public readRawsByReworkIds = async (uuid: string[]) => {
    try { return await this.repo.readRawsByReworkIds(uuid); } 
		catch (error) { throw error; }
  };

  public update = async (datas: IQmsReworkDisassemble[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  };

  public patch = async (datas: IQmsReworkDisassemble[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); }
		catch (error) { throw error; }
  };

  public delete = async (datas: IQmsReworkDisassemble[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); }
		catch (error) { throw error; }
  };

}

export default QmsReworkDisassembleService;