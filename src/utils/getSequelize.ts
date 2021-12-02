let sequelizes: any = {};

const getSequelize = (tenantUuid: string) => {
  return sequelizes[tenantUuid];
}

export { sequelizes, getSequelize }