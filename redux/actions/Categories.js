import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';
import { categoriesFetch } from '../reducers/Categories';

export const getCategories_r = createAsyncThunk(
  'categories/getCategories_r',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/categoriespublic/true`);
      dispatch(categoriesFetch(response.data));
    } catch (err) {
      console.error(
        err.message + ': ' + err.config.url.replace(API_URL, 'api')
      );
      // You can dispatch an error action here if needed.
    }
  }
);
