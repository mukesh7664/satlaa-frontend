"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import authservice from "@/util/services/authservice";
import { cartFetch } from "@/redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";
import TagManager from "react-gtm-module";

export default function ClientProductLogic({ productData }) {
  const dispatch = useDispatch();
  const { user } = useSelector(({ login }) => login);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = await authservice.isAuthenticated();
      if (auth.isAuthenticated) {
        dispatch(cartFetch(auth.userCart));
        dispatch(setLogin(auth.user));
        dispatch(setIsAuthenticated(true));
      }
    };

    fetchUserData();
  }, [dispatch]);

  useEffect(() => {
    const dataLayerContent = {
      event: "view_item",
      user_info: user ? { user_name: user.name, user_phone: user.phone } : null,
      ecommerce: {
        currency: "INR",
        items: [
          {
            item_name: productData.title,
            item_id: productData.sku,
            price: productData.price,
            brand: "SATLAA Jewellery",
            category: productData.categories[0],
            quantity: 1,
          },
        ],
      },
    };

    TagManager.dataLayer({ dataLayer: null });
    TagManager.dataLayer({ dataLayer: dataLayerContent });
  }, [productData, user]);

  return null; // No UI needed
}