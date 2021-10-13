import IInvStore from "../interfaces/inv/store.interface";
import checkArray from "./checkArray";
import getTranTypeCd from "./getTranTypeCd";

const getStoreBody = (_datas: any[], _inOutFg: 'FROM' | 'TO', _tranIdName: string, _tranCd: string, _regDate?: string) => {
  _datas = checkArray(_datas);

  let qty: string;
  let store: string;
  let location: string;

  // 📌 재작업 분해 시 수불에 대한 예외처리
  switch (_tranCd) {
    case getTranTypeCd('QMS_DISASSEMBLE_INCOME'):
      qty = 'income_qty';
      store = 'income_store_id';
      location = 'income_location_id';
      break;
    case getTranTypeCd('QMS_DISASSEMBLE_RETURN'):
      qty = 'return_qty';
      store = 'return_store_id';
      location = 'return_location_id';
      break;
    case getTranTypeCd('QMS_RECEIVE_INSP_REJECT'):
      qty = 'reject_qty';
      store = 'reject_store_id';
      location = 'reject_location_id';
      break;
    case getTranTypeCd('QMS_FINAL_INSP_INCOME'):
      qty = 'pass_qty';
      store = _inOutFg === 'FROM' ? 'from_store_id' : 'to_store_id';
      location = _inOutFg === 'FROM' ? 'from_location_id' : 'to_location_id';
      break;
    case getTranTypeCd('QMS_FINAL_INSP_REJECT'):
      qty = 'reject_qty';
      store = _inOutFg === 'FROM' ? 'from_store_id' : 'reject_store_id';
      location = _inOutFg === 'FROM' ? 'from_location_id' : 'reject_location_id';
      break;
    default:
      qty = 'qty';
      store = _inOutFg === 'FROM' ? 'from_store_id' : 'to_store_id';
      location = _inOutFg === 'FROM' ? 'from_location_id' : 'to_location_id';
      break;
  }

  const result: IInvStore[] = _datas.map((data: any) => {
    return {
      factory_id: data.factory_id,
      tran_id: data[_tranIdName],
      inout_fg: _inOutFg === 'FROM' ? false : true,
      reg_date: _regDate ? _regDate : data.reg_date,
      tran_cd: _tranCd,
      store_id: data[store],
      location_id: data[location],
      prod_id: data.prod_id,
      lot_no: data.lot_no,
      qty: data[qty],
    };
  });

  return result;
}

export default getStoreBody;