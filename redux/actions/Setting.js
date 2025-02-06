import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';
import { getSettings, getAllFetchFail } from '../reducers/Settings';

export const settings_r = createAsyncThunk(
  'settings/settings_r',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/settingspublic`);
      dispatch(getSettings(response.data));
    } catch (err) {
      console.error(
        err.message + ': ' + err.config.url.replace(API_URL, 'api')
      );
      dispatch(getAllFetchFail(err.message + ': ' + err.config.url.replace(API_URL, 'api')));
    }
  }
);
