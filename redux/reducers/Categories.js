import { createSlice } from '@reduxjs/toolkit';

const initialSettings = {
  categories: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: initialSettings,
  reducers: {
    categoriesFetch: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { categoriesFetch } = categoriesSlice.actions;

export default categoriesSlice.reducer;
