import React from 'react';
import { Link } from 'react-router-dom';
import { IoSendOutline } from 'react-icons/io5';

import AppHeader from '../layouts/AppHeader';
import BenList from './list';

export default function Main() {
	return (
		<>
			<AppHeader
				currentMenu="Beneficiaries"
				actionButton={
					<Link to="/beneficiary/register" className="headerButton">
						<IoSendOutline className="ion-icon" />
					</Link>
				}
			/>
			<div id="appCapsule">
				<div className="section full">
					<BenList />
				</div>
			</div>
		</>
	);
}
