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
export async function getMobilizerByWallet(signature, walletAddress) {
	try {
		const res = await fetch(`${API.MOBILIZERS}/${walletAddress}`, {
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
