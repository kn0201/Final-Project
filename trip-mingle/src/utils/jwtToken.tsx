//Buffer Line

import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token != null) {
      return token;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
