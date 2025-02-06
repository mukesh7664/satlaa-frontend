import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';
import { stylesFetch } from '../reducers/Styles';

export const getStyles_r = createAsyncThunk(
  'styles/getStyles_r',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/stylespublic`);
      dispatch(stylesFetch(response.data));
    } catch (err) {
      console.error(
        err.message + ': ' + err.config.url.replace(API_URL, 'api')
      );
      // You can dispatch an error action here if needed.
    }
  }
);
