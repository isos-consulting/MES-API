import * as httpStatus from 'http-status';
import * as express from 'express';

type TResultInfo = {
  raws?: any[],
  value?: any,
  message?: string,
  status?: number
};

type TLogInfo = {
  state_tag: string,
  state_no: string,
  type: 'SUCCESS' | 'ERROR'
};

type TResponse = {
  success: boolean,
  state_cd: string,
  state?: TLogInfo,
  message: string,
  datas: { value: any, raws: any[] }
}

const response = (
  res: express.Response, 
  resultInfo: TResultInfo = { raws: [], value: {}, message: '', status: httpStatus.OK }, 
  logInfo?: TLogInfo
) => {
  let stateCd: string = '';
  if (logInfo) {
    const typeStr = logInfo.type === 'SUCCESS' ? 'S' : 'E';
    stateCd = `${logInfo.state_tag}-${typeStr}-${logInfo.state_no}`;
  }

  let result: TResponse = { 
    success: Number(resultInfo.status) < 400 ? true : false, 
    state_cd: stateCd,
    state: logInfo,
    message: resultInfo.message ?? '', 
    datas: { 
      value: resultInfo.value ? {...resultInfo.value} : {}, 
      raws: resultInfo.raws ? [...resultInfo.raws] : []
    }
  };

  // new AppLogRepo().create({
  //   tenant_uuid: res.req?.header('tenant_uuid') as string,
  //   menu_nm: res.req?.header('menu_nm') as string,
  //   state_tag: logInfo?.state_tag as string,
  //   state_no: logInfo?.state_no as string,
  //   error_fg: logInfo?.type === 'SUCCESS' ? false : true,
  //   status: resultInfo.status as number,
  //   message: resultInfo.message ?? '',
  //   method: res.req?.method as string,
  //   api: res.req?.url as string,
  //   ip_address: res.req?.ip as string,
  //   browser: res.req?.header('user-agent') ?? 'unknown'
  // }, res.req?.user?.uid as number)
  // .catch((error) => { console.log('App Log 생성 실패') });

  return res.status(resultInfo.status ?? httpStatus.OK).json(result);
};

export { TResultInfo, TLogInfo }
export default response;