import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: '',
    address: [],
    role: {
      example: false,
    },
  },
  isAuthenticated: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setLogin: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      state.user = { role: { view: 'try' } };
      state.isAuthenticated = false;
    },
  },
});

export const { setIsAuthenticated, setLogin, setLogout } = loginSlice.actions;

export default loginSlice.reducer;
