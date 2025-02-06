import axios from "axios";
import { getCookie } from "cookies-next";

const axiosInstance = (ctx = null) => {
  const instance = axios.create();

  instance.interceptors.request.use(
    (config) => {
      // Get the token from the cookies


      const token = ctx ? getCookie("token", ctx) : getCookie("token");
      // If the token exists, set the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  return instance;
};

export default axiosInstance;
