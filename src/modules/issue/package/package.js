import React from 'react';
// import Loading from '../../global/Loading';
import AppHeader from '../../layouts/AppHeader';

export default function ChargePackage(props) {
	// const [loading, showLoading] = useState(null);
	const { name, symbol, description, value, imageUri } = props.pkg;

	const handleChargeClick = () => {};

	return (
		<>
			{/* <Loading showModal={loading !== null} message={loading} /> */}
			<AppHeader currentMenu="Issue Package" />

			<div id="appCapsule" className="full-height">
				<div className="section mt-2 mb-2">
					<div className="card mt-2">
						<div className="card-body">
							<div className="listed-detail mt-3">
								<div className="text-center">
									<img src={imageUri} width="100" height="100" alt="asset" className="image" />
								</div>
							</div>

							<ul className="listview flush transparent simple-listview no-space mt-3">
								<li>
									<strong>Name:</strong>
									<span>{name}</span>
								</li>
								<li>
									<strong>Symbol:</strong>
									<span>{symbol}</span>
								</li>
								<li>
									<strong>Description</strong>
									<span>{description}</span>
								</li>
								<li>
									<strong>Value in fiat:</strong>
									<span>
										<span>{value}</span>
									</span>
								</li>
							</ul>

							<button
								type="button"
								id="btncharge"
								className="btn btn-lg btn-block btn-success mt-4 mb-3"
								onClick={handleChargeClick}
							>
								Issue Package
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
