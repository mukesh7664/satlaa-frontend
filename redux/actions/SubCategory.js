import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';
import { subcategoryFetch } from '../reducers/SubCategory';

export const getSubcategory_r = createAsyncThunk(
  'subcategory/getSubcategory_r',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/subcategorypublic`);
      dispatch(subcategoryFetch(response.data));
    } catch (err) {
      console.error(
        err.message + ': ' + err.config.url.replace(API_URL, 'api')
      );
      // You can dispatch an error action here if needed.
    }
  }
);
