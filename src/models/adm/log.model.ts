import { Table, Column, Model, DataType } from 'sequelize-typescript'
import { Sequelize } from 'sequelize';
import IAdmLog from '../../interfaces/adm/log.interface';

@Table({
  tableName: 'ADM_LOG_TB',
  modelName: 'AdmLog',
  comment: 'DB 수정 삭제 Log 테이블',
  underscored: true,
  timestamps: false
})
export default class AdmLog extends Model<IAdmLog> {
  @Column({
    comment: '로그ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  log_id: number;
  
  @Column({
    comment: '테이블명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  table_nm: string;

  @Column({
    comment: '로그 생성 일시',
    type: DataType.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('now')
  })
  logged_at: Date;
  
  @Column({
    comment: '로그 생성자 UID',
    type: DataType.INTEGER,
    allowNull: false,
  })
  logged_uid: number;

  @Column({
    comment: 'JSON 형태의 로그 값',
    type: DataType.JSON,
    allowNull: false,
  })
  tran_values: object;

  @Column({
    comment: '로그 타입 구분(True: UPDATE, False: DELETE)',
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  tran_fg: boolean;

  //#region ✅ Define Association

  //#endregion

  //#region hooks

  //#endregion
}