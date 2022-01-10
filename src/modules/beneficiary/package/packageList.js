import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

const PackageList = ({ limit, packages = [], beneficiary }) => {
	const [pkg, setPkg] = useState([]);
	useEffect(() => {
		(async () => {
			let pkgs = packages;
			//	let pkgs = packages.length ? packages : await DataService.listNft();
			if (limit) pkgs = pkgs.slice(0, limit);

			setPkg(pkgs);
		})();
	}, [packages, limit]);

	return (
		<>
			<ul className="listview flush transparent image-listview">
				{pkg.length > 0 &&
					pkg.map(p => {
						return (
							<li>
								<Link to={`/issue/${beneficiary}/package/${p.tokenId}`} className="item">
									<div className="icon-box bg-primary">
										<ion-icon
											name="card-outline"
											role="img"
											className="md hydrated"
											aria-label="card outline"
										></ion-icon>
									</div>
									<div key={p.tokenId} className="in">
										{p.name}
										<span className="text-success">{p.balance}</span>
									</div>
								</Link>
							</li>
						);
					})}
			</ul>
		</>
	);
};

export default PackageList;
