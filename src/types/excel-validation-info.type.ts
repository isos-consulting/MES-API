import StdPartner from "../models/std/partner.model";
import StdPartnerRepo from "../repositories/std/partner.repository";
import fkInfos from "../types/fk-info.type";

const excelValidationInfos: any = {
  std_partner: {
    fkUuidInfos: [
      fkInfos.partner_type
    ],
    modelClass: StdPartner,
    repoClass: StdPartnerRepo
  }
}

export default excelValidationInfos;