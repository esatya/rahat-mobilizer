import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { IoWalletOutline } from 'react-icons/io5';
import { FaGoogleDrive, FaKey } from 'react-icons/fa';
import DataService from '../../services/db';
import PackageJson from '../../../package.json';

export default function Main() {
	const history = useHistory();
	const [restorePage, setRestorePage] = useState(false);

	const hasWallet = useCallback(async () => {
		const wallet = await DataService.getWallet();
		if (wallet != null) {
			history.push('/');
		}
	}, [history]);

	const toggleRestore = () => setRestorePage(prev => !prev);

	useEffect(hasWallet, [hasWallet]);

	return (
		<>
			<div className="item p-2">
				<div className="text-center p-3 mb-3">
					<img src="/assets/img/brand/logo-512.png" alt="alt" width="200" />
				</div>
				<h2>राहत अधिकृत परिचालनकर्ता</h2>
				<p>
					राहत कार्यक्रममा भाग लिनु भएकोमा धन्यवाद। कोरोना भाइरसको निषेधाज्ञाबाट पिडितहरुलाई राहतको धेरै खाँचो
					छ। देश विदेशका दाताबाट राहत बाडिएको छ। उहाँहरुको सहयोग खेरा नजान यो सिस्टम बनाइएको हो। यो आधुनिक
					सिस्टमबाट राहत बाड्न सहज र पारदर्सी हुन्छ। हजुर परिचालनकर्ताको लागि भनेर यो छुटै App बनाइएको हो। यो
					App को माध्यमबाट तपाइले राहत वितरण गर्नु सक्नुहुने छ।
				</p>
				<p>आउनुहोस तपाईंलाई Register गरौ। </p>
				{!restorePage && (
					<div className="p-2">
						<Link
							to="/setup/profile"
							id="btnSetupWallet"
							type="button"
							className="btn btn-lg btn-block btn-primary mt-3"
						>
							<IoWalletOutline className="ion-icon" aria-label="Restore Using Google" />
							Register as Social Mobilizer
						</Link>
						<div className="form-links mt-2">
							<div className="text-center">
								<strong>Already registered? </strong>
								<button className="btn btn-text p-0 ml-2" onClick={toggleRestore}>
									Restore
								</button>
							</div>
						</div>
					</div>
				)}
				{restorePage && (
					<div className="p-2">
						<Link to="/google/restore" className="btn btn-lg w-100 btn-warning mb-2">
							<FaGoogleDrive className="mr-2" size={'1.3em'} />
							Restore from Google Drive
						</Link>

						<Link to="/mnemonic/restore" className="btn btn-lg w-100  btn-primary ">
							<FaKey className="mr-2" size={'1.3em'} />
							Restore from Mnemonics
						</Link>
						<div className="form-links mt-2">
							<div className="text-center w-100">
								<button className="btn btn-text" onClick={toggleRestore}>
									Back
								</button>
							</div>
						</div>
					</div>
				)}
				<div className="text-center mt-4">
					<small>Version: {PackageJson.version}</small>
				</div>
			</div>
		</>
	);
}
