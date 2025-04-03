import { createSlice } from '@reduxjs/toolkit';

const initialSettings = {
  subcategory: [],
};

const subcategorySlice = createSlice({
  name: 'subcategory',
  initialState: initialSettings,
  reducers: {
    subcategoryFetch: (state, action) => {
      state.subcategory = action.payload;
    },
  },
});

export const { subcategoryFetch } = subcategorySlice.actions;

export default subcategorySlice.reducer;
