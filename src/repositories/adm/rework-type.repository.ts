import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmReworkType from '../../models/adm/rework-type.model';
import sequelize from '../../models';
import { Sequelize } from 'sequelize';
import convertReadResult from '../../utils/convertReadResult';

class AdmReworkTypeRepo {
  repo: Repository<AdmReworkType>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(AdmReworkType);
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
          'rework_type_cd',
          'rework_type_nm',
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

export default AdmReworkTypeRepo;