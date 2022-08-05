import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IAdmExcelForm from '../../interfaces/adm/excel-form.interface';
import AutUser from '../aut/user.model';
import AutMenu from '../aut/menu.model';

@Table({
  tableName: 'ADM_EXCEL_FORM_TB',
  modelName: 'AdmExcelForm',
  comment: ' Excel 양식 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class AdmExcelForm extends Model<IAdmExcelForm> {
  @Column({
    comment: 'Excel 양식 ID',
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
		autoIncrement: true,
    autoIncrementIdentity: true,
  })
  excel_form_id: number;

	@Column({
    comment: 'Excel 양식 코드',
    type: DataType.STRING(50),
    allowNull: false,
  })
  excel_form_cd: string;

	@Column({
    comment: 'Excel 양식 명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  excel_form_nm: string;

  @ForeignKey(() => AutMenu)
  @Column({
    comment: '메뉴ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  menu_id: number;

  @Column({
    comment: '엑셀 양식 컬럼 명',
    type: DataType.STRING(100),
    allowNull: false,
  })
  excel_form_column_nm: string;

	@Column({
    comment: '엑셀 양식 컬럼 코드',
    type: DataType.STRING(100),
    allowNull: false,
  })
  excel_form_column_cd: string;

	@Column({
    comment: '엑셀 양식 타입',
    type: DataType.STRING(50),
    allowNull: false,
  })
  excel_form_type: string;

  @Column({
    comment: '참조 메뉴',
    type: DataType.STRING(100),
    allowNull: true,
  })
  reference_menu: string;

	@Column({
    comment: '필수값 여부 (0: 선택, 1: 필수)',
    type: DataType.BOOLEAN,
		defaultValue: false,
  })
  column_fg: boolean;

  @Column({
    comment: '컬럼순서',
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

	@Unique('adm_excel_form_tb_uuid_un')
  @Column({
    comment: 'Excel 양식 UUID',
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

	@BelongsTo(() => AutMenu, { foreignKey: 'menu_id', targetKey: 'menu_id', onDelete: 'restrict', onUpdate: 'cascade' })
  autMenu: AutMenu;

  // HasMany
  //#endregion
}