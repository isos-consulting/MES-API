import * as fs from 'fs'
import * as path from 'path'
import * as express from 'express'

const router: express.Router = express.Router();
const index: string = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(file => (file.split('.').length !== 0) && (file !== index) && (file.slice(-9) === '.route.js'))
  .forEach(routeFile => {router.use(`/${routeFile.split('.')[0]}`, require(`./${routeFile}`).default)});

export default router;