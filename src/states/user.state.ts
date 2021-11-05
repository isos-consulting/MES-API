type TUserSuccessState = { 
  SIGNIN: '5000',
  CHANGE_PASSWORD_FLAG: '5001',
  CHANGE_PASSWORD: '5002',
  PUBLISH_TOKEN: '5003',
}
const userSuccessState: TUserSuccessState = { 
  SIGNIN: '5000',
  CHANGE_PASSWORD_FLAG: '5001',
  CHANGE_PASSWORD: '5002',
  PUBLISH_TOKEN: '5003',
}

type TUserErrorState = { 
  INVALID_ID: '5000',
  INVALID_PASSWORD: '5001',
  INVALID_ENVIRONMENT: '5003',
}
const userErrorState: TUserErrorState = { 
  INVALID_ID: '5000',
  INVALID_PASSWORD: '5001',
  INVALID_ENVIRONMENT: '5003',
}

export { userSuccessState, userErrorState };