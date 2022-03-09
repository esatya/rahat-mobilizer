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
	const {
		hasWallet,
		hasBackedUp,
		wallet,
		agency,
		beneficiaryCount,
		setTotalBeneficiaries,
		hideFooter,
		toggleFooter,
		contextLoading,
		hasSynchronized
	} = useContext(AppContext);

	const { resetBeneficiary } = useContext(RegisterBeneficiaryContext);
	const [erc20, setErc20] = useState();
	const [erc1155, setErc1155] = useState([]);
	const [project, setProject] = useState(null);
	const [recentTx, setRecentTx] = useState(null);
	const checkRecentTnx = useCallback(async () => {
		let txs = await DataService.listTx();
		if (txs && Array.isArray(txs)) {
			const arr = txs.slice(0, 3);
			setRecentTx(arr);
		}
	}, []);

	const resetPage = () => {
		setErc20();
		setErc1155([]);
		setProject(null);
		setRecentTx(null);
	};

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
	const checkMobilizerStatus = useCallback(async () => {
		const signature = await getAuthSignature(wallet);
		const { projects, agencies } = await Service.getMobilizerByWallet(wallet.address);
		return { projects, agencies, signature };
	}, [wallet]);

	const getInfoState = useCallback(async () => {
		if (contextLoading) return;
		if (!hasWallet) return history.push('/setup');
		if (!hasBackedUp) return history.push('/wallet/backup');
		if (!hasSynchronized) return history.push('/sync');
		if (agency && !agency.isApproved) return history.push('/setup/pending');
		try {
			if (!wallet) return;
			if (hideFooter) toggleFooter(false);

			await checkRecentTnx();
			const { projects, agencies, signature } = await checkMobilizerStatus();
			await checkAgencyApproval(agencies);
			await checkProject(projects, signature);
			resetBeneficiary();
		} catch (err) {
			console.error({ err });
		}
	}, [
		wallet,
		checkMobilizerStatus,
		resetBeneficiary,
		checkRecentTnx,
		hideFooter,
		toggleFooter,
		checkProject,
		checkAgencyApproval,
		contextLoading,
		history,
		hasWallet,
		hasBackedUp,
		hasSynchronized,
		agency
	]);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) getInfoState();
		return () => {
			isMounted = false;
			resetPage();
		};
	}, [getInfoState]);

	if (contextLoading) {
		return (
			<div id="loader">
				<img src="/assets/img/brand/icon-white-128.png" alt="icon" className="loading-icon" />
			</div>
		);
	}

	if (!hasWallet) {
		return <Redirect to="/setup" />;
	}

	if (!hasBackedUp) {
		return <Redirect to="/wallet/backup" />;
	}

	if (agency && !agency.isApproved) {
		return <Redirect to="/setup/pending" />;
	}

	return (
		<>
			{/* {showPageLoader && <Spinner />} */}

			<div id="appCapsule">
				<div className="section wallet-card-section pt-1">
					<div className="wallet-card">
						<div className="mobilizer-header">{project ? project.name : '...'}</div>
						<div className="balance mt-2">
							<div className="left">
								{erc20 && <h2 className="total">{erc20}</h2>}
								{!erc20 && <h2 className="total loading_text"> 0</h2>}
								<span className="mobilizer-title">Project Token</span>
							</div>
							<div className="right">
								{erc1155?.grandTotal && <h2 className="total">{`NPR ${erc1155.grandTotal}`}</h2>}
								{!erc1155?.grandTotal && <h2 className="total loading_text">{0}</h2>}

								<span className="mobilizer-title">Project Packages</span>
							</div>
						</div>
						<div className="mt-1">
							<h2 className="total">{beneficiaryCount}</h2>

							<span className="mobilizer-title">Beneficiaries</span>
						</div>
						{/* </>
						)} */}
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
