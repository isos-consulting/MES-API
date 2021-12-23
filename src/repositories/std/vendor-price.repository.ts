import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdVendorPrice from '../../models/std/vendor-price.model';
import IStdVendorPrice from '../../interfaces/std/vendor-price.interface';
import { Sequelize } from 'sequelize-typescript';
import convertBulkResult from '../../utils/convertBulkResult';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import moment from 'moment';

class StdVendorPriceRepo {
  repo: Repository<StdVendorPrice>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdVendorPrice);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdVendorPrice[], uid: number, transaction?: Transaction) => {
    try {
      const vendorPrice = body.map((vendorPrice) => {
        return {
          partner_id: vendorPrice.partner_id,
          prod_id: vendorPrice.prod_id,
          unit_id: vendorPrice.unit_id,
          price: vendorPrice.price,
          money_unit_id: vendorPrice.money_unit_id,
          price_type_id: vendorPrice.price_type_id,
          start_date: vendorPrice.start_date,
          end_date: '9999-12-31',
          retroactive_price: vendorPrice.retroactive_price,
          division: vendorPrice.division,
          remark: vendorPrice.remark,
          created_uid: uid,
          updated_uid: uid,
        }
      });

      const result = await this.repo.bulkCreate(vendorPrice, { individualHooks: true, transaction });

      return convertBulkResult(result);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  //#endregion

  //#region 🔵 Read Functions
  
  // 📒 Fn[read]: Default Read Function
  public read = async(params?: any) => {
    try {
      let whereOptions: WhereOptions<StdVendorPrice> = {};

      // 단가 기준일 Filetering 
      // params.date == null || undefined 일 경우 전체 조회
      // 입력 할 경우 기준일로부터 하나의 단가 데이터만 조회

      if (params.date != null) {
        whereOptions = { 
          [Op.and]: [
            { start_date: {[Op.lte] : params.date} },
            { end_date: {[Op.gte] : params.date} }
          ]
        }
      }

      const result = await this.repo.findAll({ 
        include: [
          { 
            model: this.sequelize.models.StdPartner, 
            attributes: [], 
            required: true,
            where: { uuid: params.partner_uuid ? params.partner_uuid : { [Op.ne]: null } }
          },
          { model: this.sequelize.models.StdMoneyUnit, attributes: [], required: false },
          { model: this.sequelize.models.StdPriceType, attributes: [], required: false },
          { 
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdStore, attributes: [], required: false },
              { model: this.sequelize.models.StdLocation, attributes: [], required: false },
            ],
            where: { uuid: params.prod_uuid ? params.prod_uuid : { [Op.ne]: null } },
          },
          { model: this.sequelize.models.StdUnit, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdVendorPrice.uuid'), 'vendor_price_uuid' ],
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          [ Sequelize.col('stdProd.prod_nm'), 'prod_nm' ],
          [ Sequelize.col('stdProd.stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProd.stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdProd.stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdProd.stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdProd.stdModel.model_nm'), 'model_nm' ],
          [ Sequelize.col('stdProd.rev'), 'rev' ],
          [ Sequelize.col('stdProd.prod_std'), 'prod_std' ],
          [ Sequelize.col('stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdUnit.unit_nm'), 'unit_nm' ],
          [ Sequelize.col('stdProd.mat_order_min_qty'), 'mat_order_min_qty' ],
          [ Sequelize.col('stdProd.qms_receive_insp_fg'), 'qms_receive_insp_fg' ],
          [ Sequelize.col('stdProd.stdStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('stdProd.stdStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('stdProd.stdStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('stdProd.stdLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('stdProd.stdLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('stdProd.stdLocation.location_nm'), 'to_location_nm' ],
          [ Sequelize.col('stdMoneyUnit.uuid'), 'money_unit_uuid' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_cd'), 'money_unit_cd' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_nm'), 'money_unit_nm' ],
          [ Sequelize.col('stdPriceType.uuid'), 'price_type_uuid' ],
          [ Sequelize.col('stdPriceType.price_type_cd'), 'price_type_cd' ],
          [ Sequelize.col('stdPriceType.price_type_nm'), 'price_type_nm' ],
          'price',
          'start_date',
          'end_date',
          'retroactive_price',
          'division',
          [ Sequelize.col('stdProd.inv_unit_qty'), 'unit_qty' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: whereOptions,
        order: [ 'partner_id', 'prod_id', 'vendor_price_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findOne({ 
        include: [
          { model: this.sequelize.models.StdPartner, attributes: [], required: true },
          { model: this.sequelize.models.StdMoneyUnit, attributes: [], required: false },
          { model: this.sequelize.models.StdPriceType, attributes: [], required: false },
          { 
            model: this.sequelize.models.StdProd, 
            attributes: [], 
            required: true,
            include: [
              { model: this.sequelize.models.StdItemType, attributes: [], required: false },
              { model: this.sequelize.models.StdProdType, attributes: [], required: false },
              { model: this.sequelize.models.StdModel, attributes: [], required: false },
              { model: this.sequelize.models.StdStore, attributes: [], required: false },
              { model: this.sequelize.models.StdLocation, attributes: [], required: false },
            ]
          },
          { model: this.sequelize.models.StdUnit, attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdVendorPrice.uuid'), 'vendor_price_uuid' ],
          [ Sequelize.col('stdPartner.uuid'), 'partner_uuid' ],
          [ Sequelize.col('stdPartner.partner_cd'), 'partner_cd' ],
          [ Sequelize.col('stdPartner.partner_nm'), 'partner_nm' ],
          [ Sequelize.col('stdProd.uuid'), 'prod_uuid' ],
          [ Sequelize.col('stdProd.prod_no'), 'prod_no' ],
          [ Sequelize.col('stdProd.prod_nm'), 'prod_nm' ],
          [ Sequelize.col('stdProd.stdItemType.uuid'), 'item_type_uuid' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_cd'), 'item_type_cd' ],
          [ Sequelize.col('stdProd.stdItemType.item_type_nm'), 'item_type_nm' ],
          [ Sequelize.col('stdProd.stdProdType.uuid'), 'prod_type_uuid' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_cd'), 'prod_type_cd' ],
          [ Sequelize.col('stdProd.stdProdType.prod_type_nm'), 'prod_type_nm' ],
          [ Sequelize.col('stdProd.stdModel.uuid'), 'model_uuid' ],
          [ Sequelize.col('stdProd.stdModel.model_cd'), 'model_cd' ],
          [ Sequelize.col('stdProd.stdModel.model_nm'), 'model_nm' ],
          [ Sequelize.col('stdProd.rev'), 'rev' ],
          [ Sequelize.col('stdProd.prod_std'), 'prod_std' ],
          [ Sequelize.col('stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdUnit.unit_nm'), 'unit_nm' ],
          [ Sequelize.col('stdProd.mat_order_min_qty'), 'mat_order_min_qty' ],
          [ Sequelize.col('stdProd.qms_receive_insp_fg'), 'qms_receive_insp_fg' ],
          [ Sequelize.col('stdProd.stdStore.uuid'), 'to_store_uuid' ],
          [ Sequelize.col('stdProd.stdStore.store_cd'), 'to_store_cd' ],
          [ Sequelize.col('stdProd.stdStore.store_nm'), 'to_store_nm' ],
          [ Sequelize.col('stdProd.stdLocation.uuid'), 'to_location_uuid' ],
          [ Sequelize.col('stdProd.stdLocation.location_cd'), 'to_location_cd' ],
          [ Sequelize.col('stdProd.stdLocation.location_nm'), 'to_location_nm' ],
          [ Sequelize.col('stdMoneyUnit.uuid'), 'money_unit_uuid' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_cd'), 'money_unit_cd' ],
          [ Sequelize.col('stdMoneyUnit.money_unit_nm'), 'money_unit_nm' ],
          [ Sequelize.col('stdPriceType.uuid'), 'price_type_uuid' ],
          [ Sequelize.col('stdPriceType.price_type_cd'), 'price_type_cd' ],
          [ Sequelize.col('stdPriceType.price_type_nm'), 'price_type_nm' ],
          'price',
          'start_date',
          'end_date',
          'retroactive_price',
          'division',
          [ Sequelize.col('stdProd.inv_unit_qty'), 'unit_qty' ],
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { uuid },
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readRawsByUuids]: Id 를 포함한 Raw Datas Read Function
  public readRawsByUuids = async(uuids: string[]) => {
    const result = await this.repo.findAll({ where: { uuid: { [Op.in]: uuids } } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByUuid]: Id 를 포함한 Raw Data Read Function
  public readRawByUuid = async(uuid: string) => {
    const result = await this.repo.findOne({ where: { uuid } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByUnique]: Unique Key를 통하여 Raw Data Read Function
  public readRawByUnique = async(
    params: { partner_id: number, prod_id: number, start_date: string }
  ) => {
    const result = await this.repo.findOne({ 
      where: {
        [Op.and]: [
          { partner_id: params.partner_id },
          { prod_id: params.prod_id },
          { start_date: params.start_date }
        ]
      }
    });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdVendorPrice[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let vendorPrice of body) {
        const result = await this.repo.update(
          {
            unit_id: vendorPrice.unit_id != null ? vendorPrice.unit_id : null,
            price: vendorPrice.price != null ? vendorPrice.price : null,
            money_unit_id: vendorPrice.money_unit_id != null ? vendorPrice.money_unit_id : null,
            price_type_id: vendorPrice.price_type_id != null ? vendorPrice.price_type_id : null,
            start_date: vendorPrice.start_date != null ? vendorPrice.start_date : null,
            retroactive_price: vendorPrice.retroactive_price != null ? vendorPrice.retroactive_price : null,
            division: vendorPrice.division != null ? vendorPrice.division : null,
            remark: vendorPrice.remark != null ? vendorPrice.remark : null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: vendorPrice.uuid },
            returning: true,
            individualHooks: true,
            transaction
          },
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdVendorPrice.getTableName() as string, previousRaws, uid, transaction);

      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdVendorPrice[], uid: number, transaction?: Transaction) => {
    let raws: any[] = [];

    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let vendorPrice of body) {
        const result = await this.repo.update(
          {
            unit_id: vendorPrice.unit_id,
            price: vendorPrice.price,
            money_unit_id: vendorPrice.money_unit_id,
            price_type_id: vendorPrice.price_type_id,
            start_date: vendorPrice.start_date,
            retroactive_price: vendorPrice.retroactive_price,
            division: vendorPrice.division,
            remark: vendorPrice.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: vendorPrice.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );

        raws.push(result);
      };

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdVendorPrice.getTableName() as string, previousRaws, uid, transaction);

      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdVendorPrice[], uid: number, transaction?: Transaction) => {
    let count: number = 0;

    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      for await (let vendorPrice of body) {
        count += await this.repo.destroy({ where: { uuid: vendorPrice.uuid }, transaction});
      };

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdVendorPrice.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
  
  //#endregion

  //#endregion

  //#region ✅ Other Functions
  // 📒 Fn[rearrangeDate]: 입력된 거래처, 품목에 대하여 단가 적용일자와 적용종료일자를 전체 재정렬한다.
  /**
   * 입력된 거래처, 품목에 대하여 단가 적용일자와 적용종료일자를 전체 재정렬한다.
   * @param _partnerId 조회할 거래처 ID
   * @param _prodId 조회할 품목 ID
   * @param _transaction 트랜잭션
   */
  rearrangeDate = async (_partnerId: number, _prodId: number, _transaction?: Transaction) => {
    const datas = await this.repo.findAll(
      {
        transaction: _transaction,
        where: {
          partner_id: _partnerId,
          prod_id: _prodId,
        },
        order: [ 'start_date' ]
      }
    );

    for (let index = 0; index < datas.length; index++) {
      let endDate: string = '9999-12-31';
      const presentData = datas[index];

      // 현재 단가의 다음 적용일자에서 1일을 차감한 일자를
      // 현재 단가 데이터의 적용종료일자로 Update 진행

      if (index + 1 !== datas.length) {
        // 마지막 데이터가 아닐 경우 다음 적용일자 관련 연산 진행 (현재 데이터의 적용 종료일자 계산)
        const nextData = datas[index + 1];
        const cacluatedDate = new Date(nextData.start_date);
        cacluatedDate.setDate(cacluatedDate.getDate() - 1);
        endDate = moment(cacluatedDate).format('YYYY-MM-DD');
      }

      // 계산된 endDate 입력
      await this.repo.update(
        { end_date: endDate },
        {
          transaction: _transaction,
          where: { vendor_price_id: presentData.vendor_price_id }
        }
      );
    }
  }
  //#endregion
}

export default StdVendorPriceRepo;