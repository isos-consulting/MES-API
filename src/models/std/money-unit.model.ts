import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IStdMoneyUnit from '../../interfaces/std/money-unit.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'STD_MONEY_UNIT_TB',
  modelName: 'StdMoneyUnit',
  comment: '화폐단위 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdMoneyUnit extends Model<IStdMoneyUnit> {
  @Column({
    comment: '화폐단위ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  money_unit_id: number;

  @Unique('std_money_unit_tb_money_unit_cd_un')
  @Column({
    comment: '화폐단위코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  money_unit_cd: string;

  @Column({
    comment: '화폐단위명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  money_unit_nm: string;

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

  @Unique('std_money_unit_tb_uuid_un')
  @Column({
    comment: '화폐단위UUID',
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