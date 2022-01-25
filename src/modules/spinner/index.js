import React from 'react';

function index({ message = 'Please Wait' }) {
	return (
		<div
			style={{
				height: '850px',
				position: 'absolute',
				color: '#ffffff',
				fontSize: 16,
				backgroundColor: '#000',
				opacity: 0.7,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1000,
				left: 0,
				top: 0,
				right: 0,
				bottom: 0
			}}
		>
			<div className="text-center">
				<img
					src="/assets/img/brand/icon-white-128.png"
					alt="icon"
					className="loading-icon"
					style={{ width: 30 }}
				/>
				<br />
				<div className="mt-1">{message}</div>
			</div>
		</div>
	);
}

export default index;
