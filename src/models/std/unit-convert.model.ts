import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdUnitConvert from '../../interfaces/std/unit-convert.interface';
import AutUser from '../aut/user.model';
import StdProd from './prod.model';
import StdUnit from './unit.model';

@Table({
  tableName: 'STD_UNIT_CONVERT_TB',
  modelName: 'StdUnitConvert',
  comment: '단위변환 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdUnitConvert extends Model<IStdUnitConvert> {
  @Column({
    comment: '단위변환ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  unit_convert_id: number;

  @Unique('std_unit_convert_tb_from_unit_id_to_unit_id_prod_id_un')
  @ForeignKey(() => StdUnit)
  @Column({
    comment: 'From 단위ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  from_unit_id: number;

  @Unique('std_unit_convert_tb_from_unit_id_to_unit_id_prod_id_un')
  @ForeignKey(() => StdUnit)
  @Column({
    comment: 'To 단위ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  to_unit_id: number;

  @Column({
    comment: '변환 전 값',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  from_value: number;

  @Column({
    comment: '변환 후 값',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  to_value: number;

  @Column({
    comment: '단위변환 값(계산 값)',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  convert_value: number;

  @Unique('std_unit_convert_tb_from_unit_id_to_unit_id_prod_id_un')
  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
  })
  prod_id: number;

  @Column({
    comment: '비고',
    type: DataType.STRING(250),
  })
  remark: string;

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

  @Unique('std_unit_convert_tb_uuid_un')
  @Column({
    comment: '단위변환UUID',
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

  @BelongsTo(() => StdUnit, { as: 'toUnit', foreignKey: 'to_unit_id', targetKey: 'unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  toUnit: StdUnit;

  @BelongsTo(() => StdUnit, { as: 'fromUnit', foreignKey: 'from_unit_id', targetKey: 'unit_id', onDelete: 'restrict', onUpdate: 'cascade' })
  fromUnit: StdUnit;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  // HasMany
  //#endregion
}