import sequelize from "../models";
import convertReadResult from "./convertReadResult";

/**
 * Admin View 생성 Function
 * 기본 Column(id, cd, nm, sortby)및 Optional Code(ADM_STD_OPT_TB)를 포함하여 Admin View 생성
 * @param _stdId 생성 할 Admin View의 StdId(ADM_STD_TB 의 PK)
 * @param _viewNm 생성 할 Admin View의 Name
 * @param _colNm 생성 할 Admin View의 Main Column Name
 */
const createAdmView = async (_stdId: number, _viewNm: string, _colNm: string) => {
  const readOptColumnsQuery = `
    SELECT std_opt_cd, (CASE WHEN alias='' THEN std_opt_cd ELSE alias END) AS alias, col_gb 
    FROM adm_std_opt_tb 
    WHERE std_id = ${_stdId} AND col_use_fg = TRUE 
    ORDER BY sortby;
  `;

  const readOptColumnsResult = await sequelize.query(readOptColumnsQuery);
  const readOptColumns = convertReadResult(readOptColumnsResult[0]);

  // 📌 ADM_STD_OPT_TB에 입력되어 있는 Optional Code 조회구문
  let selectOptColumnsOnMain: string = '';
  let selectOptColumnsOnSub: string = '';
  readOptColumns.raws.forEach((column: any) => {
    selectOptColumnsOnMain = selectOptColumnsOnMain.concat(`, B.${column.std_opt_cd} as ${column.alias}`);
    selectOptColumnsOnSub = selectOptColumnsOnSub.concat(`, MAX(CASE WHEN b.std_opt_cd = '${column.std_opt_cd}' THEN value ELSE NULL END) AS ${column.std_opt_cd}`);
  });

  // 📌 기본 Column(id, cd, nm, sortby)및 Optional Code(ADM_STD_OPT_TB)를 포함하여 Admin View 생성
  const createAdmViewQuery = `
    DROP MATERIALIZED VIEW IF EXISTS ${_viewNm};

    CREATE MATERIALIZED VIEW ${_viewNm} AS
    SELECT 
      a.std_value_id as ${_colNm}_id, 
      a.std_value_cd as ${_colNm}_cd, 
      a.value as ${_colNm}_nm 
      ${selectOptColumnsOnMain}, 
      a.sortby, 
      a.created_at, a.created_uid, a.updated_at, a.updated_uid
    FROM adm_std_value_tb a
    LEFT JOIN ( 
      SELECT 	
        a.std_value_id
        ${selectOptColumnsOnSub}
      FROM   adm_std_opt_value_tb a
      JOIN 	adm_std_opt_tb b ON b.std_opt_id = a.std_opt_id
      GROUP BY a.std_value_id ) B ON B.std_value_id = A.std_value_id 
    WHERE a.std_id = ${_stdId}
    ORDER BY a.sortby;
  `;
  await sequelize.query(createAdmViewQuery);

  // 📌 Materialized View 의 Index 생성 (Code, Sortby)
  const createIndexQuery = `
    CREATE INDEX ON ${_viewNm}(${_colNm}_cd);
    CREATE INDEX ON ${_viewNm}(sortby);
  `;
  await sequelize.query(createIndexQuery);
}

export default createAdmView;