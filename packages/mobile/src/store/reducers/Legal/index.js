import { ADD_POLICY,ADD_TERMS } from '../../constant';

const initialState = {
    isLoading: false,
    terms:undefined,
    policy:undefined,
    error: null,
};

export default function legalReducer(state = initialState, action) {
    switch (action.type) {
        
        case ADD_TERMS:
            return {
                ...state,
                error: null,
                isLoading: false,
                terms: action.payload,
                policy:state.policy,
            };
        case ADD_POLICY:
            return {
                ...state,
                error: null,
                isLoading: false,
                terms:state.terms,
                policy:action.payload,
            };
        default:
            return state;
    }
}
