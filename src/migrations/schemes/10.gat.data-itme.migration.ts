import IStdDataItem from '../../interfaces/gat/data-item.interface';
import BaseMigration from '../base-migration';
import config from '../../configs/config';

// Seed Datas
let seedDatas: IStdDataItem[] = [
	{
		data_item_id : 2,
		data_item_cd : "02",
		data_item_nm : "생산수량",
		created_uid : 1,
		updated_uid : 1,
		uuid : "96b353d1-801a-47bb-841f-e0d2019dd635",
		monitoring_fg : null
	},
	{
		data_item_id : 1,
		data_item_cd : "01",
		data_item_nm : "온도",
		created_uid : 1,
		updated_uid : 0,
		uuid : "0fe380fd-d6e6-4934-8896-508f84a86ba4",
		monitoring_fg : true
	}
]

const baseMigration = new BaseMigration('StdDataItem', 'data_item_id', config.db.reset_type === 'test' ? seedDatas : []);
const migration = baseMigration.migration;
const migrationUndo = baseMigration.migrationUndo;

module.exports = { migration, migrationUndo };