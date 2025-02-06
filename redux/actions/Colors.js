import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../config';
import { colorsFetch } from '../reducers/Colors';

export const getColors_r = createAsyncThunk(
  'colors/getColors_r',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/colorspublic`);
      dispatch(colorsFetch(response.data));
    } catch (err) {
      console.error(
        err.message + ': ' + err.config.url.replace(API_URL, 'api')
      );
      // You can dispatch an error action here if needed.
    }
  }
);
