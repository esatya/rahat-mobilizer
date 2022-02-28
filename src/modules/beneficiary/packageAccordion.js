import React, { useState } from 'react';

function PackageAccordian({ packages }) {
	const [isOpen, setOpen] = useState(true);
	return (
		<div className="accordion def_background" id="accordionExample2">
			<div className="item">
				<div className="accordion-header">
					<button
						className={isOpen ? 'btn' : 'btn collapsed'}
						onClick={() => setOpen(prev => !prev)}
						type="button"
						data-toggle="collapse"
						data-target="#accordion01"
					>
						<strong>Issued Packages</strong>
					</button>
				</div>
				<div
					id="accordion01"
					className={isOpen ? 'accordion-body collapse show' : 'accordion-body collapse '}
					data-parent="#accordionExample2"
				>
					{packages &&
						packages.length > 0 &&
						packages.map((pkg, index) => (
							<div className="accordion-content" key={index}>
								<ul className="listview flush transparent image-listview">
									<li>
										<div className="d-flex align-items-center">
											{pkg.packageImgURI ? (
												<img
													src={`https://ipfs.rumsan.com/ipfs//${pkg.packageImgURI}`}
													alt=""
													className="package-img"
												/>
											) : (
												<div className="icon-box package-img bg-primary"></div>
											)}
											{pkg.name}
										</div>
										<div className="in">
											Fiat Worth: &nbsp;
											<span className="text-success">{pkg?.fiatValue}</span>
										</div>
									</li>
								</ul>
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

export default PackageAccordian;
