import { Sequelize, Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, Unique, BeforeSave } from 'sequelize-typescript'
import IAutUser from '../../interfaces/aut/user.interface';
import AutGroup from './group.model';
import encrypt from '../../utils/encrypt';
import decrypt from '../../utils/decrypt';
import config from '../../configs/config';
import * as bcrypt from 'bcrypt'

@Table({
  tableName: 'AUT_USER_TB',
  modelName: 'AutUser',
  comment: '사용자 정보 테이블',
  timestamps: true,
  underscored: true, 
})
export default class AutUser extends Model<IAutUser> {
  @Column({
    comment: '사용자ID',
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    type: DataType.INTEGER,
    allowNull: false,
  })
  uid: number;

  @Unique('aut_user_tb_id_un')
  @Column({
    comment: '사용자 로그인ID',
    type: DataType.STRING(20),
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => AutGroup)
  @Column({
    comment: '권한그룹ID',
    type: DataType.INTEGER,
  })
  group_id: number;

  @Column({
    comment: '성명',
    type: DataType.STRING(50),
    allowNull: false,
  })
  user_nm: string;

  @Column({
    comment: '비밀번호',
    type: DataType.STRING(100),
  })
  pwd: string;

  @Unique('aut_user_tb_email_un')
  @Column({
    comment: '이메일',
    type: DataType.STRING(50),
  })
  email: string;

  @Column({
    comment: '패스워드 변경여부(0: 없음, 1: 변경)',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  pwd_fg: boolean;

  @Column({
    comment: '관리자 유무(0: 일반, 1: 관리자)',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  admin_fg: boolean;

  @Column({
    comment: 'ISOS 관리자 유무(0: 일반, 1: 관리자)',
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  super_admin_fg: boolean;

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
  
  @Unique('aut_user_tb_uuid_un')
  @Column({
    comment: '사용자UUID',
    type: DataType.UUID,
    allowNull: false,
    defaultValue: Sequelize.fn('gen_random_uuid')
  })
  uuid: string

  //#region ✅ Define Association
  // BelongsTo
  @BelongsTo(() => AutUser, { as: 'createUser', foreignKey: 'created_uid', targetKey: 'uid', constraints: false })
  createUser: AutUser;
  @BelongsTo(() => AutUser, { as: 'updateUser', foreignKey: 'updated_uid', targetKey: 'uid', constraints: false })
  updateUser: AutUser;

  @BelongsTo(() => AutGroup, { foreignKey: 'group_id', targetKey: 'group_id', onDelete: 'restrict', onUpdate: 'cascade' })
  autGroup: AutGroup;
  //#endregion

  //#region hooks
  @BeforeSave
  static hashPassword = async (user: AutUser) => {
    const salt = await bcrypt.genSalt(10);

    // 개발환경일 경우 postman 에서 비밀번호를 입력하기 위하여 입력된 Password 암호화 진행
    if (config.node_env === 'development' || 'test') {
      user.pwd = encrypt(user.pwd, config.crypto.secret);
    }

    const convertedPwd = decrypt(user.pwd, config.crypto.secret);
    // 💥 Postgresql과 Node Express의 Bcrypt 암호화 호환이 안되서 잠시 봉인
    user.pwd = await bcrypt.hash(convertedPwd, salt);

    // const bcryptRead = await sequelizeToQuerying.query(`SELECT crypt('${convertedPwd}', gen_salt('bf', 10)) as encrypted_pwd`);
    // user.pwd = convertReadResult(bcryptRead[0]).raws[0].encrypted_pwd;
  };
  //#endregion

  toWeb(): AutUser {
    const values = Object.assign({}, this.get())

    delete values.id
    delete values.pwd

    return values as AutUser;
  };
}