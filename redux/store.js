import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/index";
import { getCookie, setCookie } from 'cookies-next';

// Create Redux store function
export function makeStore(preloadedState = {}) {
  // Load cart state from cookie
  const cartCookie = getCookie('cart');
  if (cartCookie) {
    try {
      preloadedState.cart = JSON.parse(cartCookie);
    } catch (e) {
      console.error('Failed to parse cart cookie:', e);
    }
  }

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ 
        thunk: true, 
        serializableCheck: false 
      }),
  });

  // Subscribe to store changes to update cookies
  store.subscribe(() => {
    const state = store.getState();
    if (state.cart) {
      setCookie('cart', JSON.stringify(state.cart));
    }
  });

  return store;
}