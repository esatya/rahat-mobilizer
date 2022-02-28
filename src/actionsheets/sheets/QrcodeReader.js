import React, { useContext } from 'react';
import QrReader from 'react-qr-reader';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

import { AppContext } from '../../contexts/AppContext';
import { ActionSheetContext } from '../../contexts/ActionSheetContext';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import ActionSheet from './ActionSheet';
import { APP_CONSTANTS } from '../../constants';
import * as Service from '../../services';
import { getAuthSignature } from '../../utils';
const { SCAN_DELAY, SCANNER_PREVIEW_STYLE } = APP_CONSTANTS;

export default function Camera(props) {
	const history = useHistory();

	const { modalSize, showModal } = props;
	const { wallet, toggleFooter } = useContext(AppContext);
	const { showLoading, loading, setData, setActiveSheet } = useContext(ActionSheetContext);
	const { setBeneficiaryPhone, setBeneficiaryToken, setBeneficiaryDetails } = useContext(RegisterBeneficiaryContext);

	const handleScanError = err => {
		alert('Oops, scanning failed. Please try again');
	};

	const handleScanSuccess = async data => {
		if (data) {
			showLoading('Processing...');
			try {
				let phone =
					data.indexOf('+977') > -1
						? data.split('+977').pop().split('?')[0]
						: data.split(':').pop().split('?')[0];
				let amount = parseInt(data.split('amount=').pop());
				setBeneficiaryPhone(phone);
				if (amount) setBeneficiaryToken(amount);
				const signature = await getAuthSignature(wallet);
				const beneficiary = await Service.getBeneficiaryById(signature, phone);
				if (beneficiary) {
					setActiveSheet(null);
					setBeneficiaryToken(null);
					setBeneficiaryDetails({ name: beneficiary.name, address: beneficiary.address });
					return history.push('/beneficiary/token');
				}

				setActiveSheet(null);
				return history.push('/beneficiary/register');
			} catch (e) {
				setData({ phone: '', amount: '', chargeTxHash: null });
				Swal.fire('Error', 'Please make sure you scanned a valid QR code. Please try again.', 'error');
				showLoading(null);
				setActiveSheet(null);
			} finally {
				showLoading(null);
			}
		}
	};

	return (
		<ActionSheet
			title="Scan QR Code"
			size={modalSize || 'md'}
			showModal={showModal}
			buttonName="Enter manually"
			handleSubmit={() => {
				setActiveSheet(null);
				toggleFooter(true);
				return history.push('/beneficiary/verify');
			}}
		>
			<div className="text-center">
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '-50px',
						padding: '40px',
						minHeight: 200
					}}
				>
					{showModal && loading === null && (
						<QrReader
							delay={SCAN_DELAY}
							style={SCANNER_PREVIEW_STYLE}
							onError={handleScanError}
							onScan={handleScanSuccess}
						/>
					)}
				</div>
			</div>
		</ActionSheet>
	);
}
