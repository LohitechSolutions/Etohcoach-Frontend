import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
// import {runEngine} from '../../../../framework/src/RunEngine'
// import {Message} from "../../../../framework/src/Message"

// import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import Filteritems from "../../src/Filteritems"
const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "Filteritems"
  }

const feature = loadFeature('./__tests__/features/filteritems-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to filteritems', ({ given, when, then }) => {
        let filterBlocks:ShallowWrapper;
        let instance:Filteritems; 

        given('I am a User loading filteritems', () => {
            filterBlocks = shallow(<Filteritems {...screenProps}/>)
            expect(filterBlocks).toBeTruthy();
            instance = filterBlocks.instance() as Filteritems;
        });

        when('I navigate to the filteritems', () => {
             instance = filterBlocks.instance() as Filteritems
        });

        then('filteritems will load with out errors', () => {
            expect(filterBlocks).toBeTruthy()
            expect(filterBlocks).toMatchSnapshot()
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(filterBlocks).toBeTruthy()
            expect(filterBlocks).toMatchSnapshot()
        });
    });


});
