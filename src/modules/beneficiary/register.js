import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IoCloseCircle, IoHomeOutline } from 'react-icons/io5';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import { AppContext } from '../../contexts/AppContext';
import { getAuthSignature } from '../../utils';
import { useHistory, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import DataService from '../../services/db';
import AppHeader from '../layouts/AppHeader';
import { Link } from 'react-router-dom';

const RegisterBeneficiary = () => {
	const history = useHistory();
	const { phone, amount, setBeneficiaryDetails, setBeneficiaryPhone, addBeneficiary, name, address, email, govt_id } =
		useContext(RegisterBeneficiaryContext);
	const { wallet } = useContext(AppContext);
	const [beneficiaryData, setBeneficiaryData] = useState({ name: '', address: '', email: '', govt_id: '' });

	const updateBeneficiaryData = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		formData.forEach((value, key) => (data[key] = value));
		if (data.phone) setBeneficiaryPhone(data.phone);
		setBeneficiaryDetails(data);
	};

	const save = async e => {
		e.preventDefault();
		try {
			const signature = await getAuthSignature(wallet);
			const ben = await addBeneficiary(signature);
			if (!ben) {
				Swal.fire('Error', 'Invalid Beneficiary, Please enter valid details.', 'error');
				return;
			}
			let beneficiary = {
				name: name,
				address: address || null,
				phone: phone || null,
				govt_id: govt_id || null,
				createdAt: Date.now()
				//	id,name,location,phone,age,gender,familySize,address,createdAt
			};
			let db = await DataService.addBeneficiary(beneficiary);
			history.push('/beneficiary/token');
		} catch (e) {
			alert('Invalid beneficiary');
		}
	};

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

			<div id="appCapsule">
				<div class="section mt-2 text-center">
					<h1>Register Beneficiary</h1>
					<h4>Fill the form to register beneficiary</h4>
				</div>

				<div class="section mt-2 mb-5 p-3">
					<Form onSubmit={save}>
						<div className="card">
							<div className="card-body">
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Full Name</label>
										<Form.Control
											type="text"
											name="name"
											className="form-control"
											placeholder="Enter your full name"
											value={name}
											onChange={updateBeneficiaryData}
											required
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Phone #</label>
										<Form.Control
											type="number"
											className="form-control"
											name="phone"
											placeholder="Enter mobile number"
											value={phone}
											onChange={updateBeneficiaryData}
											onKeyDown={e => {
												if (['-', '+', 'e'].includes(e.key)) {
													e.preventDefault();
												}
											}}
											required
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Address</label>
										<Form.Control
											type="text"
											className="form-control"
											name="address"
											placeholder="Enter your address"
											value={address}
											onChange={updateBeneficiaryData}
											required
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Email Address</label>
										<Form.Control
											type="email"
											className="form-control"
											name="email"
											placeholder="Enter email"
											value={email}
											onChange={updateBeneficiaryData}
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Citizenship Id</label>
										<Form.Control
											type="text"
											className="form-control"
											name="govt_id"
											placeholder="Enter your address"
											value={govt_id}
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
								Continue
							</Button>
						</div>
					</Form>
				</div>
			</div>
		</>
	);
};

export default RegisterBeneficiary;
