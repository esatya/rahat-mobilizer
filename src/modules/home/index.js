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
import BeneficiaryRegister from '../beneficiary/register';
import BeneficiaryPhoto from '../beneficiary/photo';
import BeneficiaryId from '../beneficiary/idCard';
import BeneficiaryTokenIssue from '../beneficiary/issueToken';
import BeneficairyDetails from '../beneficiary/details';
import TxDetails from '../transactions/details';
import AllTransactions from '../transactions/allTransactions';
import GoogleBackup from '../misc/googleBackup';

function App() {
	const { initApp, wallet } = useContext(AppContext);

	useEffect(() => {
		(async () => {
			initApp();
		})();
	}, [initApp]);

	return (
		<>
			<Header />
			<Switch>
				<Route exact path="/" component={Main} />
				<PrivateRoute exact path="/tx" component={Transactions} wallet={wallet} />
				<PrivateRoute exact path="/tx/:hash" component={TxDetails} wallet={wallet} />
				<PrivateRoute exact path="/transaction" component={AllTransactions} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary" component={Beneficiary} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/register" component={BeneficiaryRegister} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/photo" component={BeneficiaryPhoto} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/idcard" component={BeneficiaryId} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/token" component={BeneficiaryTokenIssue} wallet={wallet} />
				<PrivateRoute exact path="/beneficiary/:phone" component={BeneficairyDetails} wallet={wallet} />
				<PrivateRoute exact path="/backup" component={BackupWallet} wallet={wallet} />
				<PrivateRoute exact path="/networks" component={NetworkSettings} wallet={wallet} />
				<PrivateRoute exact path="/profile" component={Profile} wallet={wallet} />
				<PrivateRoute exact path="/settings" component={Settings} wallet={wallet} />
				<PrivateRoute exact path="/profile" component={Profile} wallet={wallet} />
				<PrivateRoute exact path="/transfer" component={Transfer} wallet={wallet} />
				<PrivateRoute exact path="/transfer/:address" component={Transfer} wallet={wallet} />
				<PrivateRoute exact path="/google/backup" component={GoogleBackup} wallet={wallet} />
				<Route path="*" component={Main} />
			</Switch>

			<Footer />
		</>
	);
}

export default App;
