const DEVICE_MODEL = "Unknown Device";
const DEVICE_MANUFACTURER = "Unknown Manufacturer";
const APP_VERSION = "1.0.0";
const SYSTEM_VERSION = "0";

const deviceInfo = {
  getModel: () => DEVICE_MODEL,
  getManufacturer: async () => DEVICE_MANUFACTURER,
  getVersion: () => APP_VERSION,
  getSystemVersion: () => SYSTEM_VERSION
};

export const getModel = deviceInfo.getModel;
export const getManufacturer = deviceInfo.getManufacturer;
export const getVersion = deviceInfo.getVersion;
export const getSystemVersion = deviceInfo.getSystemVersion;

export default deviceInfo;
