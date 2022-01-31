import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, Unique, ForeignKey, BelongsTo } from 'sequelize-typescript'
import IStdBom from '../../interfaces/std/bom.interface';
import AutUser from '../aut/user.model';
import StdFactory from './factory.model';
import StdLocation from './location.model';
import StdProd from './prod.model';
import StdStore from './store.model';
import StdUnit from './unit.model';
import AdmBomInputType from '../adm/bom-input-type.model';

@Table({
  tableName: 'STD_BOM_TB',
  modelName: 'StdBom',
  comment: 'BOM 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdBom extends Model<IStdBom> {
  @Column({
    comment: 'BOM ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  bom_id: number;

  @Unique('std_bom_tb_factory_id_p_prod_id_c_prod_id_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('std_bom_tb_factory_id_p_prod_id_c_prod_id_un')
  @ForeignKey(() => StdProd)
  @Column({
    comment: '부모품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  p_prod_id: number;

  @Unique('std_bom_tb_factory_id_p_prod_id_c_prod_id_un')
  @ForeignKey(() => StdProd)
  @Column({
    comment: '자식품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  c_prod_id: number;

  @Column({
    comment: '소요량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  c_usage: number;

  @ForeignKey(() => StdUnit)
  @Column({
    comment: '단위ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  unit_id: number;

  @Column({
    comment: '정렬',
    type: DataType.INTEGER,
  })
  sortby: number;

  @ForeignKey(() => AdmBomInputType)
  @Column({
    comment: '투입방법ID',
    type: DataType.INTEGER,
  })
  bom_input_type_id: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '출고 창고ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  from_store_id: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '출고 위치ID',
    type: DataType.INTEGER,
  })
  from_location_id: number;

  @Column({
    comment: '비고',
    type: DataType.STRING(250),
  })
  remark: number;

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

  @Unique('std_bom_tb_uuid_un')
  @Column({
    comment: 'BOM UUID',
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

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;
  @BelongsTo(() => StdProd, { foreignKey: 'p_prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdPProd: StdProd;
  @BelongsTo(() => StdProd, { foreignKey: 'c_prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdCProd: StdProd;
  @BelongsTo(() => AdmBomInputType, { foreignKey: 'bom_input_type_id', targetKey: 'bom_input_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  admBomInputType: AdmBomInputType;
  @BelongsTo(() => StdStore, { foreignKey: 'from_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdStore: StdStore;
  @BelongsTo(() => StdLocation, { foreignKey: 'from_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdLocation: StdLocation;
  @BelongsTo(() => StdUnit, { foreignKey: 'unit_id', targetKey: 'unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdUnit: StdUnit;

  // HasMany
  // @HasMany(() => StdBom, { as: 'child', foreignKey: 'p_prod_id', sourceKey: 'c_prod_id', constraints: false })
  // child: StdBom;
  //#endregion
}