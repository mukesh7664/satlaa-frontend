import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/index";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import {
  nextReduxCookieMiddleware,
  wrapMakeStore,
} from "next-redux-cookie-wrapper";
const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };

    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

const initStore = wrapMakeStore(() =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: true, serializableCheck: false }).prepend(
        nextReduxCookieMiddleware({
          subtrees: ["cart"],
        })
      ),
  })
);

export const wrapper = createWrapper(initStore);
