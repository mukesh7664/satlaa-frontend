import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../config';
import { badgesFetch, categoriesFetch, topmenuFetch, subcategoryFetch, stylesFetch, colorsFetch, tagsFetch, getSettings } from '../reducers';

export const fetchAllStaticData = createAsyncThunk(
  'staticData/fetchAll',
  async (_, { dispatch }) => {
    try {
      const response = await axios.get(`${API_URL}/staticdata`);
      dispatch(tagsFetch(response.data.tags));
      dispatch(getSettings(response.data.settings));
      dispatch(colorsFetch(response.data.colors));
      dispatch(badgesFetch(response.data.badges));
      dispatch(stylesFetch(response.data.styles));
      dispatch(subcategoryFetch(response.data.subcategory));
      dispatch(categoriesFetch(response.data.categories));
      dispatch(topmenuFetch(response.data.topmenu));
    } catch (err) {
      console.error(
        err.message + ': ' + err.config.url.replace(API_URL, 'api')
      );
      // Dispatch error action if needed
    }
  }
);
