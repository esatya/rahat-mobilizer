import React, { useState, useEffect, useContext, useCallback } from 'react';
import AppHeader from '../../layouts/AppHeader';
import { Link } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import PackageList from './packageList';
import {
	getMobilizerByWallet
	//  getProjectBeneficiaries
} from '../../../services';
import { AppContext } from '../../../contexts/AppContext';
import { getAuthSignature } from '../../../utils';

const BeneficiaryPackageIssue = () => {
	const { wallet, listNftPackages } = useContext(AppContext);
	const [packageList, setPackageList] = useState([]);
	const [projectId, setProjectId] = useState('');

	const checkMobilizerStatus = useCallback(async () => {
		if (!wallet) return;
		const data = await getMobilizerByWallet(wallet.address);
		const pId = data.projects[0].project.id;
		setProjectId(pId);
	}, [wallet]);

	// const fetchBeneficiary = useCallback(async () => {
	// 	const signature = await getAuthSignature(wallet);
	// 	const beneficiary = await getProjectBeneficiaries(signature, projectId);
	// 	if (beneficiary && beneficiary.data) {
	// 		setBeneficiary(beneficiary.data);
	// 	}
	// }, [wallet, projectId]);

	const fetchPackageList = useCallback(async () => {
		const signature = await getAuthSignature(wallet);
		const d = await listNftPackages(projectId, signature);
		if (d && d.data) {
			setPackageList(d.data);
		}
	}, [listNftPackages, wallet, projectId]);

	useEffect(() => {
		checkMobilizerStatus();
		fetchPackageList();
	}, [checkMobilizerStatus, fetchPackageList]);

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
							<PackageList packages={packageList} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default BeneficiaryPackageIssue;
