import { API_URL } from "../../config";
import axiosInstance from "@/util/axios";
export default {
  sendOTP: (user) => {
    const axios = axiosInstance();
    return axios
      .post(`${API_URL}/users/loginuser`, user)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return { success: false };
      });
  },
  registerUser: (user) => {
    const axios = axiosInstance();
    return axios
      .post(`${API_URL}/users/register`, user)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return { success: false };
      });
  },
  verifyOTP: (user) => {
    const axios = axiosInstance();
    return axios
      .post(`${API_URL}/users/verifyotp`, user)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return {
          isAuthenticated: false,
          user: {
            email: "",
            role: "",
            id: "",
            name: "",
            image: "",
            phone: "",
          },
        };
      });
  },
  login: (user) => {
    const axios = axiosInstance();
    return axios
      .post(`${API_URL}/users/loginuser`, user)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return {
          isAuthenticated: false,
          user: {
            email: "",
            role: "",
            id: "",
            name: "",
            image: "",
            phone: "",
          },
        };
      });
  },

  register: (user) => {
    const axios = axiosInstance();
    return axios
      .post(`${API_URL}/users/register`, user)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return {
          error: err,
        };
      });
  },
  logout: () => {
    const axios = axiosInstance();
    return axios
      .get(`${API_URL}/users/logout`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return {
          error: err,
        };
      });
  },
  isAuthenticated: (context) => {

    const axios = axiosInstance(context);
    return axios
      .get(`${API_URL}/users/authenticateduser`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return {
          isAuthenticated: false,
          user: { email: "", id: "", name: "", image: "", phone: "" },
        };
      });
  },
  getUser: () => {
    const axios = axiosInstance();
    return axios
      .get(`${API_URL}/users/authenticateduser`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return {
          isAuthenticated: false,
          user: { email: "", id: "", name: "", image: "", phone: "" },
        };
      });
  },
};
