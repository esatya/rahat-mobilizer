import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import DataService from '../../services/db';
import { isOffline, getAuthSignature } from '../../utils';
import Wallet from '../../utils/blockchain/wallet';
import * as Service from '../../services';

export default function Main() {
	const history = useHistory();
	const [agencyName, setAgencyName] = useState('the agency');

	const checkForApproval = async () => {
		let encryptedWallet = await DataService.getWallet();
		let profile = await DataService.get('profile');
		if (!encryptedWallet) history.push('/setup');
		//	wallet = JSON.parse(wallet);
		let dagency = await DataService.getDefaultAgency();
		if (!dagency) history.push('/setup');
		setAgencyName(dagency.name);

		//update API to only query relevant agency.
		// let data = await fetch(`${process.env.REACT_APP_DEFAULT_AGENCY_API}/mobilizers/0x${wallet.address}`).then(r => {
		// 	if (!r.ok) throw Error(r.message);
		// 	return r.json();
		// });
		const wallet = await Wallet.loadFromJson(profile.phone, encryptedWallet);

		const signature = await getAuthSignature(wallet);
		const data = await Service.getMobilizerByWallet(signature, wallet.address);
		if (!data.agencies.length) return history.push('/setup/idcard');
		let status = data.agencies[0].status;
		if (status === 'active') {
			dagency.isApproved = true;
			await DataService.updateAgency(dagency.address, dagency);
			await DataService.addProject({ id: data.projects[0].project.id, name: data.projects[0].project.name });

			return history.push('/');
		}
	};

	useEffect(() => {
		(async () => {
			await checkForApproval();
			// const timer = setInterval(async () => {
			// 	await checkForApproval();
			// }, 20000);
			return () => {
				//clearInterval(timer);
			};
		})();
		return function cleanup() {};
	}, []);

	return (
		<>
			<div className="item p-2">
				<div className="text-center p-3 mb-3">
					<img src="/assets/img/brand/logo-512.png" alt="alt" width="200" />
				</div>
				<h2>Waiting for Approval</h2>
				<p>
					Your application is being reviewed by <b>{agencyName}</b>. Once approved, you will be able to use
					this system. Please check again later.
				</p>
				<div className="p-3">
					<button
						type="button"
						className="btn btn-lg btn-block btn-success mt-1"
						onClick={() => checkForApproval()}
					>
						Check for approval
					</button>
				</div>
			</div>
		</>
	);
}
