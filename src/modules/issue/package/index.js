import React from 'react';
import Package from './package';

function index() {
	const pkg = {
		name: 'Rice',
		symbol: 'RC',
		description: 'grain of rice',
		value: '234',
		imageUri: ''
	};
	return <Package pkg={pkg} />;
}

export default index;
