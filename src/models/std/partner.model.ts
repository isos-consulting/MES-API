import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdPartner from '../../interfaces/std/partner.interface';
import AutUser from '../aut/user.model';
import StdPartnerType from './partner-type.model';

@Table({
  tableName: 'STD_PARTNER_TB',
  modelName: 'StdPartner',
  comment: '거래처 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdPartner extends Model<IStdPartner> {
  @Column({
    comment: '거래처ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  partner_id: number;

  @Unique('std_partner_tb_partner_cd_un')
  @Column({
    comment: '거래처코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  partner_cd: string;

  @Column({
    comment: '거래처명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  partner_nm: string;

  @ForeignKey(() => StdPartnerType)
  @Column({
    comment: '거래처 유형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  partner_type_id: number;

  @Column({
    comment: '거래처 사업자등록번호',
    type: DataType.STRING(12),
  })
  partner_no: string;

  @Column({
    comment: '대표자명',
    type: DataType.STRING(20),
  })
  boss_nm: string;

  @Column({
    comment: '담당자',
    type: DataType.STRING(20),
  })
  manager: string;

  @Column({
    comment: '이메일',
    type: DataType.STRING(50),
  })
  email: string;

  @Column({
    comment: '전화번호',
    type: DataType.STRING(13),
  })
  tel: string;

  @Column({
    comment: '팩스번호',
    type: DataType.STRING(13),
  })
  fax: string;

  @Column({
    comment: '우편번호',
    type: DataType.STRING(6),
  })
  post: string;

  @Column({
    comment: '주소',
    type: DataType.STRING(100),
  })
  addr: string;

  @Column({
    comment: '상세주소',
    type: DataType.STRING(250),
  })
  addr_detail: string;

  @Column({
    comment: '사용유무',
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  })
  use_fg: boolean;

  @Column({
    comment: '매입처유무',
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  vendor_fg: boolean;

  @Column({
    comment: '매출처유무',
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  customer_fg: boolean;

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

  @Unique('std_partner_tb_uuid_un')
  @Column({
    comment: '거래처UUID',
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

  @BelongsTo(() => StdPartnerType, { foreignKey: 'partner_type_id', targetKey: 'partner_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdPartnerType: StdPartnerType;

  // HasMany
  //#endregion
}