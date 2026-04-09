/**
 * Stub for Expo Go — no RNLocalize native module.
 * API subset used by the app (ClientGlobals / i18n-js).
 */
function findBestAvailableLanguage(languageTags) {
  if (!languageTags || !languageTags.length) {
    return undefined;
  }
  return { languageTag: languageTags[0], isRTL: false };
}

function getLocales() {
  return [
    { countryCode: "US", languageTag: "en-US", languageCode: "en", isRTL: false },
  ];
}

function getNumberFormatSettings() {
  return { decimalSeparator: ".", groupingSeparator: "," };
}

function getCalendar() {
  return "gregorian";
}

function getCountry() {
  return "US";
}

function getCurrencies() {
  return ["USD"];
}

function getTemperatureUnit() {
  return "celsius";
}

function getTimeZone() {
  return "UTC";
}

function uses24HourClock() {
  return false;
}

function usesMetricSystem() {
  return true;
}

function addEventListener() {
  return { remove: () => {} };
}

module.exports = {
  findBestAvailableLanguage,
  getLocales,
  getNumberFormatSettings,
  getCalendar,
  getCountry,
  getCurrencies,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesMetricSystem,
  addEventListener,
};
