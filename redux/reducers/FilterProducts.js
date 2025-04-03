import { createSlice } from "@reduxjs/toolkit";

const initialSettings = {
  filterProducts: {
    tags: [],
    colors: [],
    subcategory: [],
    styles: [],
    categories: [],
    text: "",
    variants: [],
    minPrice: null,
    maxPrice: null,
    sort: "",
    perPage: 8,
    page: 1,
  },
};

const filterSlice = createSlice({
  name: "filter",
  initialState: initialSettings,
  reducers: {
    filterProducts: (state, action) => {
      state.filterProducts = action.payload;
    },
    filterReset: (state) => {
      state.filterProducts = {
         
      };
    },
  },
});

export const { filterProducts, filterReset } = filterSlice.actions;

export default filterSlice.reducer;
