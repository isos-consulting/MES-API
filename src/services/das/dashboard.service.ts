import moment from 'moment';
import DashboardRepo from '../../repositories/das/dashboard.repository';
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";

class DashboardService {
  tenant: string;
  stateTag: string;
  repo: DashboardRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'dashboard';
    this.repo = new DashboardRepo(tenant);

    this.fkIdInfos = [];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  };

  public readPurchasedSalesByDay = async (params: any) => {
    try { return await this.repo.readPurchasedSalesByDay(this.getDateByDaylightly(params.reg_date)); }
		catch (error) { throw error; }
  };

  public readPurchasedSalesByMonth = async (params: any) => {
    try { return await this.repo.readPurchasedSalesByMonth({ year: moment(params.reg_date).format('yyyy') }); }
		catch (error) { throw error; }
  };

  public readPurchasedSalesByYear = async (params: any) => {
    try { return await this.repo.readPurchasedSalesByYear({ start_year: +moment(params.reg_date).format('yyyy') - 4, end_year: +moment(params.reg_date).format('yyyy')}); }
		catch (error) { throw error; }
  };

  public readFacilityOperationRate = async (params: any) => {
    try { return await this.repo.readFacilityOperationRate(params); }
		catch (error) { throw error; }
  };

  public readRejectRate = async (params: any) => {
    try { return await this.repo.readRejectRate(params); }
		catch (error) { throw error; }
  };

  public readPrdProgressRate = async (params: any) => {
    try { return await this.repo.readPrdProgressRate(params); }
		catch (error) { throw error; }
  };

  // 📌 일별 매입,매출 금액 그래프용 포멧 가져오기
  public getOverallStatusByDayGraph = (datas: any[], reg_date: string) => {
    
    const purchaseResult = datas.filter((data: any) => { return data.price_type == 'purchase' });
    const salesResult = datas.filter((data: any) => { return data.price_type == 'sales' })

    let purchaseBody = { label: '매입금액', borderColor: "#FF3333", data: [] };
    let purchaseDatas: any = [];
    let salesBody = { label: '매출금액', borderColor: "#3333FF", data: [] };
    let salesDatas: any = [];
    
    const daylightly: any = this.getDateByDaylightly(reg_date);
    for (let index = 0; index < 7; index++) {
      const day = moment(daylightly.start_date).add(index, 'days').format('yyyy-MM-DD');
      const purchasePrice = (purchaseResult.find((result: any) => { return moment(result.reg_date).format('yyyy-MM-DD') == day }))?.price;
      const salesPrice = (salesResult.find((result: any) => { return moment(result.reg_date).format('yyyy-MM-DD') == day }))?.price;

      purchaseDatas.push({ x: moment(day).format('ddd'), y: purchasePrice ?? 0 });
      salesDatas.push({ x: moment(day).format('ddd'), y: salesPrice ?? 0 });
    }

    purchaseBody['data'] = purchaseDatas;
    salesBody['data'] = salesDatas;

    return [ purchaseBody, salesBody ];
  }

  // 📌 월별 매입,매출 금액 그래프용 포멧 가져오기
  public getOverallStatusByMonthGraph = (datas: any[]) => {
    
    const purchaseResult = datas.filter((data: any) => { return data.price_type == 'purchase' });
    const salesResult = datas.filter((data: any) => { return data.price_type == 'sales' })

    let purchaseBody = { label: '매입금액', borderColor: "#FF3333", data: [] };
    let purchaseDatas: any = [];
    let salesBody = { label: '매출금액', borderColor: "#3333FF", data: [] };
    let salesDatas: any = [];
    
    for (let index = 1; index <= 12; index++) {
      const purchasePrice = (purchaseResult.find((result: any) => { return result.reg_date == index }))?.price;
      const salesPrice = (salesResult.find((result: any) => { return result.reg_date == index }))?.price;

      purchaseDatas.push({ x: `${index}월`, y: purchasePrice ?? 0 });
      salesDatas.push({ x: `${index}월`, y: salesPrice ?? 0 });
    }

    purchaseBody['data'] = purchaseDatas;
    salesBody['data'] = salesDatas;

    return [ purchaseBody, salesBody ];
  }

  // 📌 연도별 매입,매출 금액 그래프용 포멧 가져오기
  public getOverallStatusByYearGraph = (datas: any[], reg_date: string) => {
    
    const purchaseResult = datas.filter((data: any) => { return data.price_type == 'purchase' });
    const salesResult = datas.filter((data: any) => { return data.price_type == 'sales' })

    let purchaseBody = { label: '매입금액', borderColor: "#FF3333", data: [] };
    let purchaseDatas: any = [];
    let salesBody = { label: '매출금액', borderColor: "#3333FF", data: [] };
    let salesDatas: any = [];
    
    const startYear: number = +moment(reg_date).format('yyyy') - 4;
    const endYear: number = +moment(reg_date).format('yyyy');
    for (let index = startYear; index <= endYear; index++) {
      const purchasePrice = (purchaseResult.find((result: any) => { return +result.reg_date == index }))?.price;
      const salesPrice = (salesResult.find((result: any) => { return +result.reg_date == index }))?.price;

      purchaseDatas.push({ x: `${index}`, y: purchasePrice ?? 0 });
      salesDatas.push({ x: `${index}`, y: salesPrice ?? 0 });
    }

    purchaseBody['data'] = purchaseDatas;
    salesBody['data'] = salesDatas;

    return [ purchaseBody, salesBody ];
  }

  // 📌 해당 일자가 포함된 월~일 일자 가져오기
  private getDateByDaylightly = (reg_date: string) => {
    // 요일 -> Integer && Sunday = 7
    let day_num = moment(reg_date).day();
    if (day_num == 0) { day_num = 7; }

    const start_date: string = moment(reg_date).add((day_num-1)*(-1), 'days').format('yyyy-MM-DD');
    const end_date: string = moment(reg_date).add((7-day_num), 'days').format('yyyy-MM-DD');

    return { start_date: start_date, end_date: end_date };
  }

  // 📌 실시간 현황 그래프용 포멧 가져오기
  public getRealtimeStatusBodyByGraph = (title: string, rate: number) => {
    const result: any = {
      title: title,
      value: rate,
      color: "#" + Math.round(Math.random() * 0xffffff).toString(16),
      unit: '%'
    }

    return result;
  }

}

export default DashboardService;