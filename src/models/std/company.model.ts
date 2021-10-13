import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IStdCompany from '../../interfaces/std/company.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'STD_COMPANY_TB',
  modelName: 'StdCompany',
  comment: '회사 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdCompany extends Model<IStdCompany> {
  @Column({
    comment: '회사ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  company_id: number;

  @Column({
    comment: '회사명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  company_nm: string;

  @Column({
    comment: '회사 사업자등록번호',
    type: DataType.STRING(12),
  })
  company_no: string;

  @Column({
    comment: '대표자명',
    type: DataType.STRING(20),
  })
  boss_nm: string;

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

  @Unique('std_company_tb_uuid_un')
  @Column({
    comment: '회사UUID',
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