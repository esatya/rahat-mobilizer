import React, { useState, useContext, useEffect, useCallback } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import { AppContext } from '../../contexts/AppContext';
import { ActionSheetContext } from '../../contexts/ActionSheetContext';
import { useHistory } from 'react-router-dom';
import AppHeader from '../layouts/AppHeader';
import { Link } from 'react-router-dom';
import BeneficiaryDetail from './beneficiaryDetail';
import { Row, Col } from 'react-bootstrap';
import DataService from '../../services/db';
import { RahatService } from '../../services/chain';
import { getAuthSignature } from '../../utils';
import * as Service from '../../services';

const RegisterBeneficiary = () => {
	const history = useHistory();
	const { phone, name, photo } = useContext(RegisterBeneficiaryContext);
	const { wallet } = useContext(AppContext);
	const { loading } = useContext(ActionSheetContext);
	const [remainingToken, setRemainingToken] = useState('loading...');
	const [beneficiaryInfo, setBeneficiaryInfo] = useState([]);

	const handleIssuePackage = () => {
		history.push('/beneficiary/package');
	};

	const handleIssueToken = () => {
		history.push('/issue/token');
	};

	const fetchBeneficiary = useCallback(async () => {
		const signature = await getAuthSignature(wallet);
		const ben = await Service.getBeneficiaryById(signature, phone);
		setBeneficiaryInfo(ben.data);
	}, [wallet, phone]);

	const updateTokenDetails = useCallback(async () => {
		const agency = await DataService.getDefaultAgency();
		const rahat = RahatService(agency.address, wallet);
		const remainingToken = await rahat.getBeneficiaryToken(phone);
		setRemainingToken(remainingToken);
	}, [phone, wallet]);

	useEffect(() => {
		fetchBeneficiary();
		updateTokenDetails();
	}, [fetchBeneficiary, updateTokenDetails]);
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
					<BeneficiaryDetail
						name={name ? name : beneficiaryInfo.name}
						phone={phone}
						remainingToken={remainingToken}
						photo={photo}
					/>
					<div>
						<h3 className="mt-4">Issue </h3>
						<Row className="text-center mt-2">
							<Col>
								<div className="card">
									<div className="card-header " onClick={handleIssueToken}>
										Token
									</div>
								</div>
							</Col>
							<Col>
								<div className="card ">
									<div className="card-header" onClick={handleIssuePackage}>
										Package
									</div>
								</div>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		</>
	);
};

export default RegisterBeneficiary;
