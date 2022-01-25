import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useHistory, Redirect, Link } from 'react-router-dom';

import * as Service from '../../services';
import { AppContext } from '../../contexts/AppContext';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';

import TransactionList from '../transactions/list';
import DataService from '../../services/db';
import { RahatAdminService } from '../../services/chain';
import { getAuthSignature } from '../../utils';

export default function Main() {
	const history = useHistory();
	const { hasWallet, wallet, agency, addRecentTx, recentTx, beneficiaryCount, setTotalBeneficiaries } =
		useContext(AppContext);
	const { resetBeneficiary } = useContext(RegisterBeneficiaryContext);
	const [showPageLoader, setShowPageLoader] = useState(false);
	const [erc20, setErc20] = useState();
	const [erc1155, setErc1155] = useState([]);
	const [project, setProject] = useState(null);

	const checkRecentTnx = useCallback(async () => {
		let txs = await DataService.listTx();
		if (txs) addRecentTx(txs);
	}, [addRecentTx]);

	const checkProjectBeneficiaries = useCallback(async () => {
		const totalBen = await DataService.listBeneficiaries();
		setTotalBeneficiaries(totalBen.length);
	}, [setTotalBeneficiaries]);

	const checkAgencyApproval = useCallback(
		async (agencies = []) => {
			if (!agencies.length) return history.push('/setup/idcard');
			let status = agencies[0].status;
			if (status !== 'active') {
				let dagency = Object.assign(agency, { isApproved: false });
				await DataService.updateAgency(dagency.address, dagency);
				history.push('/setup/pending');
			}
		},
		[history, agency]
	);

	const checkProject = useCallback(
		async (projects = [], signature) => {
			if (projects && projects.length > 0 && signature) {
				setProject({
					name: projects[0]?.project.name,
					id: projects[0]?.project.id
				});
				await checkProjectBeneficiaries(wallet, projects[0].project.id);
				const defaultAgency = await DataService.getDefaultAgency();
				const rahat = RahatAdminService(defaultAgency.address, wallet);
				const projectERC1155Balances = await rahat.getProjectERC1155Balances(projects[0].project.id);
				if (projectERC1155Balances) {
					const tokenIds = projectERC1155Balances.tokenIds.map(t => t.toNumber());
					const tokenQtys = projectERC1155Balances.balances.map(b => b.toNumber());
					const totalPackageBalance = await Service.calculateTotalPackageBalance(
						{ tokenIds, tokenQtys },
						signature
					);
					setErc1155(totalPackageBalance);
				}
				const projectERC20Balance = await rahat.getProjecERC20Balance(projects[0].project.id);
				setErc20(projectERC20Balance.toNumber());
			}
		},
		[checkProjectBeneficiaries, wallet]
	);

	const toggleLoader = () => setShowPageLoader(prev => !prev);

	const checkMobilizerStatus = useCallback(async () => {
		if (!wallet) return;
		const signature = await getAuthSignature(wallet);
		const { projects, agencies } = await Service.getMobilizerByWallet(wallet.address);
		await checkProject(projects, signature);
		await checkAgencyApproval(agencies);
	}, [wallet, checkProject, checkAgencyApproval]);

	const getInfoState = useCallback(async () => {
		try {
			toggleLoader();
			await checkMobilizerStatus();
			await checkRecentTnx();
			resetBeneficiary();
			toggleLoader();
		} catch (err) {
			toggleLoader();
			console.log({ error });
		}
	}, [checkMobilizerStatus, resetBeneficiary, checkRecentTnx]);

	useEffect(getInfoState, [getInfoState]);

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
						<div className="balance mt-2">
							<div className="left">
								<h2 className="total">{erc20 ? erc20 : 0}</h2>
								<span className="mobilizer-title">Project Token</span>
							</div>
							<div className="right">
								<h2 className="total">{erc1155.grandTotal ? erc1155.grandTotal : 0}</h2>
								<span className="mobilizer-title">Project Packages</span>
							</div>
						</div>
						<div className="mt-1">
							<h2 className="total">{beneficiaryCount}</h2>
							<span className="mobilizer-title">Beneficiaries</span>
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
							<TransactionList limit="3" transactions={recentTx || []} />
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
