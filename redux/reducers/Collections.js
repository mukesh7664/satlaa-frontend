import { createSlice } from '@reduxjs/toolkit';

const initialSettings = {
  collections: [],
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState: initialSettings,
  reducers: {
    collectionsFetch: (state, action) => {
      state.collections = action.payload;
    },
  },
});

export const { collectionsFetch } = collectionsSlice.actions;

export default collectionsSlice.reducer;
