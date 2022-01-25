import React, { useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IoCloseCircle, IoHomeOutline } from 'react-icons/io5';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import { useHistory } from 'react-router-dom';
import AppHeader from '../layouts/AppHeader';
import { Link } from 'react-router-dom';
import { GROUPS } from '../../constants';

const RegisterBeneficiary = () => {
	const history = useHistory();
	const {
		setBeneficiaryDetails,
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
		child
	} = useContext(RegisterBeneficiaryContext);

	const updateBeneficiaryData = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		formData.forEach((value, key) => {
			data[key] = value;

			if (data[key] === '') data[key] = null;
			// return (data[key] = value)
		});
		setBeneficiaryDetails(data);
	};

	const save = async e => {
		e.preventDefault();
		history.push('/beneficiary/photo');
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
				<h3 className="section mt-4">Register Beneficiary</h3>
				<div className="section mt-3">
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
											value={name ? name : ''}
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
										<label className="label">Age</label>
										<Form.Control
											type="number"
											className="form-control"
											name="age"
											placeholder="Enter age"
											value={age ? age : ''}
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
											placeholder="Enter permanent address"
											value={address ? address : ''}
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
											placeholder="Enter temporary address"
											value={address_temporary ? address_temporary : ''}
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
											value={email ? email : ''}
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
											placeholder="Enter address"
											value={govt_id ? govt_id : ''}
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
											placeholder="Enter education"
											value={education ? education : ''}
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
											placeholder="Enter profession"
											value={profession ? profession : ''}
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
										<select className="form-control custom-select" id="group">
											<option value="">--Select Group--</option>
											<option
												value={
													GROUPS.DIFFERENTLY_ABLED.value ? GROUPS.DIFFERENTLY_ABLED.value : ''
												}
											>
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
											value={family_members ? family_members : ''}
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
											value={adult ? adult : ''}
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
											value={child ? child : ''}
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
