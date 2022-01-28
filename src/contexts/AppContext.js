import React, { createContext, useReducer, useCallback } from 'react';
import { ethers } from 'ethers';
import appReduce from '../reducers/appReducer';
import APP_ACTIONS from '../actions/appActions';
import DataService from '../services/db';
import { TokenService } from '../services/chain';
import * as Service from '../services';
import { APP_CONSTANTS, DEFAULT_TOKEN } from '../constants';
const initialState = {
	contextLoading: true,
	address: null,
	agency: null,
	network: null,
	wallet: null,
	profile: null,
	hasWallet: true,
	hasBackedUp: true,
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

	const toggleLoading = useCallback((loading = false) => {
		dispatch({ type: APP_ACTIONS.SET_LOADING, data: loading });
	}, []);

	const initialize_index_db = useCallback(async () => {
		await DataService.addDefaultAsset(DEFAULT_TOKEN.SYMBOL, DEFAULT_TOKEN.NAME);
		await DataService.save('version', APP_CONSTANTS.VERSION);
	}, []);

	const initApp = useCallback(async () => {
		await initialize_index_db();
		let data = await DataService.initAppData();
		data.profile = await DataService.getProfile();
		data.hasWallet = data.wallet === null ? false : true;

		if (!data.hasWallet) {
			localStorage.removeItem('address');
		} else {
			let agency = await DataService.getDefaultAgency();
			let balance;
			try {
				if (!agency) throw Error('No agency');
				const blcs = await TokenService(agency.address).getBalance();
				balance = blcs;
			} catch (err) {
				balance = ethers.BigNumber.from(0);
			}
			data.balance = balance.toNumber();
			data.agency = agency;
		}

		dispatch({ type: APP_ACTIONS.INIT_APP, data });
		toggleLoading(false);
		return true;
	}, [toggleLoading, initialize_index_db]);

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
	function setHasBackedUp(hasBackup) {
		dispatch({ type: APP_ACTIONS.SET_HASWALLET, data: hasBackup });
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
				hasBackedUp: state.hasBackedUp,
				beneficiaryCount: state.beneficiaryCount,
				recentTx: state.recentTx,
				contextLoading: state.contextLoading,
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
				getNftPackages,
				setHasBackedUp
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
