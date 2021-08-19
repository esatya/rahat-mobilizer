import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';

import AppHeader from '../layouts/AppHeader';
import DataService from '../../services/db';

export default function Main(props) {
	const hash = props.match.params.hash;

	const [tx, setTx] = useState({});

	useEffect(() => {
		(async () => {
			const t = await DataService.getTx(hash);
			const ben = await DataService.getBeneficiary(t.to);
			console.log(ben);

			t.hash = `${t.hash.slice(0, 10)}....`;
			t.beneficiaryName = ben.name;
			setTx(t);
		})();
	}, [hash]);

	return (
		<>
			<AppHeader currentMenu="Tx Details" />
			<div id="appCapsule" className="full-height">
				<div className="section mt-2 mb-2">
					<div className="listed-detail mt-3">
						<div className="icon-wrapper">{tx.icon}</div>
						<h3 className="text-center mt-2">{tx.name}</h3>
					</div>

					<ul className="listview flush transparent simple-listview no-space mt-3">
						<li>
							<strong>Status</strong>
							<span
								className={tx.status === 'success' ? 'text-success' : 'text-danger'}
								style={{ textTransform: 'capitalize' }}
							>
								{tx.status}
							</span>
						</li>
						<li>
							<strong>Beneficiary Phone</strong>
							<span>{tx.to}</span>
						</li>
						<li>
							<strong>Beneficiary Name</strong>
							<span>{tx.beneficiaryName}</span>
						</li>
						<li>
							<strong>Tx Hash</strong>
							<span style={{ overflow: 'hidden' }}>{tx.hash}</span>
						</li>
						<li>
							<strong>Date</strong>
							<span>
								<Moment date={tx.timestamp} format="YYYY/MM/DD hh:mm a" />
							</span>
						</li>
						<li>
							<strong>Amount</strong>
							<h3 className="m-0">{tx.amount}</h3>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
}
