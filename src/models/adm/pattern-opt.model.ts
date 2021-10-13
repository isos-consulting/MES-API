import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IAdmPatternOpt from '../../interfaces/adm/pattern-opt.interface';
import AutUser from '../aut/user.model';

@Table({
  tableName: 'ADM_PATTERN_OPT_VW',
  modelName: 'AdmPatternOpt',
  comment: '자동번호발행 옵션정보 뷰',
  timestamps: true,
  underscored: true,
})
export default class AdmPatternOpt extends Model<IAdmPatternOpt> {
  @Column({
    comment: '자동번호발행 옵션정보ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  pattern_opt_id: number;

  @Unique('adm_pattern_opt_vw_pattern_opt_cd_un')
  @Column({
    comment: '자동번호발행 옵션정보코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  pattern_opt_cd: string;

  @Column({
    comment: '자동번호발행 옵션정보명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  pattern_opt_nm: string;

  @Column({
    comment: '테이블 명',
    type: DataType.STRING,
    allowNull: false,
  })
  table_nm: string;

  @Column({
    comment: '자동발행 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  auto_fg: string;

  @Column({
    comment: '컬럼 명',
    type: DataType.STRING,
    allowNull: false,
  })
  col_nm: string;

  @Column({
    comment: '패턴',
    type: DataType.STRING,
    allowNull: false,
  })
  pattern: string;

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