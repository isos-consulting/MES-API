import { Sequelize, Options } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config();

class options implements Options{
  dialect!: 'mysql';
  username!: string;
  password!: string;
}        

const createDBOptions = new options();
createDBOptions.username = 'root';
createDBOptions.password = 'your password';
createDBOptions.dialect = 'mysql';

let db_name = 'new DataBase';

const dbCreateSequelize = new Sequelize(createDBOptions);

console.log(`======Create DataBase : ${db_name}======`);

dbCreateSequelize.getQueryInterface().createDatabase(db_name)
.then(() => {
  console.log("✅db create success!");
})
.catch((e) => {
  console.log("❗️error in create db : ", e);
})