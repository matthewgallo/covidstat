import { UPDATE_STATE } from './actions';

export const updateState = (scope, data) => {
	return {
		type: UPDATE_STATE,
		payload: {
			scope,
			data,
		},
	};
};