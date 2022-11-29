import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IInvEcerp from '../../interfaces/inv/ecerp.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'INV_ECERP_TB',
  modelName: 'InvEcerp',
  comment: 'Ecount Erp 테이블',
  timestamps: true,
  underscored: true,
})
export default class InvEcerp extends Model<IInvEcerp> {
  @Column({
    comment: 'Erp ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  ecerp_id: number;

  @Column({
    comment: '타입',
    type: DataType.STRING(16),
    allowNull: false,
  })
  type: string;

  @Column({
    comment: 'Header ID',
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  header_id: number;

  @Column({
    comment: 'Detail ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  detail_id: number;

  @Column({
    comment: '수량',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  qty: number;

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

  @Unique('inv_store_tb_uuid_un')
  @Column({
    comment: '창고 수불UUID',
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

  // HasMany
  //#endregion
}