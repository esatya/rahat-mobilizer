import React from 'react';

// import DataService from '../../services/db';
import AppHeader from '../layouts/AppHeader';

export default function Index() {
	return (
		<>
			<AppHeader currentMenu="Profile" />
			<div id="appCapsule">
				<div className="section mt-5 text-center align-middle">
					<h2>Please contact administrator to change your profile.</h2>
					<span>team@rumsan.com</span>
				</div>
			</div>
		</>
	);
}
