import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdProd from '../../interfaces/std/prod.interface';
import AdmBomType from '../adm/bom-type.model';
import AdmPrdPlanType from '../adm/prd-plan-type.model';
import AutUser from '../aut/user.model';
import StdItemType from './item-type.model';
import StdLocation from './location.model';
import StdModel from './model.model';
import StdProdType from './prod-type.model';
import StdStore from './store.model';
import StdUnit from './unit.model';

@Table({
  tableName: 'STD_PROD_TB',
  modelName: 'StdProd',
  comment: '품목 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdProd extends Model<IStdProd> {
  @Column({
    comment: '품목ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @Unique('std_prod_tb_prod_no_rev_un')
  @Column({
    comment: '품번',
    type: DataType.STRING(50),
    allowNull: false,
  })
  prod_no: string;

  @Column({
    comment: '구품번',
    type: DataType.STRING(50),
    allowNull: true,
  })
  prod_no_pre: string;

  @Column({
    comment: '품목명',
    type: DataType.STRING(100),
    allowNull: false,
  })
  prod_nm: string;

  @ForeignKey(() => StdItemType)
  @Column({
    comment: '품목 유형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  item_type_id: number;

  @ForeignKey(() => StdProdType)
  @Column({
    comment: '제품 유형ID',
    type: DataType.INTEGER,
  })
  prod_type_id: number;

  @ForeignKey(() => StdModel)
  @Column({
    comment: '모델ID',
    type: DataType.INTEGER,
  })
  model_id: number;

  @ForeignKey(() => StdUnit)
  @Column({
    comment: '단위ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  unit_id: number;

  @Unique('std_prod_tb_prod_no_rev_un')
  @Column({
    comment: '리비전',
    type: DataType.STRING(10),
    allowNull: false,
  })
  rev: string;

  @Column({
    comment: '규격',
    type: DataType.STRING(250),
  })
  prod_std: string;

  @Column({
    comment: 'LOT 사용유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  lot_fg: boolean;

  @Column({
    comment: '사용유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  use_fg: boolean;

  @Column({
    comment: '품목 활성 상태',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active_fg: boolean;

  @Column({
    comment: 'BOM 유형ID',
    type: DataType.INTEGER,
  })
  bom_type_id: number;

  @Column({
    comment: '폭',
    type: DataType.DECIMAL(19, 6),
  })
  width: number;

  @Column({
    comment: '길이',
    type: DataType.DECIMAL(19, 6),
  })
  length: number;

  @Column({
    comment: '높이',
    type: DataType.DECIMAL(19, 6),
  })
  height: number;

  @Column({
    comment: '재질',
    type: DataType.STRING(20),
  })
  material: string;

  @Column({
    comment: '색상',
    type: DataType.STRING(20),
  })
  color: string;

  @Column({
    comment: '중량',
    type: DataType.DECIMAL(19, 6),
  })
  weight: number;

  @Column({
    comment: '두께',
    type: DataType.DECIMAL(19, 6),
  })
  thickness: number;

  @Column({
    comment: '발주 사용유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  mat_order_fg: boolean;

  @ForeignKey(() => StdUnit)
  @Column({
    comment: '구매단위ID',
    type: DataType.INTEGER,
  })
  mat_unit_id: number;

  @Column({
    comment: '발주 최소 단위수량',
    type: DataType.DECIMAL(19, 6),
  })
  mat_order_min_qty: number;

  @Column({
    comment: '발주 소요일',
    type: DataType.DECIMAL(19, 6),
  })
  mat_supply_days: number;

  @Column({
    comment: '수주 사용유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  sal_order_fg: boolean;

  @Column({
    comment: '창고 사용유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  inv_use_fg: boolean;

  @Column({
    comment: '단위수량',
    type: DataType.DECIMAL(19, 6),
  })
  inv_unit_qty: number;

  @Column({
    comment: '안전 재고수량',
    type: DataType.DECIMAL(19, 6),
  })
  inv_safe_qty: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '품목 입고 창고ID',
    type: DataType.INTEGER,
  })
  inv_to_store_id: number;

  @ForeignKey(() => StdLocation)
  @Column({
    comment: '품목 입고 위치ID',
    type: DataType.INTEGER,
  })
  inv_to_location_id: number;

  @Column({
    comment: '수입검사유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  qms_receive_insp_fg: boolean;

  @Column({
    comment: '공정검사유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  qms_proc_insp_fg: boolean;

  @Column({
    comment: '최종검사유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  qms_final_insp_fg: boolean;

  @Column({
    comment: '계획유형ID (MPS/MRP)',
    type: DataType.INTEGER,
  })
  prd_plan_type_id: number;

  @Column({
    comment: '생산품유무',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  prd_active_fg: boolean;

  @Column({
    comment: '생산계획 최소값',
    type: DataType.DECIMAL(19, 6),
  })
  prd_min: number;

  @Column({
    comment: '생산계획 최대값',
    type: DataType.DECIMAL(19, 6),
  })
  prd_max: number;

  @CreatedAt
  @Column({
    comment: '데이터 생성 일시',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('now')
  })
  created_at: Date;
  
  @Column({
    comment: '데이터 생성자 UID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  created_uid: number;

  @UpdatedAt
  @Column({
    comment: '데이터 수정 일시',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('now')
  })
  updated_at: Date;

  @Column({
    comment: '데이터 수정자 UID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  updated_uid: number;

  @Unique('std_prod_tb_uuid_un')
  @Column({
    comment: '품목UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string

  //#region ✅ Define Association
  // BelongTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  updateUser: AutUser;

  @BelongsTo(() => StdItemType, { foreignKey: 'item_type_id', targetKey: 'item_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdItemType: StdItemType;

  @BelongsTo(() => StdProdType, { foreignKey: 'prod_type_id', targetKey: 'prod_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProdType: StdProdType;

  @BelongsTo(() => StdModel, { foreignKey: 'model_id', targetKey: 'model_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdModel: StdModel;

  @BelongsTo(() => StdUnit, { as: 'stdUnit', foreignKey: 'unit_id', targetKey: 'unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdUnit: StdUnit;

  @BelongsTo(() => StdUnit, { as: 'matUnit', foreignKey: 'mat_unit_id', targetKey: 'unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  matUnit: StdUnit;

  @BelongsTo(() => StdStore, { foreignKey: 'inv_to_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdStore: StdStore;

  @BelongsTo(() => StdLocation, { foreignKey: 'inv_to_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdLocation: StdLocation;

  @BelongsTo(() => AdmBomType, { foreignKey: 'bom_type_id', targetKey: 'bom_type_id', constraints: false })
  admBomType: AdmBomType;

  @BelongsTo(() => AdmPrdPlanType, { foreignKey: 'prd_plan_type_id', targetKey: 'prd_plan_type_id', constraints: false })
  admPrdPlanType: AdmPrdPlanType;

  // HasMany
  //#endregion
}