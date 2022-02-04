import IInvStore from "../interfaces/inv/store.interface";
import checkArray from "./checkArray";

const getStoreBody = (params: {
  datas: any[],
  inout: 'FROM' | 'TO',
  tran_type_id: number,
  reg_date?: string,
  tran_id_alias: string,
  qty_alias?: string,
  store_alias?: string,
  location_alias?: string,
  partner_id?: number,
}) => {
  const datas = checkArray(params.datas);

  let qtyAlias = params.qty_alias ?? 'qty';
  let storeAlias = params.store_alias ?? params.inout === 'FROM' ? 'from_store_id' : 'to_store_id';
  let locationAlias = params.location_alias ?? params.inout === 'FROM' ? 'from_location_id' : 'to_location_id';

  const result: IInvStore[] = datas.map((data: any) => {
    return {
      factory_id: data.factory_id,
      tran_id: data[params.tran_id_alias],
      inout_fg: params.inout === 'FROM' ? false : true,
      reg_date: params.reg_date ?? data.reg_date,
      tran_type_id: params.tran_type_id,
      store_id: data[storeAlias],
      location_id: data[locationAlias],
      prod_id: data.prod_id,
      lot_no: data.lot_no,
      qty: data[qtyAlias],
      partner_id: params.partner_id
    };
  });

  return result;
}

export default getStoreBody;