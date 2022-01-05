import React from 'react';
import Avatar from '../../../assets/images/Man.png';

const BeneficiaryDetail = props => {
	const { name, phone, remainingToken, photo } = props;
	return (
		<div className="card mt-2">
			<div className="card-header">Beneficiary details</div>
			<div className="card-body">
				<div className="mt-1 text-center">
					{photo ? (
						<img className="video-flipped selfie" alt="preview" src={photo} />
					) : (
						<img className="video-flipped selfie " alt="preview" src={Avatar} width="40px" height="40px" />
					)}
				</div>
				<ul className="listview flush transparent simple-listview no-space mt-3">
					<li>
						<strong>Name</strong>
						<span>{name}</span>
					</li>
					<li>
						<strong>Phone</strong>
						<span style={{ overflow: 'hidden' }}>{phone}</span>
					</li>
					<li>
						<strong>Token Balance</strong>
						<h3 className="m-0">{remainingToken}</h3>
					</li>
				</ul>
			</div>
		</div>
	);
};
export default BeneficiaryDetail;
