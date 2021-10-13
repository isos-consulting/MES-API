import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IAdmPatternHistory from '../../interfaces/adm/pattern-history.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';

@Table({
  tableName: 'ADM_PATTERN_HISTORY_TB',
  modelName: 'AdmPatternHistory',
  comment: '번호 자동발행 이력 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmPatternHistory extends Model<IAdmPatternHistory> {
  @Column({
    comment: '번호 자동발행 이력ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  pattern_history_id: number;

  @Unique('adm_pattern_history_tb_factory_id_table_nm_col_nm_pattern_reg_date_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: string;

  @Unique('adm_pattern_history_tb_factory_id_table_nm_col_nm_pattern_reg_date_un')
  @Column({
    comment: '테이블명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  table_nm: string;

  @Unique('adm_pattern_history_tb_factory_id_table_nm_col_nm_pattern_reg_date_un')
  @Column({
    comment: '컬럼명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  col_nm: string;

  @Unique('adm_pattern_history_tb_factory_id_table_nm_col_nm_pattern_reg_date_un')
  @Column({
    comment: '패턴',
    type: DataType.STRING(100),
    allowNull: false,
  })
  pattern: string;

  @Unique('adm_pattern_history_tb_factory_id_table_nm_col_nm_pattern_reg_date_un')
  @Column({
    comment: '발행 일자',
    type: DataType.DATEONLY,
    allowNull: false,
  })
  reg_date: string;

  @Column({
    comment: '발행 차수',
    type: DataType.INTEGER,
    allowNull: false,
  })
  seq: number;

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

  @Unique('adm_pattern_history_tb_uuid_un')
  @Column({
    comment: '번호 자동발행 이력UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string;

  //#region ✅ Define Association
  // BelongTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', onDelete: 'restrict', onUpdate: 'cascade' })
  updateUser: AutUser;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  // HasMany
  //#endregion
}