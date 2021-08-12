import React, { createContext, useState, useReducer } from 'react';
import BenificiaryReduce from '../reducers/beneficiaryReducer';
import BENEFICIARY_ACTIONS from '../actions/beneficiaryActions';
import * as Service from '../services';
import DataService from '../services/db';

const initialState = {
	name: null,
	phone: null,
	gender: null,
	dob: null,
	agency: null,
	email: null,
	address: null,
	govt_id: null,
	photo: null,
	govt_id_image: null,
	token: null
};

export const RegisterBeneficiaryContext = createContext(initialState);
export const RegisterBeneficiaryContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(BenificiaryReduce, initialState);
	//const [data, updateData] = useState(initialState);

	const showLoading = msg => {
		//setState({ ...state, loading: msg });
		dispatch({ type: BENEFICIARY_ACTIONS.SET_LOADING, loading: msg });
	};

	const setBeneficiaryDetails = beneficiary => {
		dispatch({ type: BENEFICIARY_ACTIONS.SET_BENEFICIARY_DETAILS, data: beneficiary });
	};

	const setBeneficiaryPhone = phone => {
		dispatch({ type: BENEFICIARY_ACTIONS.SET_PHONE, phone: phone });
	};

	const setBeneficiaryToken = token => {
		dispatch({ type: BENEFICIARY_ACTIONS.SET_TOKEN, token: token });
	};

	const setBeneficiaryPhoto = photo => {
		dispatch({ type: BENEFICIARY_ACTIONS.SET_TOKEN, photo: photo });
	};

	const resetBeneficiary = () => {
		dispatch({ type: BENEFICIARY_ACTIONS.RESET, data: initialState });
	};

	const addBeneficiary = async signature => {
		const project = await DataService.getDefaultProject();
		return Service.registerBeneficiary(signature, { ...state, project_id: project.id });
	};

	// const initData = defaultData => {
	// 	let newData = Object.assign({}, defaultData);
	// 	updateData(newData);
	// 	return newData;
	// };

	return (
		<RegisterBeneficiaryContext.Provider
			value={{
				...state,
				setBeneficiaryDetails,
				setBeneficiaryPhone,
				setBeneficiaryPhoto,
				setBeneficiaryToken,
				resetBeneficiary,
				addBeneficiary
			}}
		>
			{children}
		</RegisterBeneficiaryContext.Provider>
	);
};
