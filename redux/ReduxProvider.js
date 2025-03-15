"use client"; // ✅ Ensure Redux runs on the client side

import { Provider } from "react-redux";
import { makeStore } from "./store"; // ✅ Import makeStore() instead of wrapper

const store = makeStore(); // ✅ Create the Redux store instance

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}