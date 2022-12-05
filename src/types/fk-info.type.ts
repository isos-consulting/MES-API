import StdMoneyUnitRepo from "../repositories/std/money-unit.repository";
import StdPartnerTypeRepo from "../repositories/std/partner-type.repository";
import StdPartnerRepo from "../repositories/std/partner.repository";
import StdProdRepo from "../repositories/std/prod.repository";
import StdStoreRepo from "../repositories/std/store.repository";
import StdUnitRepo from "../repositories/std/unit.repository";

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
    TRepo: StdStoreRepo,
    cdName: 'store_cd',
    cdColumnName: '창고',
    uuidName: 'store_uuid'
  },
  to_store: {
    key: 'to_store',
    TRepo: StdStoreRepo,
    cdName: 'store_cd',
    cdAlias: 'to_store_cd',
    cdColumnName: '입고창고',
    uuidName: 'to_store_uuid'
  },
  from_store: {
    key: 'from_store',
    TRepo: StdStoreRepo,
    cdName: 'store_cd',
    cdAlias: 'from_store_cd',
    cdColumnName: '출고창고',
    uuidName: 'from_store_uuid'
  },
  partner: {
    key: 'partner',
    TRepo: StdPartnerRepo,
    cdName: 'partner_cd',
    cdColumnName: '거래처',
    uuidName: 'partner_uuid'
  },
  prod: {
    key: 'prod',
    TRepo: StdProdRepo,
    cdName: 'prod_no',
    cdColumnName: '품목',
    uuidName: 'prod_uuid'
  },
  unit: {
    key: 'unit',
    TRepo: StdUnitRepo,
    cdName: 'unit_nm',
    cdColumnName: '단위',
    uuidName: 'unit_uuid'
  },
  money_unit: {
    key: 'money_unit',
    TRepo: StdMoneyUnitRepo,
    cdName: 'money_unit_nm',
    cdColumnName: '화폐단위',
    uuidName: 'money_unit_uuid'
  }
}

export default fkInfos;