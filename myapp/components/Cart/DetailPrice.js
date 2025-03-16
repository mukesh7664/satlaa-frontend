"use client";

import axiosInstance from "@/util/axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";
import { cartFetch, getCart as getCart_r } from "../../../redux/reducers/Cart";
import TagManager from "react-gtm-module";
import { Box, Typography, Divider, Button } from "@mui/material";
import Price from "../Price";

const Default = () => {
  const axios = axiosInstance();
  const cart = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const dispatch = useDispatch();
  const router = useRouter();

  const [allPrice, setAllPrice] = useState({
    total: 0,
    discount: 0,
    cargo_price: 0,
    cargo_price_discount: 0,
  });

  const [productShippingPrice, setProductShippingPrice] = useState(null);

  const shipping_price = () =>
    productShippingPrice ? productShippingPrice + 30 : cart.shipping_charges;

  const getCartProducts = (data = [], products = []) => {
    let cartTotalPrice = 0;
    let cartTotalDiscountPrice = 0;
    const errorArray = [];

    products.forEach((x) => {
      const array = data.find((y) => y._id === x.product_id);

      if (array) {
        const resData = array;
        if (x.selectedVariants !== undefined) {
          const priceMath = func.filter_array_in_obj(
            resData.variant_products,
            x.selectedVariants
          );

          if (!priceMath[0].visible || Number(priceMath[0].qty) < Number(x.qty)) {
            errorArray.push(true);
          } else {
            errorArray.push(false);
          }

          cartTotalPrice += x.qty * priceMath[0].price;
          cartTotalDiscountPrice += x.qty * priceMath[0].before_price;
        } else {
          if (!resData.isActive || Number(resData.qty) < Number(x.qty)) {
            errorArray.push(true);
          } else {
            errorArray.push(false);
          }

          cartTotalPrice += x.qty * resData.price;
          cartTotalDiscountPrice += x.qty * resData.before_price;
        }
      }
    });

    setAllPrice({
      total: cartTotalPrice,
      discount: cartTotalDiscountPrice,
      error: errorArray,
    });
  };

  const getProducts = async () => {
    if (cart.products?.length > 0) {
      const arrayId = cart.products.map((x) => x.product_id);
      await axios
        .post(`${API_URL}/cart/allproducts`, { _id: arrayId })
        .then((res) => getCartProducts(res.data, cart.products));
    }
  };

  const onSubmit = async () => {
    TagManager.dataLayer({ dataLayer: null });
    TagManager.dataLayer({ dataLayer: dataLayerContent });

    const errorArray = [];
    const arrayId = cart.products?.map((x) => x.product_id);

    await axios
      .post(`${API_URL}/cart/allproducts`, { _id: arrayId })
      .then((res) => {
        const data = res.data;
        let cartTotalPrice = 0;
        let cartTotalDiscountPrice = 0;

        cart.products.forEach((x) => {
          const array = data.find((y) => y._id === x.product_id);

          if (array) {
            const resData = array;
            if (x.selectedVariants !== undefined) {
              const priceMath = func.filter_array_in_obj(
                resData.variant_products,
                x.selectedVariants
              );

              if (!priceMath[0].visible || Number(priceMath[0].qty) < Number(x.qty)) {
                errorArray.push(true);
              } else {
                errorArray.push(false);
              }

              cartTotalPrice += x.qty * priceMath[0].price;
              cartTotalDiscountPrice += x.qty * priceMath[0].before_price;
            } else {
              if (!resData.isActive || Number(resData.qty) < Number(x.qty)) {
                errorArray.push(true);
              } else {
                errorArray.push(false);
              }

              cartTotalPrice += x.qty * resData.price;
              cartTotalDiscountPrice += x.qty * resData.before_price;
            }
          }
        });
      });

    const hasError = errorArray.some((x) => x === true);
    if (!hasError) {
      const post = {
        created_user: {
          name: user.name,
          id: user.id,
        },
        customer_id: user.id,
        products: cart.products,
        total_price: allPrice.total,
        total_discount: allPrice.discount,
        cargo_price: cart.shipping_charges,
        cargo_price_discount: 0,
      };

      if (isAuthenticated) {
        axios
          .post(`${API_URL}/cart/${cart._id}`, post)
          .then(async () => {
            await dispatch(getCart_r(user.id));
          })
          .catch(() => {
            message.error({
              content: "Some Error, Please Try Again",
              duration: 3,
            });
          });
      } else {
        dispatch(cartFetch(post));
        getProducts();
      }
      router.push("/cart/address");
    } else {
      dispatch(getCart_r(user.id));
      message
        .loading("Action in progress..", 0.5)
        .then(() => message.error("Remove Out of Stock Product", 2.5));
    }
  };

  useEffect(() => {
    getProducts();
  }, [cart]);

  let userInfo = {
    user_name: user.name,
    user_phone: user.prefix + user.phone,
  };
  if (user.last_name) userInfo.user_last_name = user.last_name;
  if (user.email) userInfo.user_email = user.email;

  const dataLayerContent = {
    event: "begin_checkout",
    user_info: userInfo,
    ecommerce: {
      currency: "INR",
      value: allPrice.total,
      items: cart.products?.map((product) => ({
        item_name: product.title,
        item_id: product.sku,
        price: product.price,
        brand: "SATLAA Jewellery",
        quantity: product.qty,
      })),
    },
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "background.paper", borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", width: "100%" }}>
        Cart Summary
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Items Price</Typography>
        <Typography fontWeight="bold">
          <Price data={allPrice.total} />
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography>Shipping</Typography>
        <Typography fontWeight="bold">
          <Price data={shipping_price()} />
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography>Total Price:</Typography>
        <Typography fontWeight="bold" color="primary">
          <Price data={allPrice.total + Math.floor(shipping_price() || 0)} />
        </Typography>
      </Box>

      <Button
        variant="contained"
        className="bg-secondary"
        fullWidth
        disabled={cart?.products.length === 0}
        onClick={onSubmit}
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
};

export default Default;