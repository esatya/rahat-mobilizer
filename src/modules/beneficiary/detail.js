import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';

import { IoArrowDownOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { GiReceiveMoney, GiMoneyStack } from 'react-icons/gi';
import { BiError } from 'react-icons/bi';
import { Col, Row } from 'react-bootstrap';
import Moment from 'react-moment';
import DataService from '../../services/db';
import Image1 from '../../assets/images/pep.jpg';

const TxList = ({ limit, transactions = [] }) => {
	const history = useHistory();
	const [tx, setTx] = useState([]);

	const handleIssueButton = () => {
		history.push('/beneficiary');
	};

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
			<div id="appCapsule">
				<div className="section mt-1 mb-2">
					<div className="listed-detail mt-3">
						<div className="icon-wrapper">
							{/* <div className="iconbox">
								<ion-icon name="arrow-forward-outline"></ion-icon>
							</div> */}
							<img
								src={Image1}
								alt="img"
								className="image-block imaged rounded"
								style={{ height: '90px', width: '90px' }}
							/>
						</div>
						<h3 className="text-center mt-2">Mark bahadur thapa magar</h3>
					</div>

					<ul className="listview flush transparent simple-listview no-space mt-3">
						<li>
							<strong>Project</strong>
							<span>Sindhupalchowk Flood Relief</span>
						</li>
						<li>
							<strong>Gender</strong>
							<span>Male</span>
						</li>
						<li>
							<strong>Age</strong>
							<span>29</span>
						</li>
						<li>
							<strong>Address</strong>
							<span>Sindhupalchowk-2</span>
						</li>
						<li>
							<strong>Education</strong>
							<span>BE</span>
						</li>
						<li>
							<strong>Profession</strong>
							<span>Mechanical Engineer</span>
						</li>
						<li>
							<strong>Government ID number</strong>
							<span>21239</span>
						</li>
						<li>
							<strong>Group</strong>
							<span>Natural Calamities victim</span>
						</li>
						<li>
							<strong>Number of adults in family</strong>
							<span>4</span>
						</li>
						<li>
							<strong>Number of children in family</strong>
							<span>3</span>
						</li>
					</ul>
				</div>
				<div className="card" style={{ margin: '16px' }}>
					<div className="card-body">
						<form className="section " onSubmit={handleIssueButton}>
							<Row>
								<Col md="8" xs="8">
									<div className="form-group basic">
										<div className="input-wrapper">
											<label className="label" for="issue_token">
												Issue Token
											</label>
											<input
												type="number"
												className="form-control"
												id="issue_token"
												placeholder="Enter tokens"
											/>
										</div>
									</div>
								</Col>
								<Col md="4" xs="4">
									<div className="section mt-2">
										<button type="submit" className="btn btn-primary">
											Issue
										</button>
									</div>
								</Col>
							</Row>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default TxList;
