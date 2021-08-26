import React, { useContext } from 'react';
import { Form, Button, Input } from 'react-bootstrap';
import { IoCloseCircle, IoHomeOutline } from 'react-icons/io5';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import { AppContext } from '../../contexts/AppContext';
import { getAuthSignature } from '../../utils';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import AppHeader from '../layouts/AppHeader';
import { Link } from 'react-router-dom';
import { GROUPS } from '../../constants';
import * as Service from '../../services';

const RegisterBeneficiary = () => {
	const history = useHistory();
	const {
		phone,
		setBeneficiaryDetails,
		setBeneficiaryPhone,
		name,
		address,
		address_temporary,
		age,
		email,
		govt_id,
		profession,
		education,
		family_members,
		adult,
		child,
		group
	} = useContext(RegisterBeneficiaryContext);
	const { wallet } = useContext(AppContext);

	const updateBeneficiaryData = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		formData.forEach((value, key) => {
			data[key] = value;
			if (data[key] === '') data[key] = null;
			// return (data[key] = value)
		});
		setBeneficiaryPhone(data.phone);
		setBeneficiaryDetails(data);
	};

	const save = async e => {
		e.preventDefault();
		try {
			const signature = await getAuthSignature(wallet);
			const ben = await Service.getBeneficiaryById(signature, phone);
			if (ben.data) {
				Swal.fire('Error', 'Beneficiary with given phone already exists', 'error');
				return;
			}
			history.push('/beneficiary/photo');
		} catch (e) {
			alert(e);
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
				<div className="section mt-2 text-center">
					<h2 className="mt-4">Register Beneficiary</h2>
					<span>Fill the form to register beneficiary</span>
				</div>

				<div className="section p-3">
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
										<label className="label">Phone</label>
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
										<label className="label">Age</label>
										<Form.Control
											type="number"
											className="form-control"
											name="age"
											placeholder="Enter your age"
											value={age}
											onChange={updateBeneficiaryData}
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" htmlFor="gender">
											Gender
										</label>
										<select className="form-control custom-select" id="gender">
											<option value="U">Select gender</option>
											<option value="M">Male</option>
											<option value="F">Female</option>
											<option value="O">Other</option>
										</select>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Permanent address</label>
										<Form.Control
											type="text"
											className="form-control"
											name="address"
											placeholder="Enter your permanent address"
											value={address}
											onChange={updateBeneficiaryData}
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Temporary address</label>
										<Form.Control
											type="text"
											className="form-control"
											name="address_temporary"
											placeholder="Enter your temporary address"
											value={address_temporary}
											onChange={updateBeneficiaryData}
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
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Education</label>
										<Form.Control
											type="text"
											name="education"
											className="form-control"
											placeholder="Enter your education"
											value={education}
											onChange={updateBeneficiaryData}
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Profession</label>
										<Form.Control
											type="text"
											name="profession"
											className="form-control"
											placeholder="Enter your profession"
											value={profession}
											onChange={updateBeneficiaryData}
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" htmlFor="group">
											Group
										</label>
										<select class="form-control custom-select" id="group">
											<option value="">--Select Group--</option>
											<option value={GROUPS.DIFFERENTLY_ABLED.value}>
												{GROUPS.DIFFERENTLY_ABLED.label}
											</option>
											<option value={GROUPS.MATERNITY.value}>{GROUPS.MATERNITY.label}</option>
											<option value={GROUPS.SENIOR_CITIZENS.value}>
												{GROUPS.SENIOR_CITIZENS.label}
											</option>
											<option value={GROUPS.COVID_VICTIM.value}>
												{GROUPS.COVID_VICTIM.label}
											</option>
											<option value={GROUPS.NATURAL_CLIMATE_VICTIM.value}>
												{GROUPS.NATURAL_CLIMATE_VICTIM.label}
											</option>
											<option value={GROUPS.UNDER_PRIVILAGED.value}>
												{GROUPS.UNDER_PRIVILAGED.label}
											</option>
											<option value={GROUPS.SEVERE_HEATH_ISSUES.value}>
												{GROUPS.SEVERE_HEATH_ISSUES.label}
											</option>
											<option value={GROUPS.SINGLE_WOMAN.value}>
												{GROUPS.SINGLE_WOMAN.label}
											</option>
											<option value={GROUPS.ORPHAN.value}>{GROUPS.ORPHAN.label}</option>
										</select>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Family members</label>
										<Form.Control
											type="number"
											className="form-control"
											name="family_members"
											placeholder="Enter number of family members"
											value={family_members}
											onChange={updateBeneficiaryData}
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Adults</label>
										<Form.Control
											type="number"
											className="form-control"
											name="adult"
											placeholder="Enter number of adults"
											value={adult}
											onChange={updateBeneficiaryData}
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>{' '}
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Child</label>
										<Form.Control
											type="number"
											className="form-control"
											name="child"
											placeholder="Enter number of children"
											value={child}
											onChange={updateBeneficiaryData}
										/>
										<i className="clear-input">
											<IoCloseCircle className="ion-icon" />
										</i>
									</div>
								</div>
							</div>
						</div>
						<Button type="submit" className="btn btn-lg btn-block btn-success mt-4">
							Continue
						</Button>
					</Form>
				</div>
			</div>
		</>
	);
};

export default RegisterBeneficiary;
