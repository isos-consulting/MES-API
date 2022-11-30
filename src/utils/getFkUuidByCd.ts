import ApiResult from "../interfaces/common/api-result.interface";
import checkArray from "./checkArray";

type getFkIdHelper = {
  info: getFkUuidInfo,
  set: Set<string>,
  read: ApiResult<any>,
  map: Map<string, number>
}

type getFkUuidInfo = {
  key: string,
  uuidName: string,
	cdName: string,
  cdAlias?: string,
  cdColumnName: string,
  TRepo: any,
}

/**
  * 🟣 Fk Table 의 cd 로 uuid 를 검색하여 request body 에 삽입
  * @param body Request Body
  */
const getFkUuidByCd = async(tenant: string, body: any, infos?: getFkUuidInfo[]) => {
  body = checkArray(body);
  if (!infos) { return body; }

  const helpers: Map<string, getFkIdHelper> = new Map<string, getFkIdHelper>();

  // 📌 fk cd => uuid 로 변환하기 위한 정보 초기값 Setting
  infos.forEach((info) => {
    helpers.set(info.key, {
      info: info,
      set: new Set<string>(),
      map: new Map<string, number>(),
      read: { count: 0, raws: [] }
    })
  })

  body.forEach((data: any) => {
    helpers.forEach((helper) => {
      if (data[helper.info.cdAlias ?? helper.info.cdName]) { helper.set.add(data[helper.info.cdAlias ?? helper.info.cdName]); }
    })
  })

  for await (const key of helpers.keys()) {
    const helper = helpers.get(key) as getFkIdHelper;
    const codeNames: string[] = [];

    // 📌 cd set 을 cd string[] 으로 변환
    helper.set.forEach((cd) => { codeNames.push(cd) } );

    // 📌 uuid 에 매칭되는 cd 조회 및 Map 에 Data Setting
    helper.read = await new helper.info.TRepo(tenant).readRawByUniques(codeNames);
    helper.read?.raws.forEach((raw: any) => { helper.map.set(raw[helper.info.cdName], raw['uuid']) });
  }

  // 📌 req.body cd 에 매칭 되는 uuid Setting
  body = body.map((data: any) => {
    helpers.forEach((helper) => {
      if (data[helper.info.cdAlias ?? helper.info.cdName]) { 
        data[helper.info.uuidName] = helper.map.get(data[helper.info.cdAlias ?? helper.info.cdName]);
        if (!helper.map.get(data[helper.info.cdAlias ?? helper.info.cdName])) {
          data.error.push(`${helper.info.cdColumnName} 잘못된 값입니다.`) 
        }
      }
    })

    return data;
  })

  return body;
}

export { getFkUuidInfo };
export default getFkUuidByCd;