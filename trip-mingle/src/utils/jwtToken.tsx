//Buffer Line

import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token != null) {
      console.log("have Token");
      console.log(token);

      return token;
    } else {
      console.log("No Token");

      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("token", token);
    getToken();
  } catch (error) {
    console.log(error);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("token");
    getToken();
  } catch (error) {
    console.log(error);
  }
};
