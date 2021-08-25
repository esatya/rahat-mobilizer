import APP_ACTIONS from '../actions/beneficiaryActions';

const AppReducer = (state, action) => {
	switch (action.type) {
		case APP_ACTIONS.SET_BENEFICIARY_DETAILS:
			return {
				...state,
				name: action.data.name,
				gender: action.data.gender,
				dob: action.data.dob,
				agency: action.data.agency,
				email: action.data.email,
				address: action.data.address,
				govt_id: action.data.govt_id,
				project: action.data.project,
				extras: {
					age: action.data.age,
					profession: action.data.profession,
					education: action.data.education,
					family_members: action.data.family_members,
					adult: action.data.adult,
					child: action.data.child,
					group: action.data.group
				}
			};

		case APP_ACTIONS.SET_PHONE:
			return {
				...state,
				phone: action.phone
			};

		case APP_ACTIONS.SET_TOKEN:
			return {
				...state,
				token: action.token
			};

		case APP_ACTIONS.SET_PHOTO:
			return {
				...state,
				photo: action.photo
			};

		case APP_ACTIONS.SET_ID_IMAGE:
			return {
				...state,
				govt_id_image: action.idImage
			};

		case APP_ACTIONS.SET_LOADING:
			return {
				...state,
				loading: action.loading
			};

		case APP_ACTIONS.RESET:
			return {
				...state,
				...action.data
			};

		default:
			return state;
	}
};

export default AppReducer;
