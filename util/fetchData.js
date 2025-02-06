
import axios from "axios";
import { API_URL } from "../config";
import { tagsFetch } from "../redux/reducers/Tags";
import { getSettings } from "../redux/reducers/Settings";
import { badgesFetch } from "../redux/reducers/Badges";
import { colorsFetch } from "../redux/reducers/Colors";
import { stylesFetch } from "../redux/reducers/Styles";
import { subcategoryFetch } from "../redux/reducers/SubCategory";
import { categoriesFetch } from "../redux/reducers/Categories";
import { topmenuFetch } from "../redux/reducers/Topmenu";
import { couponsFetch } from "../redux/reducers/Coupons";
import { collectionsFetch } from "../redux/reducers/Collections";
export const fetchData = async (dispatch) => {
  const response = await axios.get(`${API_URL}/staticdata`);

  dispatch(tagsFetch(response.data.tags));
  dispatch(getSettings(response.data.settings[0]));
  dispatch(colorsFetch(response.data.colors));
  dispatch(badgesFetch(response.data.badges));
  dispatch(stylesFetch(response.data.styles));
  dispatch(subcategoryFetch(response.data.subcategory));
  dispatch(categoriesFetch(response.data.categories));
  dispatch(collectionsFetch(response.data.collections));
  dispatch(topmenuFetch(response.data.topmenu));
  dispatch(couponsFetch(response.data.coupons));
};
