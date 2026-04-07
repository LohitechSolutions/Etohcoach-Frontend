import { ADD_USER_DATA, REMOVE_USER_DATA } from "../../constant";

export const addUserProfile = params => (dispatch) => dispatch(addUserProfileData(params));

const addUserProfileData =(params)=> ({
    type  : ADD_USER_DATA,
    payload:params
})

export const removeUserProfile= ()=>(dispatch)=>dispatch(removeUserProfileData());

const removeUserProfileData =()=>({
    type:REMOVE_USER_DATA
})