import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { IoCamera, IoCameraReverse } from 'react-icons/io5';
import { BiReset } from 'react-icons/bi';
import Webcam from 'react-webcam';
import AppHeader from '../layouts/AppHeader';
import { Link } from 'react-router-dom';
import { IoChevronBackOutline, IoHomeOutline } from 'react-icons/io5';

import { RegisterBeneficiaryContext } from '../../contexts/registerBeneficiaryContext';

export default function Main() {
	const history = useHistory();
	const [videoConstraints, setVideoConstraints] = useState({
		facingMode: 'user',
		forceScreenshotSourceSize: true,
		screenshotQuality: 1,
		minScreenshotWidth: 1024
	});
	const [previewImage, setPreviewImage] = useState('');
	const { setBeneficiaryPhoto } = useContext(RegisterBeneficiaryContext);

	const webcamRef = React.useRef(null);
	const camContainerRef = React.useRef();
	//const { width, height } = useResize(camContainerRef);

	const capture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		// fetch(imageSrc)
		// 	.then(res => {
		// 		const result = res.blob();
		// 		resolve(result);
		// 	})
		// 	.catch(err => reject(err));
		setPreviewImage(imageSrc);
	};
	const handleFaceChange = () => {
		const { facingMode } = videoConstraints;
		const face = facingMode === 'environment' ? 'user' : 'environment';
		setVideoConstraints({ ...videoConstraints, facingMode: face });
	};

	const save = async event => {
		event.preventDefault();
		await setBeneficiaryPhoto(previewImage);
		history.push('/beneficiary/idcard');
	};

	const skip = async event => {
		event.preventDefault();
		history.push('/beneficiary/idcard');
	};

	useEffect(() => {
		setVideoConstraints({
			facingMode: 'user',
			forceScreenshotSourceSize: true,
			screenshotQuality: 1,
			minScreenshotWidth: 1024
		});
		return function cleanup() {};
	}, []);

	return (
		<>
			<AppHeader
				currentMenu="Beneficiaries"
				backButton={
					<Link to="/beneficiary/register" className="headerButton goBack">
						<IoChevronBackOutline className="ion-icon" />
					</Link>
				}
				actionButton={
					<Link to="/" className="headerButton">
						<IoHomeOutline className="ion-icon" />
					</Link>
				}
			/>
			<div id="appCapsule">
				<div className="section">
					<div className="card1">
						<div className="card-body text-center" ref={camContainerRef}>
							<button type="button" class="btn btn-outline-primary" onClick={skip}>
								Skip
							</button>
							<h2 className="mt-2">Take a photo of beneficiary</h2>
							<span>Remember to smile :-)</span>

							{previewImage ? (
								<img className="video-flipped circleSelfie mt-4" alt="preview" src={previewImage} />
							) : (
								<div className="selfieWrapper mt-3">
									<Webcam
										audio={false}
										ref={webcamRef}
										className="circleSelfie"
										minScreenshotWidth={1024}
										minScreenshotHeight={720}
										screenshotFormat="image/png"
										videoConstraints={videoConstraints}
									/>

									<button
										type="button"
										className="btn btn-text-primary rounded shadowed mt-2 mb-1"
										onClick={handleFaceChange}
									>
										&nbsp; &nbsp; <IoCameraReverse className="ion-icon" />
									</button>
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
									Continue to next step
								</button>
							</div>
						) : (
							<button type="button" className="btn btn-lg btn-block btn-primary mb-5" onClick={capture}>
								<IoCamera className="ion-icon" />
								Take Picture
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
