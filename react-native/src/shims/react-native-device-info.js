const DEVICE_MODEL = "Unknown Device";
const DEVICE_MANUFACTURER = "Unknown Manufacturer";
const APP_VERSION = "1.0.0";
const SYSTEM_VERSION = "0";

const deviceInfo = {
  getModel: () => DEVICE_MODEL,
  getManufacturer: async () => DEVICE_MANUFACTURER,
  getVersion: () => APP_VERSION,
  getSystemVersion: () => SYSTEM_VERSION,
};

module.exports = deviceInfo;
module.exports.default = deviceInfo;
module.exports.getModel = deviceInfo.getModel;
module.exports.getManufacturer = deviceInfo.getManufacturer;
module.exports.getVersion = deviceInfo.getVersion;
module.exports.getSystemVersion = deviceInfo.getSystemVersion;
