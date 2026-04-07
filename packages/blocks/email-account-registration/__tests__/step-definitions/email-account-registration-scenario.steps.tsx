import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";

import EmailAccountRegistration from "../../src/EmailAccountRegistration"

const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "email-account-registration-scenario"
  }

const feature = loadFeature('./__tests__/features/email-account-registration-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('Register Email Account', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register after confirming OTP', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()  
        });

        when('I navigate to the Registration Screen', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration
        });

        then('I can enter a first name with out errors', () => {
            let textInputComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'txtInputFirstName');
            textInputComponent.simulate('changeText', 'FIRST');

            let buttonComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'Background');
            buttonComponent.simulate('press')
        });


        then('I can enter a last name with out errors', () => {
            let textInputComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'txtInputLastName');
            textInputComponent.simulate('changeText', 'LAST');
        });
            
        then('I can enter a email with out errors', () => {
            let textInputComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'txtInputEmail');
            textInputComponent.simulate('changeText', 'a@bb.com');
        });

        then('I can enter a password with out errors', () => {
            let textInputComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'txtInputPassword');
            textInputComponent.simulate('changeText', 'password');
        });

        then('I can toggle the Password Show/Hide with out errors', () => {
            let buttonComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'btnPasswordShowHide');
            buttonComponent.simulate('press')
        });
        
        then('I can enter a confimation password with out errors', () => {
            let textInputComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'txtInputConfirmPassword');
            textInputComponent.simulate('changeText', 'password');
        });


        then('I can toggle the Confimation Password Show/Hide with out errors', () => {
            let buttonComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'btnPasswordShowHide');
            buttonComponent.simulate('press')
        });

        then('I can select the Submit button with out errors', () => {


            const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)          

            let buttonComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'btnLegalTermsAndCondition');
            buttonComponent.simulate('press')

            buttonComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'btnLegalPrivacyPolicy');
            buttonComponent.simulate('press')

            buttonComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'btnSignUp');
            buttonComponent.simulate('press')

            let magLogInSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            magLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), magLogInSucessRestAPI);
            magLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
                "meta": {
                    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                }
            });
            instance.createAccountApiCallId = magLogInSucessRestAPI
            runEngine.sendMessage("Unit Test", magLogInSucessRestAPI)  
            
            
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount();
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy();
        });

    });


    test('Empty First Name', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a Email', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with an empty First Name', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration;
        });

        then('Registration Should Fail', () => {
         expect(instance.createAccount()).toBe(false);
        });

        then('RestAPI will return an error', () => {
          
            let msgRegistrationErrorRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgRegistrationErrorRestAPI);
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "errors": [
                    {
                        "failed_login": "Login Failed"
                    }
                ]
            });

            instance.createAccountApiCallId = msgRegistrationErrorRestAPI
            runEngine.sendMessage("Unit Test", msgRegistrationErrorRestAPI)
        });
        
    });

    test('Invalid Email', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a Email', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with an Invalid Email', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration

            const msgValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgValidationAPI.messageId);
            msgValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "data": [
                    {
                        "email_validation_regexp": "^[a-zA-Z0-9.!\\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                        "password_validation_regexp": "^(?=.*[A-Z])(?=.*[#!@$&*?<>',\\[\\]}{=\\-)(^%`~+.:;_])(?=.*[0-9])(?=.*[a-z]).{8,}$",
                        "password_validation_rules": "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character (!@#$&*?<>',[]}{=-)(^%`~+.:;_)."
                    }
                ]
            });
            instance.validationApiCallId = msgValidationAPI.messageId
            runEngine.sendMessage("Unit Test", msgValidationAPI)

            const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)   
            instance.setState({firstName: "FIRST", lastName: "LAST", email: "a", password: "pass", reTypePassword: "pass"});

        });

        then('Registration Should Fail', () => {
         expect(instance.createAccount()).toBe(false);
        });

        then('RestAPI will return an error', () => {
          
            let msgRegistrationErrorRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgRegistrationErrorRestAPI);
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "errors": [
                    {
                        "failed_login": "Login Failed"
                    }
                ]
            });

            instance.createAccountApiCallId = msgRegistrationErrorRestAPI
            runEngine.sendMessage("Unit Test", msgRegistrationErrorRestAPI)
        });
        
    });
    

    test('Invalid Password', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a Email', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with an Invalid Password', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration

            const msgValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgValidationAPI.messageId);
            msgValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "data": [
                    {
                        "email_validation_regexp": "^[a-zA-Z0-9.!\\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                        "password_validation_regexp": "^(?=.*[A-Z])(?=.*[#!@$&*?<>',\\[\\]}{=\\-)(^%`~+.:;_])(?=.*[0-9])(?=.*[a-z]).{8,}$",
                        "password_validation_rules": "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character (!@#$&*?<>',[]}{=-)(^%`~+.:;_)."
                    }
                ]
            });
            instance.validationApiCallId = msgValidationAPI.messageId
            runEngine.sendMessage("Unit Test", msgValidationAPI)

            const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)   
            instance.setState({firstName: "FIRST", lastName: "LAST", email: "a@b.com", password: "pass", reTypePassword: "pass123"});
        });

        then('Registration Should Fail', () => {
         expect(instance.createAccount()).toBe(false);
        });

        then('RestAPI will return an error', () => {
          
            let msgRegistrationErrorRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgRegistrationErrorRestAPI);
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "errors": [
                    {
                        "failed_login": "Login Failed"
                    }
                ]
            });

            instance.createAccountApiCallId = msgRegistrationErrorRestAPI
            runEngine.sendMessage("Unit Test", msgRegistrationErrorRestAPI)
        });
        
    });


    test('Password and RePassword do not match', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a Email', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with Password and RePassword that do not match', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration 
            instance.setState({firstName: "FIRST", lastName: "LAST", email: "a@b.com", password: "password123!!", reTypePassword: "pass123"});

        });

        then('Registration Should Fail', () => {
         expect(instance.createAccount()).toBe(false);
        });

        then('RestAPI will return an error', () => {
          
            let msgRegistrationErrorRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgRegistrationErrorRestAPI);
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "errors": [
                    {
                        "failed_login": "Login Failed"
                    }
                ]
            });

            instance.createAccountApiCallId = msgRegistrationErrorRestAPI
            runEngine.sendMessage("Unit Test", msgRegistrationErrorRestAPI)
        });
        
    });

    test('Valid Registration', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a Email', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with all valid data', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration 
            instance.setState({firstName: "FIRST", lastName: "LAST", email: "a@b.com", password: "password123!!", reTypePassword: "password123!!"});
        });

        then('Registration Should Succeed', () => {
         expect(instance.createAccount()).toBe(true);
        });

        then('RestAPI will return token', () => {
            const magLogInSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            magLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), magLogInSucessRestAPI);
            magLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
                "meta": {
                    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                }
            });
            instance.createAccountApiCallId = magLogInSucessRestAPI
            runEngine.sendMessage("Unit Test", magLogInSucessRestAPI)
        });
        
    });
});
