import axios from "axios";
import { BASE_URL } from "./baseUrl";
import Cookies from "js-cookie";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {

    const token =  localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log(originalRequest,error.response);
    

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.post( `${BASE_URL}/register/generateNewTokens`,{},
          {withCredentials: true,}
        );

        console.log(response);
        

        if (response.data.success && response.data.accessToken) {
          // Store the new token
          localStorage.setItem("token", response.data.accessToken);

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // store.dispatch(logoutUser(_id));
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { BASE_URL } from '../Base/BaseUrl';
// import { logoutUser } from '../redux/slice/auth.slice';

// const axiosInstance = axios.create({
//     baseURL: BASE_URL,
//     withCredentials: true,
// });

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = Cookies.get('accessToken');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         console.log(error.response.status === 401, !originalRequest._retry);
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
// await axios.post(BASE_URL +'/user/relogin-user', {}, { withCredentials: true })
//                     .then((response) => {
//                         if (response.status === 201) {
//                             const { accessToken } = response.data;
//                             originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
//                             return axiosInstance(originalRequest);
//                         }
//                     })
//                     .catch((refreshError) => {
//                         const { store } = require('../Redux/Store/Store').configStore();
//                         const _id = localStorage.getItem("_id");
//                         store.dispatch(logoutUser(_id));
//                         return Promise.reject(refreshError);
//                     })
//             } catch (refreshError) {
//                 const { store } = require('../Redux/Store/Store').configStore();
//                 const _id = localStorage.getItem("_id");
//                 store.dispatch(logoutUser(_id));
//                 return Promise.reject(refreshError);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;
