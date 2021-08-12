import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IoCloseCircle } from 'react-icons/io5';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import { AppContext } from '../../contexts/AppContext';
import { getAuthSignature } from '../../utils';
import { RahatService } from '../../services/chain';
import DataService from '../../services/db';
import Swal from 'sweetalert2';
import { useHistory, Redirect } from 'react-router-dom';

const RegisterBeneficiary = () => {
	const history = useHistory();

	const { phone, setBeneficiaryToken, addBeneficiary, name, token, resetBeneficiary } =
		useContext(RegisterBeneficiaryContext);
	const { wallet } = useContext(AppContext);
	const [beneficiaryData, setBeneficiaryData] = useState({ name: '', address: '', email: '', govt_id: '' });
	const [loading, showLoading] = useState(null);

	const updateBeneficiaryData = e => {
		let formData = new FormData(e.target.form);
		// let data = {};
		// formData.forEach((value, key) => (data[key] = value));
		// console.log({ data });
		// if (data.phone) setBeneficiaryPhone(data.phone);
		let tokenAmount = formData.get('token');
		setBeneficiaryToken(tokenAmount);
	};

	const save = async e => {
		e.preventDefault();
		showLoading('Issuing Tokens..');
		try {
			const agency = await DataService.getDefaultAgency();
			const project = await DataService.getDefaultProject();
			const signature = await getAuthSignature(wallet);
			const rahat = RahatService(agency.address, wallet);
			let receipt = await rahat.issueToken(project.id, phone, token);
			const tx = {
				hash: receipt.transactionHash,
				type: 'issued',
				timestamp: Date.now(),
				amount: token,
				to: phone,
				from: wallet.address,
				status: 'success'
			};

			await DataService.addTx(tx);
			if (receipt) showLoading(null);
			Swal.fire('Success', 'Tokens Issued to Beneficiary', 'success');
			resetBeneficiary();
			history.push('/');
		} catch (e) {
			showLoading(null);
			Swal.fire('Error', 'Unable To Issue Token', 'error');
			throw Error(e);
		}
		//return addBeneficiary(signature);
	};

	return (
		<>
			{loading !== null && (
				<div
					style={{
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
				<div class="section mt-2 text-center">
					<h1>Issue Token</h1>
					<h4>Enter Amount to Issue Token</h4>
				</div>

				<div class="section mt-2 mb-5 p-3">
					<Form onSubmit={save}>
						<div className="card">
							<div className="card-body">
								<div className="form-group basic">
									<div className="input-wrapper">
										<Form.Control
											type="number"
											name="token"
											className="form-control"
											placeholder="Issue Tokens"
											value={token}
											onChange={updateBeneficiaryData}
											required
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
							</div>
						</div>
						<div className="p-2">
							<Button type="submit" className="btn btn-lg btn-block btn-success mt-3">
								Issue Token
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
};

export default RegisterBeneficiary;
