import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdCustomerPrice from '../../models/std/customer-price.model';
import IStdCustomerPrice from '../../interfaces/std/customer-price.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';
import moment = require('moment');

class StdCustomerPriceRepo {
  repo: Repository<StdCustomerPrice>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdCustomerPrice);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdCustomerPrice[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((customerPrice: any) => {
        return this.repo.create(
          {
            partner_id: customerPrice.partner_id,
            prod_id: customerPrice.prod_id,
            price: customerPrice.price,
            money_unit_id: customerPrice.money_unit_id,
            price_type_id: customerPrice.price_type_id,
            start_date: customerPrice.start_date,
            end_date: '9999-12-31',
            retroactive_price: customerPrice.retroactive_price,
            division: customerPrice.division,
            remark: customerPrice.remark,
            created_uid: uid,
            updated_uid: uid,
          },
          { hooks: true, transaction }
        );
      });
      const raws = await Promise.all(promises);
      
			return { raws, count: raws.length } as ApiResult<any>;
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
      let whereOptions: WhereOptions<StdCustomerPrice> = {};

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
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ],
            where: { uuid: params.prod_uuid ? params.prod_uuid : { [Op.ne]: null } },
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdCustomerPrice.uuid'), 'customer_price_uuid' ],
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
          [ Sequelize.col('stdProd.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdProd.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdProd.stdUnit.unit_nm'), 'unit_nm' ],
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
        order: [ 'partner_id', 'prod_id', 'customer_price_id' ]
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
              { model: this.sequelize.models.StdUnit, as: 'stdUnit', attributes: [], required: false },
            ]
          },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdCustomerPrice.uuid'), 'customer_price_uuid' ],
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
          [ Sequelize.col('stdProd.stdUnit.uuid'), 'unit_uuid' ],
          [ Sequelize.col('stdProd.stdUnit.unit_cd'), 'unit_cd' ],
          [ Sequelize.col('stdProd.stdUnit.unit_nm'), 'unit_nm' ],
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
  public update = async(body: IStdCustomerPrice[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((customerPrice: any) => {
        return this.repo.update(
          {
            price: customerPrice.price ?? null,
            money_unit_id: customerPrice.money_unit_id ?? null,
            price_type_id: customerPrice.price_type_id ?? null,
            start_date: customerPrice.start_date ?? null,
            retroactive_price: customerPrice.retroactive_price ?? null,
            division: customerPrice.division ?? null,
            remark: customerPrice.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: customerPrice.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdCustomerPrice.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdCustomerPrice[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((customerPrice: any) => {
        return this.repo.update(
          {
            price: customerPrice.price,
            money_unit_id: customerPrice.money_unit_id,
            price_type_id: customerPrice.price_type_id,
            start_date: customerPrice.start_date,
            retroactive_price: customerPrice.retroactive_price,
            division: customerPrice.division,
            remark: customerPrice.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: customerPrice.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdCustomerPrice.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdCustomerPrice[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((customerPrice: any) => {
        return this.repo.destroy({ where: { uuid: customerPrice.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdCustomerPrice.getTableName() as string, previousRaws, uid, transaction);
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
          where: { customer_price_id: presentData.customer_price_id }
        }
      );
    }
  }
  //#endregion
}

export default StdCustomerPriceRepo;