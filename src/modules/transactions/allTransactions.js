import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import * as io5 from 'react-icons/io5';
import DataService from '../../services/db';
import List from './list';

export default function AllTransactions() {
	const { recentTx } = useContext(AppContext);
	const [tx, setTx] = useState([]);

	useEffect(() => {
		(async () => {
			setTx([]);
			let txs = recentTx.length ? recentTx : await DataService.listTx();
			setTx(txs);
		})();
	}, [recentTx]);

	return (
		<>
			<div id="appCapsule">
				<div className="section full">
					<div className="appHeader" style={{ backgroundColor: '#2b7ec1' }}>
						<div className="left">
							<button className=" btn btn-text headerButton ">
								<Link to="/" className="headerButton goBack">
									<io5.IoChevronBackOutline className="ion-icon" style={{ color: 'white' }} />
								</Link>
							</button>
						</div>
						<div className="pageTitle" style={{ color: 'white' }}>
							Transactions
						</div>
						<div className="right">
							<Link to="/" className="headerButton">
								<io5.IoHomeOutline className="ion-icon" style={{ color: 'white' }} />
							</Link>
						</div>
					</div>

					<div className="section pt-2">
						<ul className="listview image-listview flush">
							<List transactions={tx || []} />
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}
