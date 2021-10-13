import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmCompanyOpt from '../../models/adm/company-opt.model';
import sequelize from '../../models';
import { Sequelize } from 'sequelize';
import convertReadResult from '../../utils/convertReadResult';

class AdmCompanyOptRepo {
  repo: Repository<AdmCompanyOpt>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(AdmCompanyOpt);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🔵 Read Functions
  
  // 📒 Fn[read]: Default Read Function
  public read = async(params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { model: sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          'company_opt_cd',
          'company_opt_nm',
          'remark',
          'val',
          'val_opt',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        order: [ 'sortby' ],
      });

      return convertReadResult(result);
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default AdmCompanyOptRepo;