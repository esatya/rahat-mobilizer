import React, { useState, useEffect, useContext, useCallback } from 'react';
import AppHeader from '../../layouts/AppHeader';
import { Link } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import PackageList from './packageList';
import {
	// getPackageDetails,
	getMobilizerByWallet
} from '../../../services';
// import DataService from '../../../services/db';
import { AppContext } from '../../../contexts/AppContext';
// import { RegisterBeneficiaryContext } from '../../../contexts/registerBeneficiaryContext';
// import { RahatService } from '../../../services/chain';

const FETCH_LIMIT = 50;

const BeneficiaryPackageIssue = () => {
	const { wallet, listNftPackages } = useContext(AppContext);
	// const { phone } = useContext(RegisterBeneficiaryContext);
	// const phone = '2222';

	// const fakePackages = [
	// 	{
	// 		name: 'rice',
	// 		tokenId: 'xcv2',
	// 		balance: '34567'
	// 	}
	// ];
	const beneficiary = '';
	const [packages, setPackages] = useState([]);
	const [packageList, setPackageList] = useState([]);
	const [projectId, setProjectId] = useState('');

	const checkMobilizerStatus = async () => {
		if (!wallet) return;
		const data = await getMobilizerByWallet(wallet.address);
		const pId = data.projects[0].project.id;
		setProjectId(pId);
	};

	const fetchPackageList = useCallback(async () => {
		const query = { limit: FETCH_LIMIT };
		const d = await listNftPackages(projectId, query);
		if (d && d.data) {
			setPackageList(d.data);
		}
	}, [listNftPackages, projectId]);

	// useEffect(() => {
	// 	(async () => {
	// 		setPackages([]);
	// 		const agency = await DataService.getDefaultAgency();
	// 		const rahat = RahatService(agency.address, wallet);
	// 		let totalERC1155Balance = await rahat.getTotalERC1155Balance(phone);

	// 		let tokenIds = totalERC1155Balance.tokenIds.map(t => t.toNumber());

	// 		tokenIds.forEach(async (el, index) => {
	// 			const data = await getPackageDetails(el);
	// 			const balance = totalERC1155Balance.balances[index].toNumber();

	// 			const pkg = {
	// 				tokenId: data.tokenId,
	// 				name: data.name,
	// 				symbol: data.symbol,
	// 				description: data.metadata && data.metadata.description ? data.metadata.description : '',
	// 				value: data.metadata && data.metadata.fiatValue ? data.metadata.fiatValue : '',
	// 				imageUri: data.metadata && data.metadata.packageImgURI ? data.metadata.packageImgURI : '',
	// 				balance
	// 			};
	// 			setPackages(packages => [...packages, pkg]);
	// 		});
	// 	})();
	// });
	useEffect(() => {
		checkMobilizerStatus();
		fetchPackageList();
	}, []);

	return (
		<>
			<AppHeader
				currentMenu="Issue Package"
				actionButton={
					<Link to="/" className="headerButton">
						<IoHomeOutline className="ion-icon" />
					</Link>
				}
			/>

			<div id="appCapsule">
				<div className="section">
					<div className="card mt-3">
						<div className="card-header">Packages</div>
						<div className="card-body">
							<PackageList packages={packages} beneficiary={beneficiary} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default BeneficiaryPackageIssue;
