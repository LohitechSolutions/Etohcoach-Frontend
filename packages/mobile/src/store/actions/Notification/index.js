import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from "../../constant";

export const addNotification = params => (dispatch) => dispatch(addNotificationData(params));

const addNotificationData =(params)=> ({
    type  : ADD_NOTIFICATION,
    payload:params
})

export const removeNotification= ()=>(dispatch)=>dispatch(removeNotificationData());

const removeNotificationData =()=>({
    type:REMOVE_NOTIFICATION
})