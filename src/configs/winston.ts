import * as fs from 'fs'
import * as winston from 'winston'
import * as winstonDailyRotateFile from 'winston-daily-rotate-file'

winstonDailyRotateFile
const logDir = __dirname + '/../logs'

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const options = (level: string) => ({
  name: `${level}-log`,
  filename: `${level}.%DATE%.log`,
  // filename: `${APP_NAME}.${level}.%DATE%.log`,
  dirname: `${logDir}/${level}`,
  datePattern: level == 'error' ? 'YYYY-MM-DD-HHmmss-SSS' : 'YYYY-MM-DD',
  maxFiles: level == 'error' ? undefined : '30d',
  // auditFile: `${CONFIG.logDir}/${APP_NAME}.${level}-audit.json`,
  level,
})

const infoTransport = new winston.transports.DailyRotateFile(options('info'));
const errorTransport = new winston.transports.DailyRotateFile(options('error'));

const logger = winston.createLogger({
  transports: [infoTransport, errorTransport]
})

const stream = {
  write: (message: string) => {
    logger.info(message)
  }
}

export { logger, stream }