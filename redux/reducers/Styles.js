import { createSlice } from '@reduxjs/toolkit';

const initialSettings = {
  styles: [],
};

const stylesSlice = createSlice({
  name: 'styles',
  initialState: initialSettings,
  reducers: {
    stylesFetch: (state, action) => {
      state.styles = action.payload;
    },
  },
});

export const { stylesFetch } = stylesSlice.actions;

export default stylesSlice.reducer;
