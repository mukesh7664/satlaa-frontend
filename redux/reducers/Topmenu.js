import { createSlice } from "@reduxjs/toolkit";

const initialSettings = {
  topmenu: [],
};

const topmenuSlice = createSlice({
  name: "topmenu",
  initialState: initialSettings,
  reducers: {
    topmenuFetch: (state, action) => {
      state.topmenu = action.payload;
    },
  },
});

export const { topmenuFetch } = topmenuSlice.actions;
export default topmenuSlice.reducer;
