import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';
import { collectionsFetch } from '../reducers/Collections';

export const getCollections_r = createAsyncThunk(
  'collections/getCollections_r',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/collectionspublic/true`);
      dispatch(collectionsFetch(response.data));
    } catch (err) {
      console.error(
        err.message + ': ' + err.config.url.replace(API_URL, 'api')
      );
      // You can dispatch an error action here if needed.
    }
  }
);
