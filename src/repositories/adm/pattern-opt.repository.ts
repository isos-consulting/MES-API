import { Repository } from 'sequelize-typescript/dist/sequelize/repository/repository';
import AdmPatternOpt from '../../models/adm/pattern-opt.model';
import { Sequelize } from 'sequelize-typescript';
import convertReadResult from '../../utils/convertReadResult';
import { getSequelize } from '../../utils/getSequelize';

class AdmPatternOptRepo {
  repo: Repository<AdmPatternOpt>;
  sequelize: Sequelize;
  tenant: string;

  //#region ✅ Constructor
  constructor(tenant: string) {
    this.tenant = tenant;
    this.sequelize = getSequelize(tenant);
    this.repo = this.sequelize.getRepository(AdmPatternOpt);
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
          'pattern_opt_cd',
          'pattern_opt_nm',
          'table_nm',
          'auto_fg',
          'col_nm',
          'pattern',
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
  
  // 📒 Fn[readPattern]: Default Read Function
  public readPattern = async(params?: any) => {
    try {
      const result = await this.repo.findOne({ 
        attributes: [ 'pattern' ],
        where: {
          table_nm: params.table_nm,
          col_nm: params.col_nm,
          auto_fg: '1',
        }
      });

      const converted = convertReadResult(result);

      if (converted.raws.length == 0) { return null; }
      return converted.raws[0].pattern as string;
    } catch (error) {
      throw error;
    }
  };

  //#endregion

  //#endregion
}

export default AdmPatternOptRepo;