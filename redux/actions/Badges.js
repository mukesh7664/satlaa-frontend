import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../config';
import { badgesFetch } from '../reducers/Badges';

export const getBadges_r = createAsyncThunk(
  'badges/getBadges_r',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/badgespublic`);
      dispatch(badgesFetch(response.data));
    } catch (err) {
      console.error(
        err.message + ': ' + err.config.url.replace(API_URL, 'api')
      );
      // You can dispatch an error action here if needed.
    }
  }
);
