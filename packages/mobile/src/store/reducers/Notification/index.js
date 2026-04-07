import { ADD_NOTIFICATION,REMOVE_NOTIFICATION } from '../../constant';

const initialState = {
    isLoading: false,
    data:[],
    error: null,
};

export default function notificationReducer(state = initialState, action) {
    switch (action.type) {
        
        case ADD_NOTIFICATION:
            return {
                ...state,
                error: null,
                isLoading: false,
                data: action.payload,
            };
        case REMOVE_NOTIFICATION:
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
