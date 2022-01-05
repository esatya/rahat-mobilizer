import React, { useState, useEffect, useContext, useCallback } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import { AppContext } from '../../contexts/AppContext';
import { useHistory } from 'react-router-dom';
import AppHeader from '../layouts/AppHeader';
import { Link } from 'react-router-dom';
import BeneficiaryDetail from './beneficiaryDetail';

const RegisterBeneficiary = () => {
	const history = useHistory();
	const { phone, name, photo } = useContext(RegisterBeneficiaryContext);
	// const { wallet, toggleFooter } = useContext(AppContext);
	const [loading, showLoading] = useState(null);
	const [remainingToken, setRemainingToken] = useState('loading...');

	const handleIssuePackage = () => {
		history.push('/beneficiary/package');
	};

	const handleIssueToken = () => {
		history.push('/issue/token');
	};

	// const updateTokenDetails = useCallback(async () => {
	// 	const agency = await DataService.getDefaultAgency();
	// 	const rahat = RahatService(agency.address, wallet);
	// 	const remainingToken = await rahat.getBeneficiaryToken(phone);
	// 	setRemainingToken(remainingToken);
	// }, [phone, wallet]);

	// useEffect(() => {
	// 	updateTokenDetails();
	// 	return () => {
	// 		toggleFooter(false);
	// 	};
	// }, [updateTokenDetails, toggleFooter]);

	return (
		<>
			<AppHeader
				currentMenu="Beneficiaries"
				actionButton={
					<Link to="/" className="headerButton">
						<IoHomeOutline className="ion-icon" />
					</Link>
				}
			/>

			{loading !== null && (
				<div
					style={{
						height: '850px',
						position: 'absolute',
						color: '#ffffff',
						fontSize: 16,
						backgroundColor: '#000',
						opacity: 0.7,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 1000,
						left: 0,
						top: 0,
						right: 0,
						bottom: 0
					}}
				>
					<div className="text-center">
						<img
							src="/assets/img/brand/icon-white-128.png"
							alt="icon"
							className="loading-icon"
							style={{ width: 30 }}
						/>
						<br />
						<div className="mt-1">{loading}</div>
					</div>
				</div>
			)}

			<div id="appCapsule">
				<div className="section mt-2">
					<BeneficiaryDetail name={name} phone={phone} remainingToken={remainingToken} photo={photo} />
					<div>
						<h3 className="mt-3">Issue </h3>
						<div className="card mt-2">
							<div className="card-header" onClick={handleIssueToken}>
								Token
							</div>
						</div>
						<div className="card mt-2">
							<div className="card-header" onClick={handleIssuePackage}>
								Package
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default RegisterBeneficiary;
