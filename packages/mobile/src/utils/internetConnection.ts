import NetInfo from "@react-native-community/netinfo";

export function isConnected() {
    return new Promise<boolean>((resolve, reject) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                resolve(state.isConnected);
            }
            else {
                reject(state.isConnected);
            }
        });
        info()
    })
}

export function info() {
    return new Promise<boolean>((resolve, reject) => {
        NetInfo.addEventListener(state => {
            if (state.isConnected) {
                resolve(state.isConnected);
            } else {
                reject(state.isConnected);
            }
          });
    })
  }
