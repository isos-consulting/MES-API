import * as fs from 'fs';
import * as path from 'path'

console.log("migration-all-table");

console.log(`
    --------------------------------------
    +++++ISOS Project Migration Start+++++
    --------------------------------------
`);

const migrationAllTable = async () => {
  let migrationFiles : string[] = [];

  fs.readdir(path.join(__dirname, '/', 'schemes'),
    async (err, files) => {
      if(err) console.log('err : ', err);
      if(files) {
        files.forEach(el => {
          // migration 파일 형식이 xx(번호).테이블명.migration.js 이기 때문에
          // 파일명의 끝부터 12자리까지의 값을 잘라내어 얻어온 값이 migration.js 가 맞다면 list에 push 한다.
          if(el.substr(el.length - 12, el.length) === 'migration.js'){
            migrationFiles.push(el);
          }
        })
        console.log(migrationFiles);
      }

      for(let el of migrationFiles){
        console.log('Migration File Name : ', el);
        // migration 파일의 migration Function 실행
        await require(`./schemes/${el}`).migration();
      }
    });
}
migrationAllTable();