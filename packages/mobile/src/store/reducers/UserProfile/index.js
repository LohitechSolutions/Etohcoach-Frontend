import { ADD_USER_DATA,REMOVE_USER_DATA } from '../../constant';

const initialState = {
    isLoading: false,
    data:[],
    error: null,
};

export default function userProfileReducer(state = initialState, action) {
    switch (action.type) {
        
        case ADD_USER_DATA:
            return {
                ...state,
                error: null,
                isLoading: false,
                data: action.payload,
            };
        case REMOVE_USER_DATA:
            return {
                ...state,
                error: null,
                isLoading: false,
                data:[],
            };
        default:
            return state;
    }
}
