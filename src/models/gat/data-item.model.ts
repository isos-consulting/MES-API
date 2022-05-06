import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique } from 'sequelize-typescript'
import IStdDataItem from '../../interfaces/gat/data-item.interface';
import AutUser from '../aut/user.model';


@Table({
  tableName: 'STD_DATA_ITEM_TB',
  modelName: 'StdDataItem',
  comment: '인터페이스 항목 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdDataItem extends Model<IStdDataItem> {
  @Column({
    comment: '인터페이스 항목 ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  data_item_id: number;

  @Column({
    comment: '인터페이스 항목코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  data_item_cd: string;

  @Column({
    comment: '안터페이스 항목명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  data_item_nm: string;

	@Column({
    comment: '모니터링 유무',
    type: DataType.BOOLEAN,
		allowNull: true,
    defaultValue: false,
  })
  monitoring_fg: boolean;

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

  @Unique('std_data_itme_tb_uuid_un')
  @Column({
    comment: '인터페이스 항목UUID',
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