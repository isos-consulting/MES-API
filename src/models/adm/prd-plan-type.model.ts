import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IAdmPrdPlanType from '../../interfaces/adm/prd-plan-type.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'ADM_PRD_PLAN_TYPE_VW',
  modelName: 'AdmPrdPlanType',
  comment: '생산계획 유형 정보 뷰',
  timestamps: true,
  underscored: true,
})
export default class AdmPrdPlanType extends Model<IAdmPrdPlanType> {
  @Column({
    comment: '생산계획 유형ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  prd_plan_type_id: number;

  @Unique('adm_prd_plan_type_vw_prd_plan_type_cd_un')
  @Column({
    comment: '생산계획 유형코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  prd_plan_type_cd: string;

  @Column({
    comment: '생산계획 유형명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  prd_plan_type_nm: string;

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

  //#region ✅ Define Association
  // BelongTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', constraints: false })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', constraints: false })
  updateUser: AutUser;

  // HasMany
  //#endregion
}