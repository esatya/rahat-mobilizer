const server_url = process.env.REACT_APP_DEFAULT_AGENCY_API;
const base_url = server_url;

module.exports = {
	REGISTER: base_url + '/mobilizers/register',
	PROJECTS: base_url + '/projects',
	BENEFICIARIES: base_url + '/beneficiaries',
	MOBILIZERS: base_url + '/mobilizers',
	NFT: base_url + '/nft'
};
