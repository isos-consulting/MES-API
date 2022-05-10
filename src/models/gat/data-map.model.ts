import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IStdDataMap from '../../interfaces/gat/data-map.interface';
import AutUser from '../aut/user.model';
import StdEquip from '../std/equip.model';
import StdDataGear from './data-gear.model';
import StdDataItem from './data-item.model';

@Table({
  tableName: 'STD_DATA_MAP_TB',
  modelName: 'StdDataMap',
  comment: '인터페이스 맵 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class StdDataMap extends Model<IStdDataMap> {
  @Column({
    comment: '인터페이스 맵 ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  data_map_id: number;

	@Column({
    comment: '안터페이스 맵명',
    type: DataType.STRING(50),
  })
  data_map_nm: string;

	@Unique('std_data_map_tb_equip_id_data_gear_id_data_item_id_un')
  @ForeignKey(() => StdEquip)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  equip_id: number;

	@Unique('std_data_map_tb_equip_id_data_gear_id_data_item_id_un')
  @ForeignKey(() => StdDataGear)
  @Column({
    comment: '인터페이스 장비ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  data_gear_id: number;

	@Unique('std_data_map_tb_equip_id_data_gear_id_data_item_id_un')
  @ForeignKey(() => StdDataItem)
  @Column({
    comment: '인터페이스 항목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  data_item_id: number;

  @Column({
    comment: '채널',
    type: DataType.STRING(10),
    allowNull: false,
  })
  data_channel: string;

	@Column({
    comment: 'history테이블 저장 유무',
    type: DataType.BOOLEAN,
		allowNull: false,
    defaultValue: false,
  })
  history_yn: boolean;

	@Column({
    comment: '가중치',
    type: DataType.NUMBER,
  })
  weight: number;

	@Column({
    comment: 'real-time 유무',
    type: DataType.BOOLEAN,
		allowNull: true,
    defaultValue: false,
  })
  work_fg: boolean;

	@Column({
    comment: 'Modbus function',
    type: DataType.STRING(100),
  })
  community_function: string;
	
	@Column({
    comment: 'Modbus slave',
    type: DataType.STRING(2),
  })
  slave: string;

	@Column({
    comment: '알림 유무',
    type: DataType.BOOLEAN,
		allowNull: true,
    defaultValue: false,
  })
	alarm_fg: boolean;

	@Column({
    comment: '부동소수점 유무',
    type: DataType.BOOLEAN,
		allowNull: true,
    defaultValue: false,
  })
	ieee752_fg: boolean;

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

  @Unique('std_data_map_tb_uuid_un')
  @Column({
    comment: '인터페이스 맵UUID',
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

	@BelongsTo(() => StdEquip, { foreignKey: 'equip_id', targetKey: 'equip_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEquip: StdEquip;
	@BelongsTo(() => StdDataGear, { foreignKey: 'data_gear_id', targetKey: 'data_gear_id', onDelete: 'restrict', onUpdate: 'cascade' })
  StdDataGear: StdDataGear;
	@BelongsTo(() => StdDataItem, { foreignKey: 'data_item_id', targetKey: 'data_item_id', onDelete: 'restrict', onUpdate: 'cascade' })
  StdDataItem: StdDataItem;

  // HasMany
  //#endregion
}