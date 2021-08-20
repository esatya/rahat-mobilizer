import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IoCamera } from 'react-icons/io5';
import { BiReset } from 'react-icons/bi';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2';

import Loading from '../global/Loading';
import AppHeader from '../layouts/AppHeader';
import { Link } from 'react-router-dom';
import { IoChevronBackOutline, IoHomeOutline } from 'react-icons/io5';
import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';

export default function Main() {
	const history = useHistory();
	const [loading, showLoading] = useState(null);
	const [videoConstraints, setVideoConstraints] = useState({
		facingMode: 'environment',
		forceScreenshotSourceSize: true,
		screenshotQuality: 1,
		width: 1280,
		height: 720
	});
	const [previewImage, setPreviewImage] = useState('');
	const [showPageLoader, setShowPageLoader] = useState(true);
	const webcamRef = React.useRef(null);
	const { setBeneficiaryIdImage } = useContext(RegisterBeneficiaryContext);

	const capture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		setPreviewImage(imageSrc);
	};

	const save = async event => {
		event.preventDefault();
		try {
			setBeneficiaryIdImage(previewImage);
			history.push('/beneficiary/token');
		} catch (err) {
			Swal.fire('ERROR', err.message, 'error');
			showLoading(null);
		}
	};

	useEffect(() => {
		setVideoConstraints({
			facingMode: 'environment',
			forceScreenshotSourceSize: true,
			screenshotQuality: 1,
			width: 1280,
			height: 720
		});
		return function cleanup() {};
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowPageLoader(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			<AppHeader
				currentMenu="Beneficiaries"
				backButton={
					<Link to="/beneficiary/photo" className="headerButton goBack">
						<IoChevronBackOutline className="ion-icon" />
					</Link>
				}
				actionButton={
					<Link to="/" className="headerButton">
						<IoHomeOutline className="ion-icon" />
					</Link>
				}
			/>

			{showPageLoader ? (
				<div id="loader">
					<img src="/assets/img/brand/icon-white-128.png" alt="icon" className="loading-icon" />
				</div>
			) : (
				<>
					<Loading message={loading} showModal={loading !== null} />
					<div className="section mt-5 mb-5">
						<div className="card1">
							<div className="card-body text-center">
								<h3 className="mt-4">Take a picture of beneficiary ID card</h3>
								<span>Citizenship, Passport, License or National ID</span>

								{previewImage ? (
									<img
										alt="preview"
										src={previewImage}
										style={{
											borderRadius: '10px',
											width: '88%',
											height: '350px',
											border: '3px solid #958d9e',
											marginTop: '30px'
										}}
									/>
								) : (
									<div className="idCardWrapper mt-4">
										<Webcam
											audio={false}
											ref={webcamRef}
											height={720}
											width={1280}
											minScreenshotWidth={1024}
											minScreenshotHeight={720}
											screenshotFormat="image/png"
											videoConstraints={videoConstraints}
											className="idCardSnapper"
										/>
									</div>
								)}
							</div>
						</div>
						<div className="pl-5 pr-5">
							{previewImage ? (
								<div className="text-center">
									<button
										type="button"
										className="btn btn-lg btn-block btn-outline-primary mt-1"
										onClick={() => setPreviewImage(null)}
									>
										<BiReset className="ion-icon" />
										Retake Picture
									</button>
									<button
										type="button"
										className="btn btn-lg btn-block btn-success mt-3 mb-5"
										onClick={save}
									>
										Complete setup
									</button>
								</div>
							) : (
								<button
									type="button"
									className="btn btn-lg btn-block btn-primary mt-1"
									onClick={capture}
								>
									<IoCamera className="ion-icon" />
									Take Picture
								</button>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}
