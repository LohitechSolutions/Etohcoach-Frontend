import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setAsyncData(Key: any, storageData: any) {
  // console.log("key from dashboard", Key);
  // console.log("key from dashboard data", storageData);
  let data = await AsyncStorage.setItem(Key, JSON.stringify(storageData));
  return data;
}

export async function getAsyncDataKeys(Key: any) {
  let data = [] as any;
  data = await AsyncStorage.getItem(Key);
  let dataObj = JSON.parse(data);
  console.log('dataObj ', dataObj);
  return dataObj;
}
