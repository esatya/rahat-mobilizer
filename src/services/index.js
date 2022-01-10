import axios from 'axios';

import API from '../constants/api';

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
		const res = await fetch(`${API.MOBILIZERS}/${walletAddress}`, {
			method: 'GET'
		});
		return res.json();
	} catch (e) {
		throw Error(e);
	}
}

export async function getBeneficiaryById(signature, id) {
	try {
		const data = await axios({
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
	// try {
	// 	const res = await fetch(`${API.BENEFICIARIES}`, {
	// 		method: 'POST',
	// 		headers: {
	// 			auth_signature: signature
	// 		},
	// 		body: payload
	// 	});
	// 	console.log(res);
	// 	const d = await res.json();
	// 	console.log({ d });
	// 	return { res: res.data };
	// } catch (e) {
	// 	console.log(e);
	// 	throw Error(e);
	// }
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

export async function listNftPackages(projectId, query) {
	try {
		const res = await axios({
			url: `${API.NFT}/${projectId}/list?${qs.stringify(query)}`,
			method: 'get'
		});
		return res.data;
	} catch {}
}
