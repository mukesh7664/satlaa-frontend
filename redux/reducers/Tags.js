import { createSlice } from '@reduxjs/toolkit';

const initialSettings = {
  tags: [],
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState: initialSettings,
  reducers: {
    tagsFetch: (state, action) => {
      state.tags = action.payload;
    },
  },
});

export const { tagsFetch } = tagsSlice.actions;

export default tagsSlice.reducer;
