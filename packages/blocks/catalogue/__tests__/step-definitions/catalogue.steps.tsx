import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";

import React from "react";
import Catalogue from "../../src/Catalogue";
import AsyncStorage from "@react-native-async-storage/async-storage"
import exp from "constants";

const navigation = require("react-navigation");
const mockNavigate = jest.fn();

const screenProps = {
  navigation: {
    navigate: mockNavigate,
    dispatch: jest.fn(),
    goBack: jest.fn()
},
  id: "Catalogue",
};

const feature = loadFeature("./__tests__/features/catalogue-scenario.feature");

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to catalogue", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: Catalogue;

    given("I am a User loading catalogue", () => {
      exampleBlockA = shallow(<Catalogue {...screenProps} />);
    });

    when("I navigate to the catalogue", () => {
      instance = exampleBlockA.instance() as Catalogue;
    });

    then("catalogue will load with out errors", () => {
      expect(exampleBlockA).toBeTruthy();
      expect(exampleBlockA).toMatchSnapshot();
    });

  // then("I can select a button without error",()=>{

  //   const buttoncomponent=exampleBlockA.findWhere((node)=>node.prop("testID")=='bbb')
  //    buttoncomponent.simulate('press')
  //    expect(instance.props.navigation.navigate).tobe
     
  // })

  then('when clikcking on the filter icon',async()=>{
   let state= instance.state.isVisible
        expect(instance.state.isVisible).toBe(false)
    // console.log(state,"aaa checking in test")
  })


    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(exampleBlockA).toBeTruthy();
      expect(exampleBlockA).toMatchSnapshot();
    });
  });



});


