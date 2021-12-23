import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IMldMold from '../../interfaces/mld/mold.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';

@Table({
  tableName: 'MLD_MOLD_TB',
  modelName: 'MldMold',
  comment: '금형관리 테이블',
  timestamps: true,
  underscored: true,
})
export default class MldMold extends Model<IMldMold> {
  @Column({
    comment: '금형ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  mold_id: number;

	@Unique('mld_mold_tb_factory_id_mold_cd_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

	@Unique('mld_mold_tb_factory_id_mold_cd_un')
  @Column({
    comment: '금형코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  mold_cd: string;

	@Column({
    comment: '금형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  mold_nm: string;

	@Column({
    comment: '금형번호',
    type: DataType.STRING(50),
    allowNull: false,
  })
  mold_no: string;

	@Column({
    comment: 'cavity',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  cavity: number;

	@Column({
    comment: '보증타수',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  guarantee_cnt: number;

	@Column({
    comment: '기초타수',
    type: DataType.DECIMAL(19, 6),
    allowNull: false,
  })
  basic_cnt: number;

	@Column({
    comment: '제조사',
    type: DataType.STRING(50),
  })
  manufacturer: string;

	@Column({
    comment: '구매일자',
    type: DataType.DATE,
  })
  purchase_date: Date;

	@Column({
    comment: '금형무게',
    type: DataType.DECIMAL(19, 6),
  })
  weight: number;

	@Column({
    comment: '금형크기',
    type: DataType.STRING(50),
  })
  size: string;

	@Column({
    comment: '금형유무',
    type: DataType.BOOLEAN,
		allowNull: false,
    defaultValue: true,
  })
  use_fg: boolean;

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

  @Unique('mld_mold_tb_uuid_un')
  @Column({
    comment: '금형UUID',
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
	
  // HasMany
  //#endregion
}