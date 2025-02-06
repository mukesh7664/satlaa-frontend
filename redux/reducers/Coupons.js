import { createSlice } from '@reduxjs/toolkit';

const initialSettings = {
  coupons: [],
};

const couponsSlice = createSlice({
  name: 'coupons',
  initialState: initialSettings,
  reducers: {
    couponsFetch: (state, action) => {
      state.coupons = action.payload;
    },
  },
});

export const { couponsFetch } = couponsSlice.actions;

export default couponsSlice.reducer;
