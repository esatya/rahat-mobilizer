import React, { useEffect, useState, useContext } from 'react';
import Moment from 'react-moment';

import AppHeader from '../../layouts/AppHeader';
import DataService from '../../../services/db';
import { AppContext } from '../../../contexts/AppContext';

export default function Main(props) {
	const { hash, tokenId } = props.match.params;
	const { getNftPackages } = useContext(AppContext);

	const [tx, setTx] = useState({});
	const [nft, setNft] = useState(null);
	const [amount, setAmount] = useState(0);
	useEffect(() => {
		async function getDetails() {
			const details = await getNftPackages(tokenId);
			const {
				metadata: { fiatValue }
			} = details;
			setAmount(fiatValue);
			setNft(details);
		}
		getDetails();
	}, [tokenId, getNftPackages]);

	useEffect(() => {
		(async () => {
			const t = await DataService.getTx(hash);
			const ben = await DataService.getBeneficiary(t.to);
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
					<div className="text-center">
						<img
							src={`https://ipfs.rumsan.com/ipfs//${nft?.metadata.packageImgURI}`}
							width="100"
							height="100"
							alt="asset"
							className="image"
						/>
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
							<h3 className="m-0">{amount}</h3>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
}
