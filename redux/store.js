import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/index";
import { nextReduxCookieMiddleware } from "next-redux-cookie-wrapper";

// Create Redux store function
export function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer, // Use the root reducer
    preloadedState, // Set initial state
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: true, serializableCheck: false }).prepend(
        nextReduxCookieMiddleware({
          subtrees: ["cart"], // Store only "cart" in cookies
        })
      ),
  });
}