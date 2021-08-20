import React from 'react';
import '../../assets/custom/styles.css';

export default function Transaction(props) {
	const { component } = props;
	return (
		<>
			<div className="section-heading">
				<h2 className="title">Transactions</h2>
				<a href="app-transactions.html" className="link">
					View All
				</a>
			</div>
			<div className="transactions">
				{component &&
					component.map(data => {
						return (
							<a href="app-transaction-detail.html" className="item" key={data.id}>
								<div className="detail">
									<img
										src={data.url}
										alt="img"
										className="image-block imaged image-size w48 rounded"
									/>
									<div>
										<strong>{data.name}</strong>
										<p>{data.project}</p>
									</div>
								</div>
								<div className="right">
									<div className="price text-primary">${data.token}</div>
								</div>
							</a>
						);
					})}
			</div>
		</>
	);
}
