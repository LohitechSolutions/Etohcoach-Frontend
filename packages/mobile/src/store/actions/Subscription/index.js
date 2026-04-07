import { ADD_SUBSCRIPTION_INFO,REMOVE_SUBSCRIPTION_INFO,UPDATE_SUBSCRIPTOIN_INFO,CANCEL_SUBSCRIPTION_INFO } from "../../constant";

export const addSubscription = params => (dispatch) => dispatch(addSubscriptionInfo(params));
const addSubscriptionInfo = (params)=>({
    type:ADD_SUBSCRIPTION_INFO,
    payload:params
  })
  
export const updateSubscription = params => (dispatch)=>dispatch(updateSubscriptionInfo(params));
const updateSubscriptionInfo = (params)=>({
    type:UPDATE_SUBSCRIPTOIN_INFO,
    payload:params
})

export const cancelSubscription = () => (dispatch)=>dispatch(cancelSubscriptoinInfo());
const cancelSubscriptoinInfo = ()=>({
    type:CANCEL_SUBSCRIPTION_INFO,
})

export const removeSubscription = () => (dispatch)=>dispatch(removeSubscriptoinInfo());
const removeSubscriptoinInfo = ()=>({
    type:REMOVE_SUBSCRIPTION_INFO,
})