import RNFS from 'react-native-fs';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { PermissionsAndroid, Platform } from 'react-native';

export async function downloadFiles(
  url: string,
  path: string,
  fileName: string,
) {
  
  const fileType = url?.split('.').pop();
  const filePathInCache = `${RNFS.CachesDirectoryPath}/${fileName}`;
  const filePathInAlbum = `${path}/${fileName}.${fileType}`;
  let permissionResult;
    if (Platform.OS === 'android') {
      permissionResult = await requestWritePermissionAndroid();
    } else if (Platform.OS === 'ios') {
      permissionResult = await requestWritePermissionIOS();
    }
console.log('permission result',permissionResult)
  if (permissionResult === RESULTS.GRANTED) {
    try {
      // console.log('entered try block')
      await RNFS.mkdir(path);
      // console.log('path created',)
      const imageBlob:any = await downloadFileData(url);
      // console.log('imageBlob',imageBlob)
      const base64String = await blobToBase64(imageBlob);
      // console.log('base 64 string',base64String)
      if(Platform.OS=='android'){
      await RNFS.writeFile(filePathInCache, base64String ,'base64');
      await RNFS.copyFile(filePathInCache, filePathInAlbum);
    }else{
      await RNFS.writeFile(filePathInAlbum, base64String ,'base64');
    }
      console.log('filePath for album',filePathInAlbum)
      if(Platform.OS=='android'){
      await RNFS.scanFile(filePathInAlbum);
    }
      console.log('Downloaded Path',filePathInAlbum)
      return filePathInAlbum;
    } catch (error) {
      // if(RNFS.)
      console.log('catch error for download',error)
      throw new Error(`Failed to download file: ${error}`);
    }
  }else{

    throw new Error('Storage permission not granted');
  }
}

async function downloadFileData(url: string): Promise<string> {
  const response = await fetch(url);
  const data:any = await response.blob();
  return data;
}   


// function blobToBase64(blob: Blob): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       // reader.readAsDataURL(blob);

//       reader.onloadend = () => {
//         console.log('enter blobtobase',reader)
//         const base64String = reader.result?.toString().split(',')[1];
//         console.log('base 64 generator',base64String)
//         if (base64String) {
//           resolve(base64String);
//         } else {
//             throw new Error(`File download failed with status code ${reader?.statusCode}`);
//         }
//     } 
//   })

// }
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onerror = (e) => reject(fileReader.error);
    fileReader.onloadend = (e) => {
      const dataUrl = fileReader.result as string;
      // remove "data:mime/type;base64," prefix from data url
      const base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
      resolve(base64);
    };
    fileReader.readAsDataURL(blob);
  });
}


  async function requestWritePermissionAndroid(): Promise<string> {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to save files',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted;
    } catch (error) {
      console.warn(error);
      return '';
    }
  }
  
  async function requestWritePermissionIOS(): Promise<string> {
    try {
      const permissionStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      return permissionStatus;
    } catch (error) {
      console.warn(error);
      return '';
    }
  }
  
