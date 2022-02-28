import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { IoLockClosed } from 'react-icons/io5';
import Loading from '../global/Loading';
import Wallet from '../../utils/blockchain/wallet';
import DataService from '../../services/db';
import { AppContext } from '../../contexts/AppContext';
import * as Service from '../../services';

export default function LockedFooter() {
	let history = useHistory();
	const { setWallet, setTotalBeneficiaries, agency } = useContext(AppContext);
	const [loadingModal, setLoadingModal] = useState(false);

	const checkProjectBeneficiaries = useCallback(async () => {
		const totalBen = await DataService.listBeneficiaries();
		setTotalBeneficiaries(totalBen.length);
	}, [setTotalBeneficiaries]);

	const checkMobilizerStatus = useCallback(
		async wallet => {
			//update API to only query relevant agency.
			if (!wallet) return;
			const data = await Service.getMobilizerByWallet(wallet.address);
			if (data && data.projects.length) {
				await checkProjectBeneficiaries(wallet, data.projects[0].project.id);
			}
			if (!data.agencies.length) return history.push('/setup/idcard');
			let status = data.agencies[0].status;

			if (status !== 'active') {
				let dagency = Object.assign(agency, { isApproved: false });
				await DataService.updateAgency(dagency.address, dagency);
				history.push('/setup/pending');
			}
		},
		[agency, checkProjectBeneficiaries, history]
	);

	const handleUnlockClick = useCallback(async () => {
		try {
			setLoadingModal(true);
			let profile = await DataService.get('profile');
			if (profile) {
				let encryptedWallet = await DataService.getWallet();
				const wallet = await Wallet.loadFromJson(profile.phone, encryptedWallet);
				setWallet(wallet);
				await checkMobilizerStatus(wallet);
			}
			history.push('/');
			setLoadingModal(false);
		} catch (err) {
			setLoadingModal(false);
			console.error({ err });
		}
	}, [checkMobilizerStatus, setWallet, history]);

	useEffect(() => {
		handleUnlockClick();

		return () => {
			setLoadingModal(false);
		};
	}, [handleUnlockClick]);

	return (
		<>
			<Loading message="Unlocking your wallet. Please wait..." showModal={loadingModal} />
			<div className="footer-locked">
				<div className="appBottomMenu">
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a
						title="Tap here to unlock"
						href="#screen"
						className="item"
						id="btnUnlock"
						onClick={handleUnlockClick}
					>
						<div className="col">
							<div className="action-button large">
								<IoLockClosed className="ion-icon" />
							</div>
						</div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
				</div>
			</div>
		</>
	);
}
