import React, { createContext, useReducer, useCallback } from 'react';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';
import DataService from '../services/db';
import { TokenService } from '../services/chain';
import * as Service from '../services';
import { APP_CONSTANTS, DEFAULT_TOKEN } from '../constants';

const initialState = {
	address: null,
	agency: null,
	network: null,
	wallet: null,
	profile: null,
	hasWallet: true,
	tokenBalance: 0,
	scannedEthAddress: '',
	scannedAmount: null,
	project: null,
	beneficiaryCount: 0,
	hideFooter: false,
	recentTx: []
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(appReduce, initialState);

	const initApp = useCallback(async () => {
		DataService.addDefaultAsset(DEFAULT_TOKEN.SYMBOL, DEFAULT_TOKEN.NAME);
		//TODO: in future check version and add action if the version is different.
		DataService.save('version', APP_CONSTANTS.VERSION);
		let data = await DataService.initAppData();
		data.profile = await DataService.getProfile();
		data.hasWallet = data.wallet === null ? false : true;
		if (!data.hasWallet) {
			localStorage.removeItem('address');
		} else {
			let agency = await DataService.getDefaultAgency();
			if (!agency) return;
			const balance = await TokenService(agency.address).getBalance();
			data.balance = balance.toNumber();
			data.agency = agency;
		}
		dispatch({ type: APP_ACTIONS.INIT_APP, data });
	}, []);

	async function setAgency(agency) {
		if (!agency) agency = await DataService.getDefaultAgency();
		dispatch({ type: APP_ACTIONS.SET_AGENCY, data: agency });
	}

	async function setTokenBalance(tokenBalance) {
		dispatch({ type: APP_ACTIONS.SET_BALANCE, data: tokenBalance });
	}

	const toggleFooter = useCallback(hideFooter => {
		dispatch({ type: APP_ACTIONS.TOGGLE_FOOTER, data: hideFooter });
	}, []);

	function setHasWallet(hasWallet) {
		dispatch({ type: APP_ACTIONS.SET_HASWALLET, data: hasWallet });
	}

	function setWallet(wallet) {
		dispatch({ type: APP_ACTIONS.SET_WALLET, data: wallet });
	}
	function setProject(project) {
		dispatch({ type: APP_ACTIONS.SET_PROJECT, data: project });
	}
	const setTotalBeneficiaries = useCallback(beneficiaryCount => {
		dispatch({ type: APP_ACTIONS.SET_TOTAL_BENEFICIARIES, data: beneficiaryCount });
	}, []);

	function setNetwork(network) {
		dispatch({ type: APP_ACTIONS.SET_NETWORK, data: network });
	}

	function saveScannedAddress(data) {
		dispatch({ type: APP_ACTIONS.SET_SCANNED_DATA, data });
	}

	const addRecentTx = useCallback(async tx => {
		dispatch({ type: APP_ACTIONS.ADD_RECENT_TX, data: tx });
	}, []);

	const listNftPackages = useCallback((projectId, signature) => {
		return Service.listNftPackages(projectId, signature);
	}, []);

	const getNftPackages = useCallback(tokenId => {
		return Service.getNftPackages(tokenId);
	}, []);

	return (
		<AppContext.Provider
			value={{
				agency: state.agency,
				tokenBalance: state.tokenBalance,
				address: state.address,
				scannedEthAddress: state.scannedEthAddress,
				scannedAmount: state.scannedAmount,
				hasWallet: state.hasWallet,
				network: state.network,
				wallet: state.wallet,
				project: state.project,
				hideFooter: state.hideFooter,
				beneficiaryCount: state.beneficiaryCount,
				recentTx: state.recentTx,
				initApp,
				setAgency,
				toggleFooter,
				setTokenBalance,
				saveScannedAddress,
				setHasWallet,
				setNetwork,
				setWallet,
				setProject,
				dispatch,
				addRecentTx,
				setTotalBeneficiaries,
				listNftPackages,
				getNftPackages
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
