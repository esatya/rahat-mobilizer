import React from 'react';
import AppHeader from '../../layouts/AppHeader';
import { Link } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import PackageList from './packageList';
// import BeneficiaryDetail from '../beneficiaryDetail';

const BeneficiaryPackageIssue = props => {
	const packages = [
		{
			name: 'rice',
			tokenId: 'xcv2',
			balance: '34567'
		}
	];
	const beneficiary = '';

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
					{/* <BeneficiaryDetail name={name} phone={phone} remainingToken={remainingToken} photo={photo} /> */}

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
