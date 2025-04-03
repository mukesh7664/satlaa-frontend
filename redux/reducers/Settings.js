import { createSlice } from '@reduxjs/toolkit';
import { defaultLanguage } from '../../config';

const initialState = {
  locale: defaultLanguage,
  collapsed: false,
  settings: {},
  errorFetch: '',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchLanguage: (state, action) => {
      state.locale = action.payload;
    },
    changeCollapsed: (state, action) => {
      state.collapsed = action.payload;
    },
    getSettings: (state, action) => {
      state.settings = action.payload;
    },
    getAllFetchFail: (state, action) => {
      state.errorFetch = action.payload;
    },
  },
});

export const { switchLanguage, changeCollapsed, getSettings, getAllFetchFail } = settingsSlice.actions;

export default settingsSlice.reducer;
