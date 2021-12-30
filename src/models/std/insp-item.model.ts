import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdInspItem from '../../interfaces/std/insp-item.interface';
import AutUser from '../aut/user.model';
import StdInspItemType from './insp-item-type.model';
import StdFactory from './factory.model';
import StdInspTool from './insp-tool.model';
import StdInspMethod from './insp-method.model';

@Table({
  tableName: 'STD_INSP_ITEM_TB',
  modelName: 'StdInspItem',
  comment: '검사항목 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdInspItem extends Model<IStdInspItem> {
  @Column({
    comment: '검사항목ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_item_id: number;

  @Unique('std_insp_item_tb_factory_id_insp_item_cd_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @ForeignKey(() => StdInspItemType)
  @Column({
    comment: '검사항목 유형ID',
    type: DataType.INTEGER,
  })
  insp_item_type_id: number;

  @Unique('std_insp_item_tb_factory_id_insp_item_cd_un')
  @Column({
    comment: '검사항목코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  insp_item_cd: string;

  @Column({
    comment: '검사항목명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  insp_item_nm: string;

  @ForeignKey(() => StdInspTool)
  @Column({
    comment: '검사구ID',
    type: DataType.INTEGER,
  })
  insp_tool_id: number;

  @ForeignKey(() => StdInspMethod)
  @Column({
    comment: '검사 방법ID',
    type: DataType.INTEGER,
  })
  insp_method_id: number;

  @Column({
    comment: '설비검사항목 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  eqm_fg: boolean;

  @Column({
    comment: '품질검사항목 여부',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  qms_fg: boolean;

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

  @Unique('std_insp_item_tb_uuid_un')
  @Column({
    comment: '검사항목UUID',
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

  @BelongsTo(() => StdInspItemType, { foreignKey: 'insp_item_type_id', targetKey: 'insp_item_type_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdInspItemType: StdInspItemType;

  @BelongsTo(() => StdInspTool, { foreignKey: 'insp_tool_id', targetKey: 'insp_tool_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdInspTool: StdInspTool;

  @BelongsTo(() => StdInspMethod, { foreignKey: 'insp_method_id', targetKey: 'insp_method_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdInspMethod: StdInspMethod;

  // HasMany
  //#endregion
}