import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { RiUserAddFill } from 'react-icons/ri';
import { GrGroup } from 'react-icons/gr';
import { isOffline } from '../../utils';
import ChargeActionSheet from '../../actionsheets/Charge';
import { ActionSheetContext } from '../../contexts/ActionSheetContext';
import { AppContext } from '../../contexts/AppContext';
import { IoSettingsSharp } from 'react-icons/io5';

export default function UnlockedFooter() {
	const { setActiveSheet } = useContext(ActionSheetContext);
	const { hideFooter } = useContext(AppContext);
	return (
		<>
			<ChargeActionSheet />

			{hideFooter ? (
				''
			) : (
				<div className="footer-unlocked">
					<div className="appBottomMenu">
						<Link to="/beneficiary" className="item">
							<div className="col">
								<GrGroup className="ion-icon" />
								<strong>Beneficiaries</strong>
							</div>
						</Link>
						<a
							href="#home"
							className="item"
							onClick={() => {
								if (isOffline()) return;
								setActiveSheet('qrcode-reader');
							}}
						>
							<div className="col">
								<div className="action-button large">
									<RiUserAddFill className="ion-icon" />
								</div>
							</div>
						</a>
						<Link to="/settings" className="item">
							<div className="col">
								<IoSettingsSharp className="ion-icon" />
								<strong>Settings</strong>
							</div>
						</Link>
					</div>
				</div>
			)}
		</>
	);
}
