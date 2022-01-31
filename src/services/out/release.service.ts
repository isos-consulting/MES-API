import { Transaction } from "sequelize/types";
import OutReleaseDetailRepo from "../../repositories/out/release-detail.repository";
import OutReleaseRepo from "../../repositories/out/release.repository";
import StdDeliveryRepo from "../../repositories/std/delivery.repository";
import StdFactoryRepo from "../../repositories/std/factory.repository";
import StdPartnerRepo from "../../repositories/std/partner.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class OutReleaseService {
  tenant: string;
  stateTag: string;
  repo: OutReleaseRepo;
  detailRepo: OutReleaseDetailRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'outRelease';
    this.repo = new OutReleaseRepo(tenant);
    this.detailRepo = new OutReleaseDetailRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'uuid',
        TRepo: OutReleaseRepo,
        idName: 'release_id',
        uuidName: 'uuid'
      },
      {
        key: 'release',
        TRepo: OutReleaseRepo,
        idName: 'release_id',
        uuidName: 'release_uuid'
      },
      {
        key: 'factory',
        TRepo: StdFactoryRepo,
        idName: 'factory_id',
        uuidName: 'factory_uuid'
      },
      {
        key: 'partner',
        TRepo: StdPartnerRepo,
        idName: 'partner_id',
        uuidName: 'partner_uuid'
      },
      {
        key: 'delivery',
        TRepo: StdDeliveryRepo,
        idName: 'delivery_id',
        uuidName: 'delivery_uuid'
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

  public readReport = async (params: any) => {
    try { return await this.repo.readReport(params); } 
    catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
    catch (error) { throw error; }
  };

  public update = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  public patch = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); } 
    catch (error) { throw error; }
  }

  // 📒 Fn[updateTotal]: 전표 합계 금액, 수량 계산
  /**
   * 전표 합계 금액, 수량 계산
   * @param _id 전표 Id
   * @param _uuid 전표 Uuid
   * @param _uid 데이터 수정자 Uid
   * @param _transaction Transaction
   * @returns 합계 금액, 수량이 계산 된 전표 결과
   */
   updateTotal = async (id: number, uuid: string, uid: number, tran?: Transaction) => {
    const getTotals = await this.detailRepo.getTotals(id, tran);
    const totalQty = getTotals?.totalQty;
    const totalPrice = getTotals?.totalPrice;

    const result = await this.repo.patch(
      [{ 
        total_qty: totalQty,
        total_price: totalPrice,
        uuid: uuid,
      }], 
      uid, tran
    );

    return result;
  }
}

export default OutReleaseService;