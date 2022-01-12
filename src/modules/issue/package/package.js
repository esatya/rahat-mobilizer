import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import Loading from '../../global/Loading';
import AppHeader from '../../layouts/AppHeader';
import { ActionSheetContext } from '../../../contexts/ActionSheetContext';
import { RahatService } from '../../../services/chain';
import DataService from '../../../services/db';
import { RegisterBeneficiaryContext } from '../../../contexts/registerBeneficiaryContext';
import * as Service from '../../../services';

export default function ChargePackage(props) {
	const { wallet, getNftPackages } = useContext(AppContext);
	const { loading } = useContext(ActionSheetContext);
	const { phone } = useContext(RegisterBeneficiaryContext);
	// const [loading, showLoading] = useState(null);
	const [tokenId, setTokenId] = useState([]);
	const [nft, setNft] = useState(null);
	const amountToIssue = 1;

	const issueTokenToBeneficiary = useCallback(async () => {
		const agency = await DataService.getDefaultAgency();
		const data = await Service.getMobilizerByWallet(wallet.address);
		const projectId = data.projects[0].project.id;

		const rahat = RahatService(agency.address, wallet);
		const amount = [amountToIssue];

		const remainingToken = await rahat.issueERC1155ToBeneficiary(projectId, 2345, [1], tokenId);
	}, [phone, wallet, tokenId]);

	useEffect(() => {
		async function getDetails() {
			let tId = props.match.params.tokenId;
			setTokenId([Number(tId)]);
			const details = await getNftPackages(tId);
			setNft(details);
		}
		getDetails();
	}, [props, getNftPackages]);

	return (
		<>
			<div>
				{/* <Loading message={loading} showModal={loading !== null} /> */}

				<AppHeader currentMenu="Issue Package" />
				{nft ? (
					<div id="appCapsule" className="full-height">
						<div className="section mt-2 mb-2">
							<div className="card mt-2">
								<div className="card-body">
									<div className="listed-detail mt-3">
										<div className="text-center">
											<img
												src={`https://ipfs.rumsan.com/ipfs//${nft.metadata.packageImgURI}`}
												width="100"
												height="100"
												alt="asset"
												className="image"
											/>
										</div>
									</div>

									<ul className="listview flush transparent simple-listview no-space mt-3">
										<li>
											<strong>Name:</strong>
											<span>{nft.name}</span>
										</li>
										<li>
											<strong>Symbol:</strong>
											<span>{nft.symbol}</span>
										</li>
										<li>
											<strong>Value in fiat:</strong>
											<span>
												<span>{nft.metadata.fiatValue}</span>
											</span>
										</li>
										<li>
											<strong>Description</strong>
											<span>{nft.metadata.description}</span>
										</li>
									</ul>

									<button
										type="button"
										id="btncharge"
										className="btn btn-lg btn-block btn-success mt-4 mb-3"
										onClick={issueTokenToBeneficiary}
									>
										Issue Package
									</button>
								</div>
							</div>
						</div>
					</div>
				) : (
					<Loading showModal={loading !== null} message={loading} />
				)}
			</div>
		</>
	);
}
