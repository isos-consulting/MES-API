import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IAdmInspDetailType from '../../interfaces/adm/insp-detail-type.interface';
import AutUser from '../aut/user.model';
import AdmInspType from './insp-type.model';

@Table({
  tableName: 'ADM_INSP_DETAIL_TYPE_TB',
  modelName: 'AdmInspDetailType',
  comment: '세부검사유형 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmInspDetailType extends Model<IAdmInspDetailType> {
  @Column({
    comment: '세부검사유형ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
		autoIncrement: true,
    autoIncrementIdentity: true,
  })
  insp_detail_type_id: number;

  @Unique('adm_insp_detail_type_tb_insp_detail_type_cd_un')
  @Column({
    comment: '세부검사유형코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  insp_detail_type_cd: string;

  @Column({
    comment: '세부검사유형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  insp_detail_type_nm: string;

  @ForeignKey(() => AdmInspType)
  @Column({
    comment: '검사유형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_type_id: number;

  @Column({
    comment: '작업자 여부',
    type: DataType.BOOLEAN,
  })
  worker_fg: boolean;

  @Column({
    comment: '검사원 여부',
    type: DataType.BOOLEAN,
  })
  inspector_fg: boolean;

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

	@Unique('adm_insp_detail_type_tb_uuid_un')
  @Column({
    comment: '세부검사유형UUID',
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
  
	@BelongsTo(() => AdmInspType, { foreignKey: 'insp_type_id', targetKey: 'insp_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  AdmInspType: AdmInspType;

  // HasMany
  //#endregion
}