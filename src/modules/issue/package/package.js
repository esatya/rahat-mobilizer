import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../../../contexts/AppContext';
import Loading from '../../global/Loading';
import AppHeader from '../../layouts/AppHeader';
// import { ActionSheetContext } from '../../../contexts/ActionSheetContext';
import { RahatService } from '../../../services/chain';
import DataService from '../../../services/db';
import { RegisterBeneficiaryContext } from '../../../contexts/registerBeneficiaryContext';
import * as Service from '../../../services';
import { TRANSACTION_TYPES } from '../../../constants';
import Spinner from '../../spinner';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';

export default function ChargePackage(props) {
	const { wallet, getNftPackages } = useContext(AppContext);
	// const { loading } = useContext(ActionSheetContext);
	const { phone } = useContext(RegisterBeneficiaryContext);
	const [loading, showLoading] = useState(null);
	const history = useHistory();
	const [tokenId, setTokenId] = useState([]);
	const [nft, setNft] = useState(null);
	const amountToIssue = 1;

	const issueTokenToBeneficiary = useCallback(async () => {
		try {
			const agency = await DataService.getDefaultAgency();
			const data = await Service.getMobilizerByWallet(wallet.address);
			const projectId = data.projects[0].project.id;
			showLoading('Issuing Package...');
			const rahat = RahatService(agency.address, wallet);
			const amount = amountToIssue;

			const receipt = await rahat.issueERC1155ToBeneficiary(projectId, phone, [1], [tokenId]);
			const tx = {
				tokenId,
				hash: receipt.hash,
				type: TRANSACTION_TYPES.NFT,
				timestamp: Date.now(),
				amount: amount,
				to: phone,
				from: wallet.address,
				status: 'success'
			};
			await DataService.addTx(tx);
			showLoading(null);
			Swal.fire('Success', 'Tokens Issued to Beneficiary', 'success');
			history.push('/');
		} catch (err) {
			showLoading(null);
			Swal.fire('Error', 'Unable To Issue Token', 'error');
		}
	}, [phone, wallet, tokenId, history]);

	useEffect(() => {
		async function getDetails() {
			let tId = props.match.params.tokenId;
			setTokenId(Number(tId));
			const details = await getNftPackages(tId);
			setNft(details);
		}
		getDetails();
	}, [props, getNftPackages]);

	return (
		<>
			<div>
				{/* <Loading message={loading} showModal={loading !== null} /> */}

				{loading !== null && <Spinner message={loading} />}
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
