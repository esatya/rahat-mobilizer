import React, { useContext } from 'react';
import QrReader from 'react-qr-reader';
import { useHistory, Redirect } from 'react-router-dom';

import Swal from 'sweetalert2';

import DataService from '../../services/db';
import { RahatService } from '../../services/chain';
import { AppContext } from '../../contexts/AppContext';
import { ActionSheetContext } from '../../contexts/ActionSheetContext';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';
import ActionSheet from './ActionSheet';
import { APP_CONSTANTS } from '../../constants';
import * as Service from '../../services';
import { getAuthSignature } from '../../utils';
import { SET_BENEFICIARY_DETAILS } from '../../actions/beneficiaryActions';
const { SCAN_DELAY, SCANNER_PREVIEW_STYLE } = APP_CONSTANTS;

export default function Camera(props) {
	const history = useHistory();

	const { modalSize, onHide, showModal } = props;
	const { wallet } = useContext(AppContext);
	const { showLoading, loading, setData, setActiveSheet } = useContext(ActionSheetContext);
	const { setBeneficiaryPhone, setBeneficiaryToken, setBeneficiaryDetails } = useContext(RegisterBeneficiaryContext);

	const handleScanError = err => {
		alert('Oops, scanning failed. Please try again');
	};

	const handleScanSuccess = async data => {
		if (data) {
			showLoading('Processing...');
			let test = data.split(':');
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
				// if (!amount) {
				// 	setData({ phone, amount: '' });
				// 	return setActiveSheet('charge-details');
				// }
				// const agency = await DataService.getDefaultAgency();
				// const rahat = RahatService(agency.address, wallet);
				// let receipt = await rahat.chargeCustomer(phone.toString(), amount);
				// setData({ phone, amount, chargeTxHash: receipt.transactionHash });
				// setActiveSheet('otp');
				setActiveSheet(null);
				return history.push('/beneficiary/register');
				//return <Redirect to="/beneficiary/register" />;
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
			onHide={onHide}
			buttonName="Enter manually"
			handleSubmit={() => {
				setActiveSheet(null);
				return history.push('/beneficiary/register');
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
