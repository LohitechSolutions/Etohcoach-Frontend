/** Stub IAP — explicit CommonJS exports for Metro/Hermes `import {}` and `import * as RNIap`. */
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

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
  return function remove() {};
}

function purchaseErrorListener() {
  return function remove() {};
}

async function requestSubscription() {
  return null;
}

async function requestPurchase() {
  return null;
}

async function finishTransaction() {}

async function acknowledgePurchaseAndroid() {}

async function clearTransactionIOS() {}

async function flushFailedPurchasesCachedAsPendingAndroid() {}

async function consumePurchaseAndroid() {}

async function validateReceiptIos() {
  return {};
}

async function validateReceiptAndroid() {
  return {};
}

async function getPendingPurchasesIOS() {
  return [];
}

async function deepLinkToSubscriptions() {}

exports.initConnection = initConnection;
exports.endConnection = endConnection;
exports.getAvailablePurchases = getAvailablePurchases;
exports.getSubscriptions = getSubscriptions;
exports.getProducts = getProducts;
exports.purchaseUpdatedListener = purchaseUpdatedListener;
exports.purchaseErrorListener = purchaseErrorListener;
exports.requestSubscription = requestSubscription;
exports.requestPurchase = requestPurchase;
exports.finishTransaction = finishTransaction;
exports.acknowledgePurchaseAndroid = acknowledgePurchaseAndroid;
exports.clearTransactionIOS = clearTransactionIOS;
exports.flushFailedPurchasesCachedAsPendingAndroid =
  flushFailedPurchasesCachedAsPendingAndroid;
exports.consumePurchaseAndroid = consumePurchaseAndroid;
exports.validateReceiptIos = validateReceiptIos;
exports.validateReceiptAndroid = validateReceiptAndroid;
exports.getPendingPurchasesIOS = getPendingPurchasesIOS;
exports.deepLinkToSubscriptions = deepLinkToSubscriptions;

const defaultExport = {
  initConnection,
  endConnection,
  getAvailablePurchases,
  getSubscriptions,
  getProducts,
  purchaseUpdatedListener,
  purchaseErrorListener,
  requestSubscription,
  requestPurchase,
  finishTransaction,
  acknowledgePurchaseAndroid,
  clearTransactionIOS,
  flushFailedPurchasesCachedAsPendingAndroid,
  consumePurchaseAndroid,
  validateReceiptIos,
  validateReceiptAndroid,
  getPendingPurchasesIOS,
  deepLinkToSubscriptions,
};

exports.default = defaultExport;
