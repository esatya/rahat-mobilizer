import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PackageList = ({ limit, packages = [] }) => {
	const [pkg, setPkg] = useState([]);
	useEffect(() => {
		(async () => {
			let pkgs = packages;
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
							<li key={p.tokenId}>
								<Link to={`/issue/beneficiary/package/${p.tokenId}`} className="item">
									{p.metadata.packageImgURI ? (
										<img
											src={`https://ipfs.rumsan.com/ipfs//${p.metadata.packageImgURI}`}
											alt=""
											className="package-img"
										/>
									) : (
										<div className="icon-box package-img bg-primary"></div>
									)}
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
