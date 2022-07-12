import { Transaction } from "sequelize/types";
import AutUserRepo from "../../repositories/aut/user.repository";
import AutGroupRepo from "../../repositories/aut/group.repository";
import getFkIdByUuid, { getFkIdInfo } from "../../utils/getFkIdByUuid";
import encrypt from '../../utils/encrypt';
import decrypt from '../../utils/decrypt';
import config from '../../configs/config';
import * as bcrypt from 'bcrypt'
import passwordValidation from '../../utils/passwordValidation';
import createApiError from '../../utils/createApiError';
import { errorState } from '../../states/common.state';

// Controller에서 해야하는 일은 Data를 정제하는 일을 한다.
// Service는 정제된 Data를 받아 일정하게 비즈니스로직을 처리하는 일을 한다.

class AutUserService {
  tenant: string;
  stateTag: string;
  repo: AutUserRepo;
  fkIdInfos: getFkIdInfo[];

  constructor(tenant: string) {
    this.tenant = tenant;
    this.stateTag = 'autUser';
    this.repo = new AutUserRepo(tenant);

    this.fkIdInfos = [
      {
        key: 'group',
        TRepo: AutGroupRepo,
        idName: 'group_id',
        uuidName: 'group_uuid'
      }
    ];
  }

  public convertFk = async (datas: any) => {
    // ✅ CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입하기 위하여 정보 Setting
    return await getFkIdByUuid(this.tenant, datas, this.fkIdInfos);
  }

  public create = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.create(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public read = async (params: any) => {
    try { return await this.repo.read(params); } 
		catch (error) { throw error; }
  };
  
  public readByUuid = async (uuid: string) => {
    try { return await this.repo.readByUuid(uuid); } 
		catch (error) { throw error; }
  };

  public update = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.update(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public patch = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.patch(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public delete = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.delete(datas, uid, tran); } 
		catch (error) { throw error; }
  }

	public updatePwd = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.updatePwd(datas, uid, tran); } 
		catch (error) { throw error; }
  }

  public initPwd = async (datas: any[], uid: number, tran: Transaction) => {
    try { return await this.repo.initPwd(datas, uid, tran); }
    catch (error) { throw error; }
  }

	public readById = async (datas: any) => {
    try { return await this.repo.readById(datas); } 
		catch (error) { throw error; }
  }

  public createHashPassword = async (users: any[], Password: string) => {
    const salt = await bcrypt.genSalt(10);

		const encryptPassword =  encrypt(Password, config.crypto.secret);

    const convertedPwd = decrypt(encryptPassword, config.crypto.secret);

		const hashPassword =await bcrypt.hash(convertedPwd, salt);
		
		users.map(async (user:any) => {
			user.pwd = hashPassword,
			user.pwd_fg = true
		});
		
    return users;
  };

	public updateHashPassword = async (users: any) => {
    const salt = await bcrypt.genSalt(10);

    const convertedPwd = decrypt(users.pwd, config.crypto.secret);
		// const convertedPwd = users.pwd;
		if (!await passwordValidation(convertedPwd)) {
			throw createApiError(
        400, 
        {
          admin_message: `비빌번호가 잘못되었습니다.`,
          user_message: `비빌번호가 잘못되었습니다.`
        }, 
        this.stateTag, 
        errorState.FAILED_SAVE_TO_RELATED_DATA
      );
		};

		const hashPassword =await bcrypt.hash(convertedPwd, salt);

		users.pwd = hashPassword,
		users.pwd_fg = false
		
    return users;
  };

}

export default AutUserService;
