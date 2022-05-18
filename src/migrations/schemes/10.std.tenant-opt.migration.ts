import IStdTenantOpt from '../../interfaces/std/tenant-opt.interface';
import BaseMigration from '../base-migration';

// Seed Datas
const seedDatas: IStdTenantOpt[] = [
	{
		tenant_opt_id : 1,
		tenant_opt_cd : "ALLOW_MINUS_STOCK",
		tenant_opt_nm : "마이너스 재고 허용 여부",
		value : 1,
		remark : 
			`재고에 대한 마이너스 허용 여부
			[허용안함: 0, 허용: 1]
			[Default: 허용(1)]`,
		created_uid : 1,
		updated_uid : 1
	},
	{
		tenant_opt_id : 2,
		tenant_opt_cd : "PRD_METHOD_REJECT_QTY",
		tenant_opt_nm : "부적합수량 집계 처리 방법",
		value : 0,
		remark : 
			`집계: 공정 별(라우팅) 불량 수량의 합계를 실적 부적합수량으로 적용
			마지막공정수량: 라우팅 마지막공정 부적합수량을 실적 부적합수량으로 적용
			[집계: 0, 마지막공정수량: 1]
			[Default: 집계(0)]`,
		created_uid : 1,
		updated_uid : 1
	},
	{
		tenant_opt_id : 3,
		tenant_opt_cd : "PRD_ONGOING_SAVE",
		tenant_opt_nm : "생산수량 중간저장 사용 여부",
		value : 0,
		remark : 
			`중간저장 사용 시 현장용 프로그램에 중간저장 버튼이 활성화 되며,
			중간저장은 생산수량에 대해서만 재고가 추가되고 투입 품목에 재고에 대해서는 작업종료 시 소진됨
			투입품목 재고까지 소진하기 위해서는 분할실적으로 생산정보 등록
			[미사용: 0, 사용: 1]
			[Default: 미사용(0)]`,
		created_uid : 1,
		updated_uid : 1
	},
	{
		tenant_opt_id : 4,
		tenant_opt_cd : "PRD_ORDER_AUTO_COMPLETE",
		tenant_opt_nm : "작업지시 자동마감 처리",
		value : 1,
		remark : 
			`사용안함: 사용자가 직접 마감처리
			지시기준마감: 지시수량보다 생산수량(양품)이 이상인 경우 자동마감처리
			실적기준마감: 지시수량과 관계없이 지시기준으로 실적 등록됐을 때 자동 마감 처리
			[사용안함: 0, 지시기준마감: 1, 실적기준마감: 2]
			[Default: 지시기준마감(1)]`,
		created_uid : 1,
		updated_uid : 1
	},
	{
		tenant_opt_id : 5,
		tenant_opt_cd : "OUT_AUTO_PULL",
		tenant_opt_nm : "외주투입 자동 선입선출",
		value : 1,
		remark : 
			`사용안함: 사용자가 직접 투입 데이터 입력
			사용: 외주창고내 재고를 자동으로 선입선출하여 투입 처리
			[사용안함: 0, 사용: 1]
			[Default: 사용(1)]`,
		created_uid : 1,
		updated_uid : 1
	},
	{
		tenant_opt_id : 6,
		tenant_opt_cd : "QMS_INSP_RESULT_FULL",
		tenant_opt_nm : "검사성적서 결과값 전체등록 여부",
		value : 0,
		remark : 
			`사용안함: 검사 결과값이 시료수 만큼 등록되지 않아도 저장
			사용: 검사 결과값이 시료수 만큼 전부 등록되어야 저장
			확인절차적용: 검사 결과값이 시료수 만큼 등록되지 않았을 때 그래도 저장 할 것인가 메세지 출력 후 저장
			[사용안함: 0, 사용: 1, 확인절차적용: 2]
			[Default: 사용안함(0)]`,
		created_uid : 1,
		updated_uid : 1
	},
]

const baseMigration = new BaseMigration('StdTenantOpt', 'tenant_opt_id', seedDatas);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };