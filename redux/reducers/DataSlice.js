import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tags: [],
  settings: null,
  colors: [],
  badges: [],
  styles: [],
  subcategory: [],
  categories: [],
  collections: [],
  topmenu: [],
  coupons: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    hydrateData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { hydrateData } = dataSlice.actions;
export default dataSlice.reducer;