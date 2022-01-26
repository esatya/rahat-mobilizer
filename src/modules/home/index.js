import React, { useEffect, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import PrivateRoute from './PrivateRoute';
import BackupWallet from '../wallet/backup/index';
import Footer from '../layouts/Footer';
import Header from '../layouts/Header';
import Main from './main';
import NetworkSettings from '../settings/network';
import Settings from '../settings';
import Profile from '../settings/profile';
import Transfer from '../transfer';
import Transactions from '../transactions';
import Beneficiary from '../beneficiary';
import VerifyBeneficiary from '../beneficiary/verifyBeneficiary';
import BeneficiaryRegister from '../beneficiary/register';
import BeneficiaryPhoto from '../beneficiary/photo';
import BeneficiaryId from '../beneficiary/idCard';
import BeneficiaryTokenIssue from '../beneficiary/issueToken';
import BeneficiaryPackageIssue from '../beneficiary/package';
import BeneficairyDetails from '../beneficiary/details';
import TxDetails from '../transactions/details';
import PackageTxDetails from '../transactions/Package';

import AllTransactions from '../transactions/allTransactions';
import GoogleBackup from '../misc/googleBackup';
import IssuePackage from '../issue/package';
import IssueToken from '../issue/token';

function App() {
	const { initApp, wallet } = useContext(AppContext);

	useEffect(initApp, [initApp]);

	return (
		<>
			<Header />
			<Switch>
				<Route exact path="/" component={Main} />
				<PrivateRoute exact path="/tx" component={Transactions} wallet={wallet} />
				<PrivateRoute exact path="/tx/:hash" component={TxDetails} wallet={wallet} />
				<PrivateRoute exact path="/tx/:hash/package/:tokenId" component={PackageTxDetails} wallet={wallet} />
				<PrivateRoute exact path="/transaction" component={AllTransactions} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary" component={Beneficiary} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/verify" component={VerifyBeneficiary} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/register" component={BeneficiaryRegister} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/photo" component={BeneficiaryPhoto} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/idcard" component={BeneficiaryId} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/token" component={BeneficiaryTokenIssue} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/package" component={BeneficiaryPackageIssue} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/:phone" component={BeneficairyDetails} wallet={wallet} />
				<PrivateRoute exact path="/backup" component={BackupWallet} wallet={wallet} />
				<PrivateRoute exact path="/networks" component={NetworkSettings} wallet={wallet} />
				<PrivateRoute exact path="/profile" component={Profile} wallet={wallet} />
				<PrivateRoute exact path="/settings" component={Settings} wallet={wallet} />
				<PrivateRoute exact path="/profile" component={Profile} wallet={wallet} />
				<PrivateRoute exact path="/transfer" component={Transfer} wallet={wallet} />
				<PrivateRoute exact path="/transfer/:address" component={Transfer} wallet={wallet} />
				<PrivateRoute exact path="/google/backup" component={GoogleBackup} wallet={wallet} />
				<PrivateRoute exact path="/issue/token" component={IssueToken} wallet={wallet} />
				<PrivateRoute
					exact
					path="/issue/beneficiary/package/:tokenId"
					component={IssuePackage}
					wallet={wallet}
				/>
				<Route path="*" component={Main} />
			</Switch>

			<Footer />
		</>
	);
}

export default App;
