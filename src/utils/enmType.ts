'use strict';

/** Create Detail Attributes */
const DETAIL_TYPE = {
    ROUTING_WORKINGS: 'routing-workings',
    ROUTING_RESOURCE: 'routing-resource'
} as const
type DETAIL_TYPE = typeof DETAIL_TYPE[keyof typeof DETAIL_TYPE];

/** Request Type */
const REQ_TYPE = {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    PATCH: 'patch',
    DELETE: 'delete'
} as const
type REQ_TYPE = typeof REQ_TYPE[keyof typeof REQ_TYPE];

/** Login log type */
const LOGIN_LOG_TYPE = {
	LOGIN: '001',
	LOGOUT: '002',
	ID_FALSE: '900',
	PASSWORD_FALSE: '901'
} as const
type LOGIN_LOG_TYPE = typeof LOGIN_LOG_TYPE[keyof typeof LOGIN_LOG_TYPE];

export {DETAIL_TYPE, REQ_TYPE, LOGIN_LOG_TYPE};