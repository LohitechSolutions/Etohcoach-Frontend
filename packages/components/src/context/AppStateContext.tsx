import React, { Component } from "react";
import Context from "./context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_LANGUAGE = "English";
const APP_LANGUAGE = "appLanguage";

class StateProvider extends Component {
  state = {
    language: DEFAULT_LANGUAGE,
    isItOffline: false,
    languageDisplay: "English 🇬🇧"
  };

  setLanguage = (language: any) => {
      this.setState((prevState) => ({language}));
  }

  setIsItOffline = (isItOffline: any) => {
    this.setState((prevState) => ({isItOffline}));
}

  setLanguageToAsyncStorage = async (currentLanguage:any) => {
    console.log("setLanguageToAsyncStorage");
    console.log(currentLanguage, "LanguageToSet");
    await AsyncStorage.setItem(APP_LANGUAGE, currentLanguage);
    let langCode = "en";
    if(currentLanguage == "English" || currentLanguage == "en"){
      langCode = "en";
    }else if(currentLanguage == "Français" || currentLanguage == "fr"){
      langCode = "fr"; 
    }else if(currentLanguage == "Português" || currentLanguage == "pt" || currentLanguage == "Portuguese"){
      langCode = "pt"; 
    }else if(currentLanguage == "Italiano" || currentLanguage == "it" || currentLanguage == "Italian"){
      langCode = "it"; 
    }
    await AsyncStorage.setItem("languename", langCode);
    this.setState({ language: currentLanguage });
  }

  initLanguage = async () => {
    console.log("initLanguage");
    const currentLanguage = await AsyncStorage.getItem(APP_LANGUAGE);
    console.log(currentLanguage, "appLanguage from context/initLanguage")
    if(currentLanguage){  
      await this.setLanguageToAsyncStorage(currentLanguage);
    }else{
      let localeCode = DEFAULT_LANGUAGE;
      await this.setLanguageToAsyncStorage(localeCode);
    }
  }

  getTheFiles = async (item: any) => {
    const datafile:any = await AsyncStorage.getItem(item);
    return JSON.parse(datafile);
  }

  displayLanguage = async () => {
    const langues = await AsyncStorage.getItem("appLanguage");
    console.log(langues, "appLanguage from controller");
    if (langues == "English" || langues == "en") {
      this.setState({ languageDisplay: "English 🇬🇧" });
    } else if (langues == "Français" || langues == "fr") {
      this.setState({ languageDisplay: "Français 🇫🇷" });
    } else if (langues == "Português" || langues == "pt" || langues == "Portuguese") {
      this.setState({ languageDisplay: "Português 🇵🇹" });
    } else if (langues == "Italiano" || langues == "it" || langues == "Italian") {
      this.setState({ languageDisplay: "Italiano 🇮🇹" });
    }
  }

  render() {
    const { language ,isItOffline, languageDisplay} = this.state;
    const {initLanguage, setLanguage , setLanguageToAsyncStorage, setIsItOffline, getTheFiles,displayLanguage} = this;
    console.log("laguage", language);
    return (
      <Context.Provider
        value={{
          language,
          initLanguage,
          setLanguage,
          setIsItOffline,
          getTheFiles,
          isItOffline,
          displayLanguage,
          languageDisplay,
          setLanguageToAsyncStorage,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export { StateProvider };
