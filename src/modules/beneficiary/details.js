import React, { useEffect, useState, useContext, useCallback } from 'react';
import Moment from 'react-moment';
import { Button } from 'react-bootstrap';
import { GiReceiveMoney } from 'react-icons/gi';

import AppHeader from '../layouts/AppHeader';
import DataService from '../../services/db';
import { RahatService } from '../../services/chain';
import { useHistory } from 'react-router-dom';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import { AppContext } from '../../contexts/AppContext';

export default function Main(props) {
	const history = useHistory();
	const phone = props.match.params.phone;
	const { setBeneficiaryPhone, setBeneficiaryDetails, setBeneficiaryPhoto } = useContext(RegisterBeneficiaryContext);
	const { wallet } = useContext(AppContext);

	const [beneficiary, setBeneficiary] = useState({});
	const [remainingToken, setRemainingToken] = useState('loading...');

	const handleTokenIssue = async e => {
		e.preventDefault();
		setBeneficiaryPhone(phone);
		setBeneficiaryDetails({ name: beneficiary.name });
		setBeneficiaryPhoto(beneficiary.photo);
		history.push('/beneficiary/token');
		//return addBeneficiary(signature);
	};

	const updateBeneficiaryDetails = useCallback(async () => {
		const b = await DataService.getBeneficiary(phone);
		b.icon = (
			<div className="iconbox bg-success">
				<GiReceiveMoney className="ion-icon" />
			</div>
		);

		setBeneficiary(b);
		const agency = await DataService.getDefaultAgency();
		const rahat = RahatService(agency.address, wallet);
		const remainingToken = await rahat.getBeneficiaryToken(phone);
		setRemainingToken(remainingToken);
	}, [phone, wallet]);

	useEffect(() => {
		updateBeneficiaryDetails();
	}, [updateBeneficiaryDetails]);

	return (
		<>
			<AppHeader currentMenu="Beneficairy Details" />
			<div id="appCapsule" className="full-height">
				<div className="section mt-2 mb-2">
					<div className="listed-detail mt-3">
						<h3 className="text-center mt-2">{beneficiary.name}</h3>
					</div>

					<ul className="listview flush transparent simple-listview no-space mt-3">
						<li>
							<strong>Name</strong>
							<span>{beneficiary.name}</span>
						</li>
						<li>
							<strong>Phone</strong>
							<span style={{ overflow: 'hidden' }}>{beneficiary.phone}</span>
						</li>
						<li>
							<strong>Address</strong>
							<span>{beneficiary.address}</span>
						</li>
						<li>
							<strong>Created At</strong>
							<span>
								<Moment date={beneficiary.createdAt} format="YYYY/MM/DD hh:mm a" />
							</span>
						</li>
						<li>
							<strong>govt_id</strong>
							<h3 className="m-0">{beneficiary.govt_id}</h3>
						</li>
						<li>
							<strong>Token Issued</strong>
							<h3 className="m-0">{remainingToken}</h3>
						</li>
					</ul>
				</div>
				<div className="p-2">
					<Button type="button" className="btn btn-lg btn-block btn-success mt-3" onClick={handleTokenIssue}>
						Issue Token
					</Button>
				</div>
			</div>
		</>
	);
}
