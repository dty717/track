import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const Api = axios.create({
  baseURL: "http://155.138.195.23:4000",
});

// Api.interceptors.request.use(
//   async (config) => {
//     // const token = await AsyncStorage.getItem("token");
//     // if (token) {
//     //   config.headers.Authorization = `Bearer ${token}`;
//     // }
//     config.headers. auth =  {
//         username: 'dty717',
//         password: 'd52180362'
//     }
//     return config;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );


export default Api;
