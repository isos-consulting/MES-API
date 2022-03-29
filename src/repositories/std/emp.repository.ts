import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import StdEmp from '../../models/std/emp.model';
import IStdEmp from '../../interfaces/std/emp.interface';
import { Sequelize } from 'sequelize-typescript';
import _ from 'lodash';
import convertResult from '../../utils/convertResult';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { UniqueConstraintError } from 'sequelize';
import getPreviousRaws from '../../utils/getPreviousRaws';
import AdmLogRepo from '../adm/log.repository';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';
import ApiResult from '../../interfaces/common/api-result.interface';

class StdEmpRepo {
  repo: Repository<StdEmp>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(StdEmp);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🟢 Create Functions

  // 📒 Fn[create]: Default Create Function
  public create = async(body: IStdEmp[], uid: number, transaction?: Transaction) => {
    try {
      const promises = body.map((emp: any) => {
        return this.repo.create(
          {
            emp_cd: emp.emp_cd,
            emp_nm: emp.emp_nm,
            uid: emp.uid,
            dept_id: emp.dept_id,
            grade_id: emp.grade_id,
            birthday: emp.birthday,
            hp: emp.hp,
            post: emp.post,
            addr: emp.addr,
            addr_detail: emp.addr_detail,
            enter_date: emp.enter_date,
            leave_date: emp.leave_date,
            worker_fg: emp.worker_fg,
            remark: emp.remark,
            created_uid: uid,
            updated_uid: uid,
          },
          { hooks: true, transaction }
        );
      });
      const raws = await Promise.all(promises);
      
			return { raws, count: raws.length } as ApiResult<any>;
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };
  
  //#endregion

  //#region 🔵 Read Functions
  
  // 📒 Fn[read]: Default Read Function
  public read = async(params?: any) => {
    try {
      let whereOptions: WhereOptions<StdEmp> = {};

      // 재직 여부를 [전체, 재직자만, 퇴직자만] 으로 Filetering 
      // params.emp_status 재직여부 Type 변수 [all: 전체 조회], [incumbent: 재직자 조회], [retiree: 퇴직자 조회]
      // params.emp_status == all : where 문 만들지 않음
      // params.emp_status == incumbent : leave_date IS NULL
      // params.emp_status == retiree : leave_date IS NOT NULL

      switch (params.emp_status) {
        case 'all':
          whereOptions = { worker_fg: params.worker_fg ? params.worker_fg : { [Op.ne] : null } }
          break;
        
        case 'incumbent':
          whereOptions = { [Op.and] : { 
                          worker_fg: params.worker_fg ? params.worker_fg : { [Op.ne] : null }, 
                          leave_date: { [Op.eq]: null } as any 
                        }}
          break;
        
        case 'retiree':
          whereOptions = { [Op.and] : {
                          worker_fg: params.worker_fg ? params.worker_fg : { [Op.ne] : null }, 
                          leave_date: { [Op.ne]: null } 
                        }}
          break;

        default:
          break;
      }

      const result = await this.repo.findAll({ 
        include: [
          { model: this.sequelize.models.StdDept, attributes: [], required: false },
          { model: this.sequelize.models.StdGrade, attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'autUser', attributes: [], required: false },
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
          'emp_cd',
          'emp_nm',
          [ Sequelize.col('autUser.uuid'), 'user_uuid' ],
          [ Sequelize.col('autUser.id'), 'id' ],
          [ Sequelize.col('stdDept.uuid'), 'dept_uuid' ],
          [ Sequelize.col('stdDept.dept_cd'), 'dept_cd' ],
          [ Sequelize.col('stdDept.dept_nm'), 'dept_nm' ],
          [ Sequelize.col('stdGrade.uuid'), 'grade_uuid' ],
          [ Sequelize.col('stdGrade.grade_cd'), 'grade_cd' ],
          [ Sequelize.col('stdGrade.grade_nm'), 'grade_nm' ],
          'birthday',
          'addr',
          'addr_detail',
          'post',
          'hp',
          'enter_date',
          'leave_date',
          'worker_fg',
          'remark',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: whereOptions,
        order: [ 'emp_id' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readByUuid]: Default Read With Uuid Function
  public readByUuid = async(uuid: string, params?: any) => {
    try {
      const result = await this.repo.findOne(
        { 
          include: [
            { model: this.sequelize.models.StdDept, attributes: [], required: false },
            { model: this.sequelize.models.StdGrade, attributes: [], required: false },
            { model: this.sequelize.models.AutUser, as: 'autUser', attributes: [], required: false },
            { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
            { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
          ],
          attributes: [
            [ Sequelize.col('stdEmp.uuid'), 'emp_uuid' ],
            'emp_cd',
            'emp_nm',
            [ Sequelize.col('autUser.uuid'), 'user_uuid' ],
            [ Sequelize.col('autUser.id'), 'id' ],
            [ Sequelize.col('stdDept.uuid'), 'dept_uuid' ],
            [ Sequelize.col('stdDept.dept_cd'), 'dept_cd' ],
            [ Sequelize.col('stdDept.dept_nm'), 'dept_nm' ],
            [ Sequelize.col('stdGrade.uuid'), 'grade_uuid' ],
            [ Sequelize.col('stdGrade.grade_cd'), 'grade_cd' ],
            [ Sequelize.col('stdGrade.grade_nm'), 'grade_nm' ],
            'birthday',
            'addr',
            'addr_detail',
            'post',
            'hp',
            'enter_date',
            'leave_date',
            'worker_fg',
            'remark',
            'created_at',
            [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
            'updated_at',
            [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
          ],
          where: { uuid },
        });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  // 📒 Fn[readRawsByUuids]: Id 를 포함한 Raw Datas Read Function
  public readRawsByUuids = async(uuids: string[]) => {
    const result = await this.repo.findAll({ where: { uuid: { [Op.in]: uuids } } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByUuid]: Id 를 포함한 Raw Data Read Function
  public readRawByUuid = async(uuid: string) => {
    const result = await this.repo.findOne({ where: { uuid } });
    return convertReadResult(result);
  };

  // 📒 Fn[readRawByUnique]: Unique Key를 통하여 Raw Data Read Function
  public readRawByUnique = async(params: { emp_cd: string }) => {
    const result = await this.repo.findOne({ where: { emp_cd: params.emp_cd } });
    return convertReadResult(result);
  };

  //#endregion

  //#region 🟡 Update Functions
  
  // 📒 Fn[update]: Default Update Function
  public update = async(body: IStdEmp[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((emp: any) => {
        return this.repo.update(
          {
            emp_cd: emp.emp_cd ?? null,
            emp_nm: emp.emp_nm ?? null,
            uid: emp.uid ?? null,
            dept_id: emp.dept_id ?? null,
            grade_id: emp.grade_id ?? null,
            birthday: emp.birthday ?? null,
            hp: emp.hp ?? null,
            post: emp.post ?? null,
            addr: emp.addr ?? null,
            addr_detail: emp.addr_detail ?? null,
            enter_date: emp.enter_date ?? null,
            leave_date: emp.leave_date ?? null,
            worker_fg: emp.worker_fg ?? null,
            remark: emp.remark ?? null,
            updated_uid: uid,
          } as any,
          { 
            where: { uuid: emp.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdEmp.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🟠 Patch Functions
  
  // 📒 Fn[patch]: Default Patch Function
  public patch = async(body: IStdEmp[], uid: number, transaction?: Transaction) => {
    try {
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((emp: any) => {
        return this.repo.update(
          {
            emp_cd: emp.emp_cd,
            emp_nm: emp.emp_nm,
            uid: emp.uid,
            dept_id: emp.dept_id,
            grade_id: emp.grade_id,
            birthday: emp.birthday,
            hp: emp.hp,
            post: emp.post,
            addr: emp.addr,
            addr_detail: emp.addr_detail,
            enter_date: emp.enter_date,
            leave_date: emp.leave_date,
            worker_fg: emp.worker_fg,
            remark: emp.remark,
            updated_uid: uid,
          },
          { 
            where: { uuid: emp.uuid },
            returning: true,
            individualHooks: true,
            transaction
          }
        );
      });
      const raws = await Promise.all(promises);

      await new AdmLogRepo(this.tenant).create('update', this.sequelize.models.StdEmp.getTableName() as string, previousRaws, uid, transaction);
      return convertResult(raws);
    } catch (error) {
      if (error instanceof UniqueConstraintError) { throw new Error((error.parent as any).detail); }
      throw error;
    }
  };

  //#endregion

  //#region 🔴 Delete Functions
  
  // 📒 Fn[delete]: Default Delete Function
  public delete = async(body: IStdEmp[], uid: number, transaction?: Transaction) => {
    try {      
      const previousRaws = await getPreviousRaws(body, this.repo);

      const promises = body.map((emp: any) => {
        return this.repo.destroy({ where: { uuid: emp.uuid }, transaction});
      });
      const count = _.sum(await Promise.all(promises));

      await new AdmLogRepo(this.tenant).create('delete', this.sequelize.models.StdEmp.getTableName() as string, previousRaws, uid, transaction);
      return { count, raws: previousRaws };
    } catch (error) {
      throw error;
    }
  };
    
  //#endregion

  //#endregion
}

export default StdEmpRepo;