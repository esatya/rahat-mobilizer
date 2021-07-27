import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IoLockClosed } from 'react-icons/io5';

import Loading from '../global/Loading';
import Wallet from '../../utils/blockchain/wallet';
import DataService from '../../services/db';
import { AppContext } from '../../contexts/AppContext';

export default function LockedFooter() {
	let history = useHistory();
	const { setWallet } = useContext(AppContext);
	const [loadingModal, setLoadingModal] = useState(false);

	const handleUnlockClick = async () => {
		setLoadingModal(true);
		let profile = await DataService.get('profile');
		const wallet = await Wallet.loadFromPrivateKey(
			'0x387e176cf5a5016a38f552abc0c3370a733a4f232061957d76d8f5e9a8b0b729'
		);
		//let encryptedWallet = await DataService.getWallet();
		//const wallet = await Wallet.loadFromJson(profile.phone, encryptedWallet);
		//console.log(wallet.privateKey);
		setWallet(wallet);
		history.push('/');
		setLoadingModal(false);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			handleUnlockClick();
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

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
