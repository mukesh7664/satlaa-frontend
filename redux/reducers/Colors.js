import { createSlice } from '@reduxjs/toolkit';

const initialSettings = {
  colors: [],
};

const colorsSlice = createSlice({
  name: 'colors',
  initialState: initialSettings,
  reducers: {
    colorsFetch: (state, action) => {
      state.colors = action.payload;
    },
  },
});

export const { colorsFetch } = colorsSlice.actions;

export default colorsSlice.reducer;
