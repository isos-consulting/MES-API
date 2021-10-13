import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmInspDetailType from '../../models/adm/insp-detail-type.model';
import sequelize from '../../models';
import { Sequelize, Op } from 'sequelize';
import convertReadResult from '../../utils/convertReadResult';

class AdmInspDetailTypeRepo {
  repo: Repository<AdmInspDetailType>;

  //#region ✅ Constructor
  constructor() {
    this.repo = sequelize.getRepository(AdmInspDetailType);
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
          'insp_detail_type_cd',
          'insp_detail_type_nm',
          'insp_type_cd',
          'worker_fg',
          'inspector_fg',
          'created_at',
          [ Sequelize.col('createUser.user_nm'), 'created_nm' ],
          'updated_at',
          [ Sequelize.col('updateUser.user_nm'), 'updated_nm' ]
        ],
        where: { 
          [Op.and]: [
            { insp_type_cd: params.insp_type_cd ? params.insp_type_cd : { [Op.ne]: null }},
            { insp_detail_type_cd: params.insp_detail_type_cd ? params.insp_detail_type_cd : { [Op.ne]: null }}
          ]
        },
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

export default AdmInspDetailTypeRepo;