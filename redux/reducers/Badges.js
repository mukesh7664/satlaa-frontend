import { createSlice } from '@reduxjs/toolkit';

const initialSettings = {
  badges: [],
};

const badgesSlice = createSlice({
  name: 'badges',
  initialState: initialSettings,
  reducers: {
    badgesFetch: (state, action) => {
      state.badges = action.payload;
    },
  },
});

export const { badgesFetch } = badgesSlice.actions;

export default badgesSlice.reducer;
