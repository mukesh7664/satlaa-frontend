import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../../config";
import { topmenuFetch } from "../reducers/Topmenu";

export const getTopmenu_r = createAsyncThunk(
  "topmenu/getTopmenu_r",
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/topmenupublic/not`);
      dispatch(topmenuFetch(response.data));
    } catch (err) {
      console.error(
        err.message + ": " + err.config.url.replace(API_URL, "api")
      );
      // You can dispatch an error action here if needed.
    }
  }
);
