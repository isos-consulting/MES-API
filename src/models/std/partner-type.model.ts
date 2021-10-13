import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IStdPartnerType from '../../interfaces/std/partner-type.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'STD_PARTNER_TYPE_TB',
  modelName: 'StdPartnerType',
  comment: '거래처 유형 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdPartnerType extends Model<IStdPartnerType> {
  @Column({
    comment: '거래처 유형ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  partner_type_id: number;

  @Unique('std_partner_type_tb_partner_type_cd_un')
  @Column({
    comment: '거래처 유형코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  partner_type_cd: string;

  @Column({
    comment: '거래처 유형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  partner_type_nm: string;

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

  @Unique('std_partner_type_tb_uuid_un')
  @Column({
    comment: '거래처 유형UUID',
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