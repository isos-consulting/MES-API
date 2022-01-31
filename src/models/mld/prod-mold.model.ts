import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IMldProdMold from '../../interfaces/mld/prod-mold.interface';
import AutUser from '../aut/user.model';
import StdFactory from '../std/factory.model';
import StdProd from '../std/prod.model';
import MldMold from './mold.model';

@Table({
  tableName: 'MLD_PROD_MOLD_TB',
  modelName: 'MldProdMold',
  comment: '품목별 금형정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class MldProdMold extends Model<IMldProdMold> {
  @Column({
    comment: '품목별 금형정보ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  proc_equip_id: number;

  @Unique('mld_prod_mold_tb_factory_id_prod_id_mold_id_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('mld_prod_mold_tb_factory_id_prod_id_mold_id_un')
  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @Unique('mld_prod_mold_tb_factory_id_prod_id_mold_id_un')
  @ForeignKey(() => MldMold)
  @Column({
    comment: '금형ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  mold_id: number;

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
    comment: '품목별 금형정보UUID',
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

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdFactory: StdFactory;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => MldMold, { foreignKey: 'mold_id', targetKey: 'mold_id', onDelete: 'restrict', onUpdate: 'cascade' })
  mldMold: MldMold;

  // HasMany
  //#endregion
}