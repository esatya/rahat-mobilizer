import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IoCloseCircle } from 'react-icons/io5';
import { RegisterBeneficiaryContext } from '../../../contexts/registerBeneficiaryContext';
import { AppContext } from '../../../contexts/AppContext';
import AppHeader from '../../layouts/AppHeader';
import { Link } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAuthSignature } from '../../../utils';
// import * as Service from '../../../services';
import DataService from '../../../services/db';
import { RahatService } from '../../../services/chain';
import * as Services from '../../../services';
import { TRANSACTION_TYPES } from '../../../constants';
import Spinner from '../../spinner';

const Index = () => {
	const history = useHistory();
	const {
		phone,
		setBeneficiaryToken,
		token,
		resetBeneficiary
		// name,
		// addBeneficiary,
		// address,
		// govt_id,
		// photo,
		// govt_id_image
	} = useContext(RegisterBeneficiaryContext);
	const { wallet } = useContext(AppContext);
	const [loading, showLoading] = useState(null);

	const updateBeneficiaryData = e => {
		let formData = new FormData(e.target.form);
		let tokenAmount = formData.get('token');
		setBeneficiaryToken(tokenAmount);
	};

	const save = async e => {
		e.preventDefault();
		showLoading('Issuing Tokens..');
		try {
			const signature = await getAuthSignature(wallet);
			// const benExists = await Service.getBeneficiaryById(signature, phone);
			const agency = await DataService.getDefaultAgency();
			const project = await DataService.getDefaultProject();
			const rahat = RahatService(agency.address, wallet);

			// if (!benExists) {
			// 	const ben = await addBeneficiary(signature);
			// 	if (!ben) {
			// 		Swal.fire('Error', 'Invalid Beneficiary, Please enter valid details.', 'error');
			// 		return;
			// 	}
			// 	let beneficiary = {
			// 		name: name,
			// 		address: address || null,
			// 		phone: phone || null,
			// 		govt_id: govt_id || null,
			// 		photo: photo,
			// 		govt_id_image: govt_id_image,
			// 		createdAt: Date.now()
			// 		//	id,name,location,phone,age,gender,familySize,address,createdAt
			// 	};
			// 	await DataService.addBeneficiary(beneficiary);
			// }

			let receipt = await rahat.issueERC20ToBeneficiary(project.id, phone, token);

			const tx = {
				hash: receipt.hash,
				type: TRANSACTION_TYPES.TOKEN,
				timestamp: Date.now(),
				amount: token,
				to: phone,
				from: wallet.address,
				status: 'success'
			};

			await DataService.addTx(tx);
			await Services.smsTokenIssue(signature, { token, phone });
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
			<AppHeader
				currentMenu="Issue Token"
				actionButton={
					<Link to="/" className="headerButton">
						<IoHomeOutline className="ion-icon" />
					</Link>
				}
			/>
			{loading !== null && <Spinner message={loading} />}
			<div id="appCapsule">
				<div className="section mt-2">
					<div className="card mt-3">
						<div className="card-body">
							<Form onSubmit={save}>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" htmlFor="issueAmount">
											Amount to Issue:
										</label>
										<Form.Control
											type="number"
											name="token"
											className="form-control"
											placeholder="Enter tokens"
											value={token}
											onChange={updateBeneficiaryData}
											required
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="mt-1">
									<small>Important: Please double check the amount before issuing</small>
								</div>
								<Button type="submit" className="btn btn-lg btn-block btn-success mt-4 mb-2">
									Issue Token
								</Button>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Index;
