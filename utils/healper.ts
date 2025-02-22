import * as SecureStore from "expo-secure-store";

export function numberWithCommas(x:any) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
  }

  export function getDiscount(price:any,discount:any) {
    return ((discount/price).toFixed(3))*100;
    
  }

 export const tokenCache = {
    async getToken(key: string) {
      try {
        return SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    }
  };

  export const isValidPhoneNumber = (number: string) => {
    return /^\+?[\d\s-]{10,}$/.test(number);
  };

