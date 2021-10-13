import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, Sequelize } from 'sequelize-typescript'
import IAutGroup from '../../interfaces/aut/group.interface';
import AutUser from './user.model';

@Table({
  tableName: 'AUT_GROUP_TB',
  modelName: 'AutGroup',
  comment: '권한그룹 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class AutGroup extends Model<IAutGroup> {
  @Column({
    comment: '권한그룹ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  group_id: number;

  @Unique('aut_group_tb_group_nm_un')
  @Column({
    comment: '권한그룹명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  group_nm: string;

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

  @Unique('aut_group_tb_uuid_un')
  @Column({
    comment: '권한 그룹UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string

  //#region ✅ Define Association
  // BelongsTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', constraints: false })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', constraints: false })
  updateUser: AutUser;
  //#endregion
}