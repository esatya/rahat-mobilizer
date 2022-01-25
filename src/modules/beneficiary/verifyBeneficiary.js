import React, { useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IoCloseCircle, IoHomeOutline } from 'react-icons/io5';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import { AppContext } from '../../contexts/AppContext';
import { getAuthSignature } from '../../utils';
import { useHistory } from 'react-router-dom';
import AppHeader from '../layouts/AppHeader';
import { Link } from 'react-router-dom';
import * as Service from '../../services';

const VerifyBeneficiary = () => {
	const history = useHistory();
	const { phone, setBeneficiaryPhone } = useContext(RegisterBeneficiaryContext);
	const { wallet } = useContext(AppContext);

	const updateBeneficiaryData = e => {
		let formData = new FormData(e.target.form);
		let data = {};
		formData.forEach((value, key) => {
			data[key] = value;
			if (data[key] === '') data[key] = null;
		});
		setBeneficiaryPhone(data.phone);
	};

	const save = async e => {
		e.preventDefault();
		try {
			const signature = await getAuthSignature(wallet);
			const ben = await Service.getBeneficiaryById(signature, phone);
			if (ben) {
				history.push('/beneficiary/token');
				return;
			}
			history.push('/beneficiary/register');
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
				<h3 className="section mt-4">Verify Beneficiary</h3>
				<div className="section mt-3">
					<Form onSubmit={save}>
						<div className="card">
							<div className="card-body">
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label">Phone</label>
										<Form.Control
											type="number"
											className="form-control"
											name="phone"
											placeholder="Enter mobile number"
											value={phone ? phone : ''}
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

export default VerifyBeneficiary;
