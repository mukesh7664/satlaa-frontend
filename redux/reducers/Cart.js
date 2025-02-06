import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axios";
import { API_URL } from "../../config";

const axios = axiosInstance();

const initialSettings = {
  customer_id: "",
  products: [],
  shipping_address: {},
  coupon: "",
  coupon_discount: 0,
  coupon_type: null,
  shipping_charges: 50,
};

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cart/customer/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: initialSettings,
  reducers: {
    cartFetch: (state, action) => {
      return { ...state, ...action.payload };
    },
    addProductToCart: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateProduct: (state, action) => {
      const { product, qty } = action.payload;
      const productIndex = state.products.findIndex(
        (item) => item.product_id === product._id
      );
      if (productIndex !== -1) {
        if (qty > 0) {
          state.products[productIndex].qty = qty;
        } else {
          state.products.splice(productIndex, 1);
        }
      }
    },
    setShippingAddress: (state, action) => {
      state.shipping_address = action.payload;
    },
    clearCart: (state) => {
      return initialSettings;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCart.fulfilled, (state, action) => {
      if (
        action.payload &&
        action.payload._id &&
        Array.isArray(action.payload.products) &&
        action.payload.products.length > 0
      ) {
        return { ...state, ...action.payload };
      } else {
        return state;
      }
    });
  },
});

export const {
  cartFetch,
  addProductToCart,
  updateProduct,
  setShippingAddress,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
