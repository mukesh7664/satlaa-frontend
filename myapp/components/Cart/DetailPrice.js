"use client";

import axiosInstance from "@/util/axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";
import { cartFetch, getCart as getCart_r } from "../../../redux/reducers/Cart";
import TagManager from "react-gtm-module";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
    <Card className="p-4">
      <CardHeader className="text-lg font-bold">Cart Summary</CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Items Price</span>
          <span className="font-semibold">
            <Price data={allPrice.total} />
          </span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-semibold">
            <Price data={shipping_price()} />
          </span>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total Price:</span>
          <span className="text-primary">
            <Price data={allPrice.total + Math.floor(shipping_price() || 0)} />
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full bg-primary" 
          disabled={cart?.products.length === 0} 
          onClick={onSubmit}
        >
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Default;