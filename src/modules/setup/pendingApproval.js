import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import DataService from '../../services/db';

import * as Service from '../../services';

export default function Main() {
	const history = useHistory();
	const [agencyName, setAgencyName] = useState('the agency');
	const [loading, setLoading] = useState(null);

	const checkForApproval = useCallback(async () => {
		setLoading('Redirecting to homepage...');
		let encryptedWallet = await DataService.getWallet();

		if (!encryptedWallet) history.push('/setup');
		let wallet = JSON.parse(encryptedWallet);
		let dagency = await DataService.getDefaultAgency();
		if (!dagency) history.push('/setup');
		setAgencyName(dagency.name);
		const data = await Service.getMobilizerByWallet(`0x${wallet.address}`);
		if (!data.agencies.length) return history.push('/setup/idcard');
		let status = data.agencies[0].status;
		if (status === 'active') {
			dagency.isApproved = true;
			await DataService.updateAgency(dagency.address, dagency);
			await DataService.addProject({ id: data.projects[0].project.id, name: data.projects[0].project.name });

			return history.push('/');
		}
		setLoading(null);
	}, [history]);

	useEffect(() => {
		checkForApproval();
	}, [checkForApproval]);

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
					{loading ? (
						<button className="btn btn-lg btn-block btn-primary" type="button" disabled="">
							<span
								className="spinner-border spinner-border-sm me-05"
								role="status"
								aria-hidden="true"
							></span>
							{loading}
						</button>
					) : (
						<button
							type="button"
							className="btn btn-lg btn-block btn-success mt-1"
							onClick={() => checkForApproval()}
						>
							Check for approval
						</button>
					)}
				</div>
			</div>
		</>
	);
}
