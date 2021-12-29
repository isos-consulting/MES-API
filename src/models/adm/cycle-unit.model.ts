import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IAdmCycleUnit from '../../interfaces/adm/cycle-unit.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'ADM_CYCLE_UNIT_TB',
  modelName: 'AdmCycleUnit',
  comment: '주기단위 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmCycleUnit extends Model<IAdmCycleUnit> {
  @Column({
    comment: '주기단위ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
		autoIncrement: true,
    autoIncrementIdentity: true,
  })
  cycle_unit_id: number;

  @Unique('adm_cycle_unit_tb_cycle_unit_cd_un')
  @Column({
    comment: '주기단위코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  cycle_unit_cd: string;

  @Column({
    comment: '주기단위명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  cycle_unit_nm: string;
  
	@Column({
    comment: '주기변환포맷',
    type: DataType.STRING(20),
    allowNull: false,
  })
  format: string;
  
	@Column({
    comment: '정렬',
    type: DataType.INTEGER
  })
  sortby: number;

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

	@Unique('adm_cycle_unit_tb_uuid_un')
  @Column({
    comment: '주기단위UUID',
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

  // HasMany
  //#endregion
}