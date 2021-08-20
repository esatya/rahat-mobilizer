import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { IoArrowDownOutline, IoArrowForwardOutline } from 'react-icons/io5';
// import { GiReceiveMoney, GiMoneyStack } from 'react-icons/gi';
// import { BiError } from 'react-icons/bi';
// import Moment from 'react-moment';

import DataService from '../../services/db';
import { useHistory } from 'react-router-dom';

const beneficiaryData = [
	{
		id: 1,
		name: 'KP Sharma Oli',
		phone: '9808345150'
	},
	{
		id: 2,
		name: 'Gokul Baskota',
		phone: '9818756e70'
	},
	{
		id: 3,
		name: 'Pep gradiola',
		phone: '9845731500'
	},
	{
		id: 4,
		name: 'Leonardo',
		phone: '9808347000'
	}
];

const BenList = ({ limit, beneficiaries = [] }) => {
	const [ben, setBen] = useState([]);

	useEffect(() => {
		(async () => {
			let bens = beneficiaries.length ? beneficiaries : await DataService.listBeneficiaries();
			if (limit) bens = bens.slice(0, limit);
			// for (let b of bens) {

			// 		b.name = `Charge to ${t.from}`;
			// 		t.icon = (
			// 			<div className="icon-box bg-success">
			// 				<GiReceiveMoney className="ion-icon" />
			// 			</div>
			// 		);

			// }
			setBen(bens);
		})();
	}, [beneficiaries, limit]);

	return (
		<>
			<ul className="listview image-listview flush">
				{ben.length > 0 &&
					ben.map(ben => {
						return (
							<li key={ben.phone}>
								<Link to={`/beneficiary/${ben.phone}`} className="item">
									<div className="in">
										<div>
											<div className="mb-05">
												<strong>{ben.name}</strong>
											</div>
											<div className="text-xsmall">
												{/* <Moment date={ben.createdAt} format="YYYY/MM/DD hh:mm a" /> */}
												{ben.phone}
											</div>
										</div>
										{/* {tx.type === 'send' ? (
											<span className="text-danger">{tx.amount}</span>
										) : (
											<span className="text-success">{tx.amount}</span>
										)} */}
									</div>
								</Link>
							</li>
						);
					})}
			</ul>

			<div id="appCapsule" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
				<div className="section mt-1 mb-2">
					<div className="wide-block p-0">
						<div className="table-responsive">
							<table className="table">
								<thead>
									<tr>
										<th scope="col">#</th>
										<th scope="col">Name</th>
										<th scope="col">Phone</th>
									</tr>
								</thead>
								<tbody>
									{beneficiaryData &&
										beneficiaryData.map(data => {
											return (
												<tr>
													<th scope="row">{data.id}</th>
													<Link to={`/beneficiary/detail`}>
														<td>{data.name}</td>
													</Link>
													<td>{data.phone}</td>
												</tr>
											);
										})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BenList;
