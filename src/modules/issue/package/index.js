import React from 'react';
// import { ChargeContextProvider } from '../../../contexts/ChargeContext';
import Package from './package';

function index(props) {
	const pkg = {
		name: 'Rice',
		symbol: 'RC',
		description: 'grain of rice',
		value: '234',
		imageUri: ''
	};
	return (
		// <ChargeContextProvider>
		<Package pkg={pkg} />
		// </ChargeContextProvider>
	);
}

export default index;
