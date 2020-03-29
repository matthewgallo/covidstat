import { UPDATE_STATE } from '../actions';

export default function rootReducer(state = {}, action) {
	let newState;
	switch (action.type) {
		case UPDATE_STATE:
			newState = {
				...state,
			};
			if (action.payload && action.payload.scope) {
				newState[action.payload.scope] = {
					...newState[action.payload.scope],
					...action.payload.data,
				};
			}
			return newState;
		default:
			return state;
	}
}
