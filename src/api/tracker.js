import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'

const instance = axios.create({
  baseURL: "http://155.138.195.23:4000",
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
