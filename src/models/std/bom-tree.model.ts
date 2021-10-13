import { Table, Column, Model, DataType, BelongsTo } from 'sequelize-typescript'
import IStdBomTree from '../../interfaces/std/bom-tree.interface';
import StdBom from './bom.model';
import StdFactory from './factory.model';
import StdProd from './prod.model';

@Table({
  tableName: 'STD_BOM_TREE_VW',
  modelName: 'StdBomTree',
  comment: 'BOM(트리)정보 뷰',
  underscored: true
})
export default class StdBomTree extends Model<IStdBomTree> {
  @Column({
    comment: 'BOM ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  bom_id: number;

  @Column({
    comment: 'BOM Level',
    type: DataType.INTEGER,
    allowNull: false,
  })
  lv: number;

  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Column({
    comment: '완제품 품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  main_prod_id: number;

  @Column({
    comment: '부모 품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  p_prod_id: number;

  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @Column({
    comment: '소요량',
    type: DataType.INTEGER,
    allowNull: false,
  })
  c_usage: number;

  @Column({
    comment: '완제품 기준 소요량',
    type: DataType.INTEGER,
    allowNull: false,
  })
  t_usage: number;

  @Column({
    comment: '정렬',
    type: DataType.INTEGER,
    allowNull: false,
  })
  sortby: number;

  //#region ✅ Define Association
  // BelongsTo
  @BelongsTo(() => StdBom, { foreignKey: 'bom_id', targetKey: 'bom_id', constraints: false })
  stdBom: StdBom;

  @BelongsTo(() => StdFactory, { foreignKey: 'factory_id', targetKey: 'factory_id', constraints: false })
  stdFactory: StdFactory;

  @BelongsTo(() => StdProd, { as: 'mainProd', foreignKey: 'main_prod_id', targetKey: 'prod_id', constraints: false })
  mainProd: StdProd;

  @BelongsTo(() => StdProd, { as: 'parentProd', foreignKey: 'p_prod_id', targetKey: 'prod_id', constraints: false })
  parentProd: StdProd;

  @BelongsTo(() => StdProd, { as: 'stdProd', foreignKey: 'prod_id', targetKey: 'prod_id', constraints: false })
  stdProd: StdProd;
  //#endregion
}