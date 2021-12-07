import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmPrdPlanType from '../../models/adm/prd-plan-type.model';
import { Sequelize } from 'sequelize-typescript';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class AdmPrdPlanTypeRepo {
  repo: Repository<AdmPrdPlanType>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmPrdPlanType);
  }
  //#endregion

  //#region ✅ CRUD Functions

  //#region 🔵 Read Functions
  
  // 📒 Fn[read]: Default Read Function
  public read = async(params?: any) => {
    try {
      const result = await this.repo.findAll({ 
        include: [
          { model: this.sequelize.models.AutUser, as: 'createUser', attributes: [], required: true },
          { model: this.sequelize.models.AutUser, as: 'updateUser', attributes: [], required: true },
        ],
        attributes: [
          'prd_plan_type_cd',
          'prd_plan_type_nm',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: params.prd_plan_type_cd ? { prd_plan_type_cd: params.prd_plan_type_cd } : {},
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

export default AdmPrdPlanTypeRepo;