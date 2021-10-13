'use strict'
import * as enmType from './enmType';

/** Routing Workings */
interface IWorkings {
  workings_id: number,
};

/** Routing Resource */
interface IResoruce {
  resource_type: string,
  equip_id: number,
  emp_cnt: number,
  cycle_time: number,
}

const createDetailContents = (obj: object, type: enmType.DETAIL_TYPE) => {
  let detailContents = '';

  switch (type) {
    case 'routing-workings':
      for (let workings of (obj as IWorkings[])) {  
        detailContents += workings.workings_id + 'Ш'; 
      }
      break;

    case 'routing-resource':
      for (let resource of (obj as IResoruce[])) {
        detailContents += resource.resource_type + '‡' + resource.equip_id + '‡' + resource.emp_cnt + '‡' + resource.cycle_time + 'Ш';
      }
      break;

    default:
      break;
  }

  return detailContents;
}

export default createDetailContents;