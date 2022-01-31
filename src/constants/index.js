module.exports = {
	APP_CONSTANTS: {
		VERSION: 1,
		PASSCODE_LENGTH: 10,
		SCAN_DELAY: 600,
		SCANNER_PREVIEW_STYLE: {
			height: 300,
			width: 400,
			display: 'flex',
			justifyContent: 'center'
		}
	},
	BACKUP: {
		PASSPHRASE_RULE: '"^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{12,})"',
		GDRIVE_FOLDERNAME: 'MobilizerBackup'
	},
	DB: {
		NAME: 'db_wallet',
		VERSION: 2.2,
		TABLES: {
			DATA: 'tbl_data',
			ASSETS: 'tbl_assets',
			DOCUMENTS: 'tbl_docs'
		}
	},
	DEFAULT_TOKEN: {
		NAME: 'Ether',
		SYMBOL: 'ETH'
	},
	GROUPS: {
		DIFFERENTLY_ABLED: {
			label: 'Differently Abled',
			value: 'Differently_Abled'
		},
		MATERNITY: {
			label: 'Maternity',
			value: 'Maternity'
		},
		SENIOR_CITIZENS: {
			label: 'Senior Citizens',
			value: 'Senior_Citizens'
		},
		COVID_VICTIM: {
			label: 'Covid Victim',
			value: 'Covid_Victim'
		},
		NATURAL_CLIMATE_VICTIM: {
			label: 'Natural Calamities Victim',
			value: 'Natural_Calamities_Victim'
		},
		UNDER_PRIVILAGED: {
			label: 'Under Privileged',
			value: 'Under_Privileged'
		},
		SEVERE_HEATH_ISSUES: {
			label: 'Severe Health Issues',
			value: 'Severe_Health_Issues'
		},
		SINGLE_WOMAN: {
			label: 'Single Women',
			value: 'Single_Women'
		},
		ORPHAN: {
			label: 'Orphan',
			value: 'Orphan'
		}
	},
	TRANSACTION_TYPES: {
		TOKEN: 'token',
		NFT: 'nft'
	}
};
