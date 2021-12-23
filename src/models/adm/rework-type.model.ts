import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IAdmReworkType from '../../interfaces/adm/rework-type.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'ADM_REWORK_TYPE_TB',
  modelName: 'AdmReworkType',
  comment: '재작업 유형 정보 뷰',
  timestamps: true,
  underscored: true,
})
export default class AdmReworkType extends Model<IAdmReworkType> {
  @Column({
    comment: '재작업 유형ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
		autoIncrement: true,
    autoIncrementIdentity: true,
  })
  rework_type_id: number;

  @Unique('adm_rework_type_tb_rework_type_cd_un')
  @Column({
    comment: '재작업 유형코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  rework_type_cd: string;

  @Column({
    comment: '재작업 유형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  rework_type_nm: string;

  @Column({
    comment: '정렬',
    type: DataType.INTEGER,
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

	@Unique('adm_rework_type_tb_uuid_un')
  @Column({
    comment: '재작업 유형UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string;

  //#region ✅ Define Association
  // BelongTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', constraints: false })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', constraints: false })
  updateUser: AutUser;

  // HasMany
  //#endregion
}