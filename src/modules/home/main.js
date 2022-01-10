import React, { useState, useContext, useEffect } from 'react';
import { useHistory, Redirect, Link } from 'react-router-dom';

import * as Service from '../../services';
import { AppContext } from '../../contexts/AppContext';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';

import TransactionList from '../transactions/list';
import DataService from '../../services/db';
// import { RahatService } from '../../services/chain';

export default function Main() {
	const history = useHistory();
	const {
		hasWallet,
		wallet,
		recentTx,
		addRecentTx,
		// setProject,
		agency,
		project,
		beneficiaryCount,
		setTotalBeneficiaries
	} = useContext(AppContext);
	const { resetBeneficiary } = useContext(RegisterBeneficiaryContext);
	const [showPageLoader, setShowPageLoader] = useState(true);

	const checkMobilizerStatus = async () => {
		//update API to only query relevant agency.
		if (!wallet) return;
		const data = await Service.getMobilizerByWallet(wallet.address);
		// let defaultAgency = await DataService.getDefaultAgency();
		if (data && data.projects.length) {
			await checkProjectBeneficiaries(wallet, data.projects[0].project.id);
			// RahatService(defaultAgency.address, wallet)
			// 	.getProjectBalance(data.projects[0].project.id)
			// 	.then(bal => {
			// 		setProject({ name: data.projects[0].project.name, id: data.projects[0].project.id, balance: bal });
			// 	});
		}
		if (!data.agencies.length) return history.push('/setup/idcard');
		let status = data.agencies[0].status;

		if (status !== 'active') {
			let dagency = Object.assign(agency, { isApproved: false });
			await DataService.updateAgency(dagency.address, dagency);
			history.push('/setup/pending');
		}
	};

	const checkProjectBeneficiaries = async projectId => {
		const totalBen = await DataService.listBeneficiaries();
		setTotalBeneficiaries(totalBen.length);
	};

	useEffect(() => {
		checkMobilizerStatus();
		resetBeneficiary();

		let timer1 = null;
		(async () => {
			let txs = await DataService.listTx();
			if (txs) addRecentTx(txs.slice(0, 3));
			const timer = setTimeout(() => {
				setShowPageLoader(false);
			}, 300);
			timer1 = setTimeout(async () => {
				await checkMobilizerStatus();
			}, 3000);
			return () => {
				clearTimeout(timer);
				clearTimeout(timer1);
			};
		})();
		return function cleanup() {
			if (timer1) clearTimeout(timer1);
		};
	}, []);

	if (!hasWallet) {
		return <Redirect to="/setup" />;
	}

	if (agency && !agency.isApproved) {
		return <Redirect to="/setup/pending" />;
	}

	return (
		<>
			{showPageLoader && (
				<div id="loader">
					<img src="/assets/img/brand/icon-white-128.png" alt="icon" className="loading-icon" />
				</div>
			)}
			<div id="appCapsule">
				<div className="section wallet-card-section pt-1">
					<div className="wallet-card">
						<div className="mobilizer-header">{project ? project.name : '...'}</div>
						<div className="balance">
							<div className="left">
								<h1 className="total">{project ? project.balance : 0}</h1>
								<span className="mobilizer-title">Project Balance</span>
							</div>
							<div className="right">
								<h1 className="total">{beneficiaryCount}</h1>
								<span className="mobilizer-title">Beneficiaries</span>
							</div>
						</div>
					</div>
				</div>

				<div className="section mt-2">
					<div className="card">
						<div
							className="section-heading"
							style={{
								marginBottom: '0px'
							}}
						>
							<div
								className="card-header"
								style={{
									borderBottom: '0px'
								}}
							>
								Recent Transactions
							</div>

							<Link to="/transaction" className="link" style={{ marginRight: '16px' }}>
								View All
							</Link>
						</div>
						<div
							className="card-body"
							style={{
								paddingTop: '0px'
							}}
						>
							<TransactionList limit="3" transactions={recentTx} />
						</div>
					</div>
				</div>

				<div className="text-center mt-4">
					{hasWallet && !wallet && <strong>Tap on lock icon to unlock</strong>}
				</div>
			</div>
		</>
	);
}
