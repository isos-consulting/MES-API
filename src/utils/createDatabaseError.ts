import { TServiceResult } from './response_new';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { errorState } from '../states/common.state';

const createDatabaseError = (
  error: any,
  moduleName: string,
) => {
  const result: TServiceResult = {};

  // 📌 Unique Value Validation Error
  if (error instanceof UniqueConstraintError) {
    const parent: any = error.parent;
    if (parent.code === '23505') {
      result.result_info = { status: 500, message: parent.detail };
      result.log_info = { state_tag: moduleName, type: 'ERROR', state_no: errorState.VIOLATE_UNIQUE_CONSTRAINT };
      return result;
    }
  }

  // 📌 Foreign Key Value Validation Error
  if (error instanceof ForeignKeyConstraintError) {
    const parent: any = error.parent;
    if (parent.code === '23503') {
      result.result_info = { status: 500, message: parent.detail };
      result.log_info = { state_tag: moduleName, type: 'ERROR', state_no: errorState.VIOLATE_FOREIGN_KEY_CONSTRAINT };
      return result;
    }
  }

  return false;
};

export default createDatabaseError;