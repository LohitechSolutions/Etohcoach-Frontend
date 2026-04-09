/** Stub in-app purchases for builds without native IAP. */

async function initConnection() {
  return true;
}

async function endConnection() {}

async function getAvailablePurchases() {
  return [];
}

async function getSubscriptions() {
  return [];
}

async function getProducts() {
  return [];
}

function purchaseUpdatedListener() {
  return () => {};
}

function purchaseErrorListener() {
  return () => {};
}

async function requestSubscription() {
  return null;
}

async function finishTransaction() {}

async function acknowledgePurchaseAndroid() {}

async function clearTransactionIOS() {}

async function flushFailedPurchasesCachedAsPendingAndroid() {}

const RNIapApi = {
  initConnection,
  endConnection,
  getAvailablePurchases,
  getSubscriptions,
  getProducts,
  purchaseUpdatedListener,
  purchaseErrorListener,
  requestSubscription,
  finishTransaction,
  acknowledgePurchaseAndroid,
  clearTransactionIOS,
  flushFailedPurchasesCachedAsPendingAndroid,
};

module.exports = RNIapApi;
module.exports.default = RNIapApi;
