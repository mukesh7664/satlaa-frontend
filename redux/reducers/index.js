import { combineReducers } from "redux";
import settingsReducer from "./Settings";
import loginReducer from "./Login";
import tagsReducer from "./Tags";
import filterProductsReducer from "./FilterProducts";
import categoriesReducer from "./Categories";
import collectionsReducer from "./Collections";
import cartReducer from "./Cart";
import topmenuReducer from "./Topmenu";
import colorsReducer from "./Colors";
import badgesReducer from "./Badges";
import couponsReducer from "./Coupons";
import stylesReducer from "./Styles";
import subcategoryReducer from "./SubCategory";
import { productsApi } from "../api/productsApi";

const rootReducer = combineReducers({
  settings: settingsReducer,
  login: loginReducer,
  tags: tagsReducer,
  filterProducts: filterProductsReducer,
  categories: categoriesReducer,
  collections: collectionsReducer,
  cart: cartReducer,
  colors: colorsReducer,
  badges: badgesReducer,
  styles: stylesReducer,
  subcategory: subcategoryReducer,
  topmenu: topmenuReducer,
  coupons:couponsReducer,
  [productsApi.reducerPath]: productsApi.reducer,
});

export default rootReducer;
