import React, { useContext } from 'react';
import { QrcodeReader } from './sheets';
import { ActionSheetContext } from '../contexts/ActionSheetContext';

export default function ChargeAction(props) {
	const { activeSheet } = useContext(ActionSheetContext);

	return (
		<>
			<QrcodeReader showModal={activeSheet === 'qrcode-reader'} />
		</>
	);
}
