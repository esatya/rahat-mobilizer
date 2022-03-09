import axios from 'axios';

import API from '../constants/api';
import { RahatService } from './chain';

export async function registerToAgency(payload) {
	try {
		const res = await fetch(`${API.REGISTER}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
		return { res: res.data };
	} catch (e) {
		throw Error(e);
	}
}
export async function getMobilizerByWallet(walletAddress) {
	try {
		const res = await axios.get(`${API.MOBILIZERS}/${walletAddress}`);
		return res.data;
	} catch (e) {
		throw Error(e);
	}
}

export async function getBeneficiaryById(signature, id) {
	try {
		const { data } = await axios({
			url: `${API.BENEFICIARIES}/${id}`,
			method: 'GET',
			headers: {
				auth_signature: signature
			}
		});
		return data;
	} catch (e) {
		throw Error(e);
	}
}

export async function getProjectDetails(signature, projectId) {
	try {
		const res = await fetch(`${API.PROJECTS}/${projectId}`, {
			method: 'GET',
			headers: {
				auth_signature: signature
			}
		});
		return res.json();
	} catch (e) {
		throw Error(e);
	}
}

export async function getProjectBeneficiaries(signature, projectId) {
	try {
		const res = await fetch(`${API.PROJECTS}/${projectId}/beneficiaries`, {
			method: 'GET',
			headers: {
				auth_signature: signature
			}
		});
		return res.json();
	} catch (e) {
		throw Error(e);
	}
}

export async function registerBeneficiary(signature, payload) {
	payload = Object.entries(payload).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
	if (!payload.wallet_address) payload.wallet_address = payload.phone;
	if (payload.token) delete payload.token;

	try {
		const data = await axios({
			url: API.BENEFICIARIES,
			method: 'post',
			headers: {
				auth_signature: signature
			},
			data: payload
		});
		return data;
	} catch (e) {
		throw Error(e);
	}
}

export async function getPackageDetails(id) {
	try {
		if (!id) throw new Error('Must send id');
		const res = await axios.get(`${API.NFT}/token/${id}`);
		return res.data;
	} catch (e) {
		throw Error(e);
	}
}

export async function listNftPackages(projectId, signature) {
	try {
		const res = await axios({
			url: `${API.NFT}/${projectId}/list`,
			method: 'get',
			headers: {
				auth_signature: signature
			}
		});
		return res.data;
	} catch {}
}

export async function getNftPackages(tokenId) {
	try {
		const res = await axios({
			url: `${API.NFT}/token/${tokenId}`,
			method: 'get'
		});
		return res.data;
	} catch {}
}

export async function calculateTotalPackageBalance(payload, signature) {
	let res = await axios.post(`${API.NFT}/total-package-balance`, payload, {
		headers: { auth_signature: signature }
	});
	return res.data;
}

export async function getBeneficiaryPackageBalance(phone, signature) {
	const data = await RahatService.getTotalERC1155Balance(phone);
	if (!data) return null;
	if (data) {
		const tokenIds = data.tokenIds.map(t => t.toNumber());
		const tokenQtys = data.balances.map(b => b.toNumber());
		return calculateTotalPackageBalance({ tokenIds, tokenQtys }, signature);
	}
}

export async function smsTokenIssue(signature, payload) {
	try {
		const data = await axios({
			url: `${API.SMS}/token`,
			method: 'post',
			headers: {
				auth_signature: signature
			},
			data: payload
		});
		return data;
	} catch (e) {
		throw Error(e);
	}
}

export async function smsPackageIssuance(signature, payload) {
	try {
		const data = await axios({
			url: `${API.SMS}/package`,
			method: 'post',
			headers: {
				auth_signature: signature
			},
			data: payload
		});
		return data;
	} catch (e) {
		throw Error(e);
	}
}

export const getDefautAgency = async () => {
	let appData = await fetch(`${process.env.REACT_APP_DEFAULT_AGENCY_API}/app/settings`).then(async r => {
		if (!r.ok) throw Error(r.message);
		return r.json();
	});
	const agencyData = {
		api: process.env.REACT_APP_DEFAULT_AGENCY_API,
		address: appData.agency.contracts.rahat,
		adminAddress: appData.agency.contracts.rahat_admin,
		network: appData.networkUrl,
		erc20Address: appData.agency.contracts.rahat_erc20,
		erc1155Address: appData.agency.contracts.rahat_erc1155,
		name: appData.agency.name,
		email: appData.agency.email,
		isApproved: false
	};
	return agencyData;
};
