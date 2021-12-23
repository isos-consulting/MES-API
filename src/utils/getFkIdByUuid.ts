import ApiResult from "../interfaces/common/api-result.interface";
import checkArray from "./checkArray";

type getFkIdHelper = {
  info: getFkIdInfo,
  set: Set<string>,
  read: ApiResult<any>,
  map: Map<string, number>
}

type getFkIdInfo = {
  key: string,
  uuidName: string,
  idName: string,
  idAlias?: string,
  TRepo: any,
}

/**
  * 🟣 CUD 연산이 실행되기 전 Fk Table 의 uuid 로 id 를 검색하여 request body 에 삽입
  * @param body Request Body
  */
const getFkIdByUuid = async(tenant: string, body: any, info?: getFkIdInfo[]) => {
  body = checkArray(body);
  if (!info) { return body; }

  const helpers: Map<string, getFkIdHelper> = new Map<string, getFkIdHelper>();

  // 📌 fk uuid => id 로 변환하기 위한 정보 초기값 Setting
  info.forEach((info) => {
    helpers.set(info.key, {
      info: info,
      set: new Set<string>(),
      map: new Map<string, number>(),
      read: { count: 0, raws: [] }
    })
  })

  // 📌 정보에 Setting 된 uuidName 기준으로 Set 을 이용하여 중복제거
  body.forEach((data: any) => {
    helpers.forEach((helper) => {
      if (data[helper.info.uuidName]) { helper.set.add(data[helper.info.uuidName]); }
    })
  })

  for await (const key of helpers.keys()) {
    const helper = helpers.get(key) as getFkIdHelper;
    const uuids: string[] = [];

    // 📌 uuid set 을 uuid string[] 으로 변환
    helper.set.forEach((uuid) => { uuids.push(uuid) } );

    // 📌 uuid 에 매칭되는 id 조회 및 Map 에 Data Setting
    helper.read = await new helper.info.TRepo(tenant).readRawsByUuids(uuids);
    helper.read?.raws.forEach((raw: any) => { helper.map.set(raw['uuid'], raw[helper.info.idName]) });
  }

  // 📌 req.body uuid 에 매칭 되는 id Setting
  body = body.map((data: any) => {
    helpers.forEach((helper) => {
      if (data[helper.info.uuidName]) { data[helper.info.idAlias ? helper.info.idAlias : helper.info.idName] = helper.map.get(data[helper.info.uuidName]) }
    })

    return data;
  })

  return body;
}

export { getFkIdInfo };
export default getFkIdByUuid;