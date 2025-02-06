import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';
import { tagsFetch } from '../reducers/Tags';

export const getTags_r = createAsyncThunk(
  'tags/getTags_r',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/tagspublic`);
      dispatch(tagsFetch(response.data));
    } catch (err) {
      console.error(
        err.message + ': ' + err.config.url.replace(API_URL, 'api')
      );
      // You can dispatch an error action here if needed.
    }
  }
);
