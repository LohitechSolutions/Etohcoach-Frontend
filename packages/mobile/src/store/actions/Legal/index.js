import { ADD_POLICY, ADD_TERMS } from "../../constant";

export const addTerms = params => (dispatch) => dispatch(addTermsData(params));

const addTermsData =(params)=> ({
    type  : ADD_TERMS,
    payload:params
})

export const addPrivacy = params => (dispatch) => dispatch(addPrivacyData(params));

const addPrivacyData =(params)=> ({
    type  : ADD_POLICY,
    payload:params
})