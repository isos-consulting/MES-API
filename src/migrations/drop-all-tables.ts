import * as fs from 'fs';
import * as path from 'path'

console.log("migration-undo-all-table");

console.log(`
    --------------------------------------
    +++ISOS Project MigrationUndo Start+++
    --------------------------------------
`);

const migrationUndoAllTable = async () => {
  let migrationFiles : string[] = []

  fs.readdir(path.join(__dirname, '/', 'schemes'),
    async (err, files) => {
      if(err) console.log("err : ", err);
      if(files) {
        files.forEach(el => {
          // migration 파일 형식이 xx(번호).테이블명.migration.js 이기 때문에
          // 파일명의 끝부터 12자리까지의 값을 잘라내어 얻어온 값이 migration.js 가 맞다면 list에 push 한다.
          if(el.substr(el.length - 12, el.length) === 'migration.js'){
            migrationFiles.push(el);
          }
        })
        // 테이블의 Drop은 Create의 역순으로 진행해야함(Because, Foreign key 등 제약조건)
        // 파일의 정렬 순서 역순으로 변경
        migrationFiles.reverse();

        console.log(migrationFiles)
      }

      for(let el of migrationFiles){
        // migration 파일의 migrationUndo Function 실행
        await require(`./schemes/${el}`).migrationUndo();
      }
    });
}
migrationUndoAllTable();