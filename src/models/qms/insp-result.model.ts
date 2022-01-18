import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, BelongsTo, Unique, ForeignKey } from 'sequelize-typescript'
import IQmsInspResult from '../../interfaces/qms/insp-result.interface';
import AdmInspType from '../adm/insp-type.model';
import AdmInspDetailType from '../adm/insp-detail-type.model';
import AutUser from '../aut/user.model';
import MatReceiveDetail from '../mat/receive-detail.model';
import OutReceiveDetail from '../out/receive-detail.model';
import PrdWork from '../prd/work.model';
import StdEmp from '../std/emp.model';
import StdFactory from '../std/factory.model';
import StdLocation from '../std/location.model';
import StdProd from '../std/prod.model';
import StdStore from '../std/store.model';
import QmsInsp from './insp.model';
import AdmInspHandlingType from '../adm/insp-handling-type.model';
import StdReject from '../std/reject.model';

@Table({
  tableName: 'QMS_INSP_RESULT_TB',
  modelName: 'QmsInspResult',
  comment: '검사 결과 정보 테이블',
  timestamps: true,
  underscored: true,
})
export default class QmsInspResult extends Model<IQmsInspResult> {
  @Column({
    comment: '검사 결과ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_result_id: number;

  @Unique('qms_insp_result_tb_factory_id_insp_type_cd_insp_detail_type_cd_insp_reference_id_seq_un')
  @ForeignKey(() => StdFactory)
  @Column({
    comment: '공장ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  factory_id: number;

  @Unique('qms_insp_result_tb_factory_id_insp_type_cd_insp_detail_type_cd_insp_reference_id_seq_un')
  @Column({
    comment: '검사유형 코드',
    type: DataType.STRING(20),
    allowNull: false,
  })
  insp_type_cd: string;

  @Unique('qms_insp_result_tb_factory_id_insp_type_cd_insp_detail_type_cd_insp_reference_id_seq_un')
  @Column({
    comment: '세부검사유형 코드',
    type: DataType.STRING(20),
  })
  insp_detail_type_cd: string;

  @Column({
    comment: '검사처리유형 코드',
    type: DataType.STRING(20),
  })
  insp_handling_type_cd: string;

  @Unique('qms_insp_result_tb_factory_id_insp_type_cd_insp_detail_type_cd_insp_reference_id_seq_un')
  @Column({
    comment: '검사 관련 정보ID (수입검사: 입하ID, 공정검사: 실적ID 등)',
    type: DataType.INTEGER,
  })
  insp_reference_id: number;

  @Unique('qms_insp_result_tb_factory_id_insp_type_cd_insp_detail_type_cd_insp_reference_id_seq_un')
  @Column({
    comment: '검사 차수',
    type: DataType.INTEGER,
    allowNull: false,
  })
  seq: number;

  @ForeignKey(() => QmsInsp)
  @Column({
    comment: '검사 기준서ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  insp_id: number;

  @ForeignKey(() => StdProd)
  @Column({
    comment: '품목ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  prod_id: number;

  @Column({
    comment: 'LOT NO',
    type: DataType.STRING(25),
  })
  lot_no: string;

  @ForeignKey(() => StdEmp)
  @Column({
    comment: '검사자 사원ID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  emp_id: number;

  @Column({
    comment: '검사 결과 등록 일시',
    type: 'timestamp',
    allowNull: false,
  })
  reg_date: string;

  @Column({
    comment: '검사 결과 합격 여부',
    type: DataType.BOOLEAN,
  })
  insp_result_fg: boolean;

  @Column({
    comment: '검사 수량',
    type: DataType.DECIMAL(19, 6),
  })
  insp_qty: number;

  @Column({
    comment: '합격 수량',
    type: DataType.DECIMAL(19, 6),
  })
  pass_qty: number;

  @Column({
    comment: '불합격 수량',
    type: DataType.DECIMAL(19, 6),
  })
  reject_qty: number;

  @ForeignKey(() => StdReject)
  @Column({
    comment: '부적합ID',
    type: DataType.INTEGER,
  })
  reject_id: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '출고 창고ID',
    type: DataType.INTEGER,
  })
  from_store_id: number;

  @ForeignKey(() => StdLocation)
  @Column({
    comment: '출고 위치ID',
    type: DataType.INTEGER,
  })
  from_location_id: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '입고 창고ID',
    type: DataType.INTEGER,
  })
  to_store_id: number;

  @ForeignKey(() => StdLocation)
  @Column({
    comment: '입고 위치ID',
    type: DataType.INTEGER,
  })
  to_location_id: number;

  @ForeignKey(() => StdStore)
  @Column({
    comment: '부적합 입고 창고ID',
    type: DataType.INTEGER,
  })
  reject_store_id: number;

  @ForeignKey(() => StdLocation)
  @Column({
    comment: '부적합 입고 위치ID',
    type: DataType.INTEGER,
  })
  reject_location_id: number;

  @Column({
    comment: '비고',
    type: DataType.STRING(250),
  })
  remark: string;

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

  @Unique('qms_insp_result_tb_uuid_un')
  @Column({
    comment: '검사 결과UUID',
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

  @BelongsTo(() => AdmInspType, { foreignKey: 'insp_type_cd', targetKey: 'insp_type_cd', constraints: false })
  admInspType: AdmInspType;

  @BelongsTo(() => AdmInspDetailType, { foreignKey: 'insp_detail_type_cd', targetKey: 'insp_detail_type_cd', constraints: false })
  admInspDetailType: AdmInspDetailType;

  @BelongsTo(() => AdmInspHandlingType, { foreignKey: 'insp_handling_type_cd', targetKey: 'insp_handling_type_cd', constraints: false })
  admInspHandlingType: AdmInspHandlingType;

  @BelongsTo(() => MatReceiveDetail, { foreignKey: 'insp_reference_id', targetKey: 'receive_detail_id', constraints: false })
  matReceiveDetail: MatReceiveDetail;

  @BelongsTo(() => OutReceiveDetail, { foreignKey: 'insp_reference_id', targetKey: 'receive_detail_id', constraints: false })
  outReceiveDetail: OutReceiveDetail;

  @BelongsTo(() => PrdWork, { foreignKey: 'insp_reference_id', targetKey: 'work_id', constraints: false })
  prdWork: PrdWork;

  @BelongsTo(() => QmsInsp, { foreignKey: 'insp_id', targetKey: 'insp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  qmsInsp: QmsInsp;

  @BelongsTo(() => StdProd, { foreignKey: 'prod_id', targetKey: 'prod_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdProd: StdProd;

  @BelongsTo(() => StdEmp, { foreignKey: 'emp_id', targetKey: 'emp_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdEmp: StdEmp;

  @BelongsTo(() => StdReject, { foreignKey: 'reject_id', targetKey: 'reject_id', onDelete: 'restrict', onUpdate: 'cascade' })
  stdReject: StdReject;

  @BelongsTo(() => StdStore, { as: 'fromStore', foreignKey: 'from_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  fromStdStore: StdStore;
  @BelongsTo(() => StdLocation, { as: 'fromLocation', foreignKey: 'from_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  fromStdLocation: StdLocation;

  @BelongsTo(() => StdStore, { as: 'toStore', foreignKey: 'to_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  toStdStore: StdStore
  @BelongsTo(() => StdLocation, { as: 'toLocation', foreignKey: 'to_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  toStdLocation: StdLocation;

  @BelongsTo(() => StdStore, { as: 'rejectStore', foreignKey: 'reject_store_id', targetKey: 'store_id', onDelete: 'restrict', onUpdate: 'cascade' })
  rejectStdStore: StdStore
  @BelongsTo(() => StdLocation, { as: 'rejectLocation', foreignKey: 'reject_location_id', targetKey: 'location_id', onDelete: 'restrict', onUpdate: 'cascade' })
  rejectStdLocation: StdLocation;

  // HasMany
  //#endregion
}