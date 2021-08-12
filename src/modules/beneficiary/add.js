import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowDownOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { GiReceiveMoney, GiMoneyStack } from 'react-icons/gi';
import { BiError } from 'react-icons/bi';
import Moment from 'react-moment';
import DataService from '../../services/db';

const TxList = ({ limit, transactions = [] }) => {
	const [tx, setTx] = useState([]);

	useEffect(() => {
		(async () => {
			let txs = transactions.length ? transactions : await DataService.listTx();
			if (limit) txs = txs.slice(0, limit);
			for (let t of txs) {
				if (t.type === 'charge') {
					t.name = `Charge to ${t.from}`;
					t.icon = (
						<div className="icon-box bg-success">
							<GiReceiveMoney className="ion-icon" />
						</div>
					);
				}
				if (t.type === 'send') {
					t.name = 'Send Tokens';
					t.icon = (
						<div className="icon-box bg-warning">
							<IoArrowForwardOutline className="ion-icon" />
						</div>
					);
				}
				if (t.type === 'receive') {
					t.name = 'Received Tokens';
					t.icon = (
						<div className="icon-box bg-primary">
							<IoArrowDownOutline className="ion-icon" />
						</div>
					);
				}
				if (t.type === 'redeem') {
					t.name = 'Redeem Tokens';
					t.icon = (
						<div className="icon-box bg-primary">
							<GiMoneyStack className="ion-icon" />
						</div>
					);
				}
				if (t.status === 'error' || t.status === 'fail') {
					t.icon = (
						<div className="icon-box bg-danger">
							<BiError className="ion-icon" />
						</div>
					);
				}
			}
			setTx(txs);
		})();
	}, [transactions, limit]);

	return (
		<>
			<ul className="listview image-listview flush">
				{tx.length > 0 &&
					tx.map(tx => {
						return (
							<li key={tx.hash}>
								<Link to={`/tx/${tx.hash}`} className="item">
									{tx.icon}
									<div className="in">
										<div>
											<div className="mb-05">
												<strong>{tx.name}</strong>
											</div>
											<div className="text-xsmall">
												<Moment date={tx.timestamp} format="YYYY/MM/DD hh:mm a" />
											</div>
										</div>
										{tx.type === 'send' ? (
											<span className="text-danger">{tx.amount}</span>
										) : (
											<span className="text-success">{tx.amount}</span>
										)}
									</div>
								</Link>
							</li>
						);
					})}
			</ul>
			<div id="appCapsule">
				<div className="section mt-1 mb-2">
					<div className="section-title">Add Beneficiary</div>
					<div className="card">
						<div className="card-body">
							<form>
								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="project">
											Project
										</label>
										<input
											type="text"
											className="form-control"
											id="project"
											placeholder="Enter project"
										/>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="name">
											Name
										</label>
										<input
											type="text"
											className="form-control"
											id="name"
											placeholder="Enter name"
										/>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="gender">
											Gender
										</label>
										<select
											className="form-control custom-select"
											id="gender"
											style={{ paddingLeft: '5px' }}
										>
											<option value="0">Select a gender</option>
											<option value="1">Male</option>
											<option value="2">Female</option>
											<option value="3">Other</option>
										</select>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="Age">
											Age
										</label>
										<input
											type="number"
											className="form-control"
											id="Age"
											placeholder="Enter age"
										/>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="address">
											Address
										</label>
										<input
											type="text"
											className="form-control"
											id="address"
											placeholder="Enter address"
										/>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="education">
											Education
										</label>
										<input
											type="text"
											className="form-control"
											id="education"
											placeholder="Enter education"
										/>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="profession">
											Profession
										</label>
										<input
											type="text"
											className="form-control"
											id="profession"
											placeholder="Enter profession"
										/>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="government_id_number">
											Government ID number
										</label>
										<input
											type="number"
											className="form-control"
											id="government_id_number"
											placeholder="Enter government id number"
										/>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="group">
											Group
										</label>
										<select
											className="form-control custom-select"
											id="group"
											style={{ paddingLeft: '5px' }}
										>
											<option value="0">Select a group</option>
											<option value="1">Differently Abled</option>
											<option value="2">Maternity</option>
											<option value="3">Senior Citizens</option>
											<option value="4">Covid Victim</option>
											<option value="5">Natural Calamities Victim</option>
											<option value="6">Under Privileged</option>
											<option value="7">Severe Health Issues</option>
											<option value="8">Single women</option>
											<option value="9">Orphan</option>
										</select>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="family_members">
											Number of family members: (0)
										</label>
										<div style={{ padding: '10px' }}>
											<div className="form-group basic">
												<div className="input-wrapper">
													<label className="label" for="adult">
														Adult
													</label>
													<input
														type="number"
														className="form-control"
														id="adult"
														placeholder="Enter number of adult"
													/>
												</div>
											</div>

											<div className="form-group basic">
												<div className="input-wrapper">
													<label className="label" for="child">
														Child
													</label>
													<input
														type="number"
														className="form-control"
														id="child"
														placeholder="Enter number of child"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="form-group basic">
									<div className="input-wrapper">
										<label className="label" for="issue_token">
											Issue Token
										</label>
										<input
											type="number"
											className="form-control"
											id="issue_token"
											placeholder="Enter tokens to be issued"
										/>
									</div>
								</div>

								<div className="section d-flex justify-content-center mt-2">
									<button type="button" className="btn btn-primary">
										SUBMIT
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TxList;
