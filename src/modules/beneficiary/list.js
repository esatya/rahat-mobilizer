import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import DataService from '../../services/db';

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
		</>
	);
};

export default BenList;
