import StdStore from "../models/std/store.model";
import StdPartnerTypeRepo from "../repositories/std/partner-type.repository";

const fkInfos = {
  partner_type: {
    key: 'partnerType',
    TRepo: StdPartnerTypeRepo,
    cdName: 'partner_type_cd',
    cdColumnName: '거래처 유형 코드',
    uuidName: 'partner_type_uuid',
  },
  store: {
    key: 'store',
    TRepo: StdStore,
    cdName: 'store_cd',
    cdColumnName: '창고',
    uuidName: 'store_uuid'
  },
}

export default fkInfos;