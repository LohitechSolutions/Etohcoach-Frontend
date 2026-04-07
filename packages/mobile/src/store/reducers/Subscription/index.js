import { ADD_SUBSCRIPTION_INFO, REMOVE_SUBSCRIPTION_INFO, UPDATE_SUBSCRIPTOIN_INFO, CANCEL_SUBSCRIPTION_INFO,SUBSCRIPTION_LOADING } from '../../constant';

const initialState = {
    isLoading: false,
    subscriptionInfo: {
        subscriptionId: '',
        transactionDate: '',
        status: false,
        expiryDate: '',
        userSubscription: "unsubscribed"
    },
    
    error: null,
};

export default function subscriptionReducer(state = initialState, action) {
    switch (action.type) {
        case SUBSCRIPTION_LOADING:
            return{
                ...state,
                isLoading:true,
                error:null,
                subscriptionInfo:{...state.subscriptionInfo}
            }
        case ADD_SUBSCRIPTION_INFO:
            return {
                ...state,
                error: null,
                isLoading: false,
                subscriptionInfo: action.payload,
            };
        case UPDATE_SUBSCRIPTOIN_INFO:
            return {
                ...state,
                error: null,
                isLoading: false,
                subscriptionInfo: {
                    subscriptionId: action.payload.subscriptionId,
                    transactionDate: action.payload.transactionDate,
                    status: action.payload.status,
                    expiryDate: action.payload.expiryDate,
                    userSubscription: action.payload.subscriptionId,
                },
            };
        case CANCEL_SUBSCRIPTION_INFO:
            return {
                ...state,
                isLoading: false,
                error: null,
                subscriptionInfo: {
                    subscriptionId: '',
                    transactionDate: '',
                    status: false,
                    expiryDate: '',
                    userSubscription: "unsubscribed"
                }
            };
        case REMOVE_SUBSCRIPTION_INFO:
            return {
                ...state,
                isLoading: false,
                error: null,
                subscriptionInfo: {
                    subscriptionId: '',
                    transactionDate: '',
                    status: false,
                    expiryDate: '',
                    userSubscription: "unsubscribed"
                }
            };
        default:
            return state;
    }
}
