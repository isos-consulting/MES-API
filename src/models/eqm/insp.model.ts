import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IEqmInsp from '../../interfaces/eqm/insp.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdEquip from '../std/equip.model';

@Table({
  tableName: 'EQM_INSP_TB',
  modelName: 'EqmInsp',
  comment: '설비검사 기준서 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class EqmInsp extends Model<IEqmInsp> {
  @Column({
    comment: '설비검사 기준서ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_id: number;

  @Unique('eqm_insp_tb_factory_id_insp_no_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('eqm_insp_tb_factory_id_insp_no_un')
  @Column({
    comment: '설비검사 기준서 번호',
    type: DataType.STRING(20),
    allowNull: false,
  })
  insp_no: string;

  @ForeignKey(() => StdEquip)
  @Column({
    comment: '설비ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  equip_id: number;

  @Column({
    comment: '기준서 등록 일시',
    type: DataType.DATE,
    allowNull: false,
  })
  reg_date: string;

  @Column({
    comment: '기준서 적용 일시',
    type: DataType.DATE,
  })
  apply_date: string;

  @Column({
    comment: '기준서 적용 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  apply_fg: boolean;

  @Column({
    comment: '개정 내역',
    type: DataType.STRING(250),
  })
  contents: string;

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

  @Unique('eqm_insp_tb_uuid_un')
  @Column({
    comment: '설비검사 기준서UUID',
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

  @BelongsTo(() => StdEquip, { foreignKey: 'equip_id', targetKey: 'equip_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEquip: StdEquip;

  // HasMany
  //#endregion
}