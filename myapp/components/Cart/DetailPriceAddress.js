import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useState, useEffect } from "react";
import router from "next/router";
import { Button, Divider, message } from "@mui/material";
import Price from "../Price";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";

import { cartFetch, getCart as getCart_r } from "../../../redux/reducers/Cart";
import Coupon from "./Coupon";
const Default = () => {
  const cart= useSelector((state) => state.cart);
  const { user } = useSelector(({ login }) => login);
  const { shipping_address } = useSelector((state) => state.cart);
  const [allPrice, seTallPrice] = useState({
    total: 0,
    discount: 0,
    cargo_price: 0,
    cargo_price_discount: 0,
  });
  const dispatch = useDispatch();
 
  const getCartProducts = (data = [], products = []) => {
    let cartTotalPrice = 0;
    let cartTotalDiscountPrice = 0;
    const errorArray = [];

    products.map((x) => {
      const array = data.find((y) => y._id == x.product_id);

      if (array) {
        const resData = array;
        if (x.selectedVariants !== undefined) {
          const priceMath = func.filter_array_in_obj(
            resData.variant_products,
            x.selectedVariants
          );

          if (priceMath[0].visible === false) {
            errorArray.push("Product Not Active");
          } else if (Number(priceMath[0].qty) < Number(x.qty)) {
            errorArray.push("Out Of Stock");
          } else {
            errorArray.push(null);
          }

          cartTotalPrice = cartTotalPrice + x.qty * priceMath[0].price;
          cartTotalDiscountPrice =
            cartTotalDiscountPrice + x.qty * priceMath[0].before_price;
        } else {
          if (resData.isActive === false) {
            errorArray.push("Product Not Active");
          } else if (Number(resData.qty) < Number(x.qty)) {
            errorArray.push("Out Of Stock");
          } else {
            errorArray.push(null);
          }

          cartTotalPrice = cartTotalPrice + x.qty * resData.price;
          cartTotalDiscountPrice =
            cartTotalDiscountPrice + x.qty * resData.before_price;
        }
      }
    });
    seTallPrice({
      total: cartTotalPrice,
      discount: cartTotalDiscountPrice,
      error: errorArray,
    });
  };

  const getProducts = async () => {
    if (cart.products?.length > 0) {
      const arrayId = [];
      cart.products?.map((x) => {
        arrayId.push(x.product_id);
      });
      await axios
        .post(`${API_URL}/cart/allproducts`, { _id: arrayId })
        .then((res) => {
          getCartProducts(res.data, cart.products);
        });
    }
  };

  const onSubmit = async () => {
    const errorArray = [];
    const arrayId = [];

    cart.products?.map((x) => {
      arrayId.push(x.product_id);
    });

    await axios
      .post(`${API_URL}/cart/allproducts`, { _id: arrayId })
      .then((res) => {
        const data = res.data;
        const products = cart.products;
        let cartTotalPrice = 0;
        let cartTotalDiscountPrice = 0;

        products.map((x) => {
          const array = data.find((y) => y._id == x.product_id);

          if (array) {
            const resData = array;
            if (x.selectedVariants !== undefined) {
              const priceMath = func.filter_array_in_obj(
                resData.variant_products,
                x.selectedVariants
              );

              if (priceMath[0].visible === false) {
                errorArray.push(true);
              } else if (Number(priceMath[0].qty) < Number(x.qty)) {
                errorArray.push(true);
              } else {
                errorArray.push(false);
              }

              cartTotalPrice = cartTotalPrice + x.qty * priceMath[0].price;
              cartTotalDiscountPrice =
                cartTotalDiscountPrice + x.qty * priceMath[0].before_price;
            } else {
              if (resData.isActive === false) {
                errorArray.push(true);
              } else if (Number(resData.qty) < Number(x.qty)) {
                errorArray.push(true);
              } else {
                errorArray.push(false);
              }

              cartTotalPrice = cartTotalPrice + x.qty * resData.price;
              cartTotalDiscountPrice =
                cartTotalDiscountPrice + x.qty * resData.before_price;
            }
          }
        });
      });

    let control = false;
    control = errorArray.find((x) => x == true);
    if (control === undefined) {
      router.push("/cart/payment");
    } else {
      dispatch(getCart_r(user.id));
      message
        .loading("Action in progress..", 0.5)
        .then(() => message.error(" Your Cart", 2.5));
      router.push("/cart");
    }
  };
  useEffect(() => {
    getProducts();
  }, [cart]);

  return (
    <div className="h-full relative">
      <div className="text-lg p-3 -mt-2 bg-gray-50 font-semibold">
        Shipping Address Summary
      </div>

      <div className="w-full p-4">
        {shipping_address && shipping_address.address ? (
          <>
            <b>{shipping_address.name} </b>
            <br />
            <div className="flex w-full justify-between pt-1 ">
              {shipping_address.address}
              <br />
              {shipping_address.district},{shipping_address.state},
              {shipping_address.pin_code}
            </div>
          </>
        ) : (
          <div className="text-red-500 text-xl text-center font-semibold p-4">
            Please Select Address
          </div>
        )}
      </div>

      <div className="text-lg p-3 my-5 bg-gray-50 font-semibold">
        Cart Summary
      </div>
      <div className="w-full px-4 mt-1">
        <span>Items Price</span>
        <span className="float-right font-semibold">
          <Price data={allPrice.total} />
        </span>
      </div>
      <div className="w-full px-4 mt-1">
        <span>Shipping</span>
        <span className="float-right font-semibold">
          <Price data={cart.cargo_price} />
        </span>
      </div>
      {/* {allPrice.discount ? (
        <>
          <div className="w-full px-4 mt-1">
            <span>Total Discount:</span>
            <span className="float-right  line-through font-semibold">
              <Price data={allPrice.discount} />
            </span>
          </div>
          <Divider />
        </>
      ) : (
        ""
      )} */}
      {/* <Coupon total_price={allPrice.total}/> */}
      <div className="w-full px-4 text-lg mb-6">
        <span>Total Price:</span>
        <span className="float-right font-semibold text-primary">
          <Price data={allPrice.total + (cart.cargo_price || 0)} />
        </span>{" "}
        <p className="text-base text-gray-600 mt-2">
          Apply Discount at Checkout
        </p>
      </div>
      <div className="text-center flex justify-center h-20">
        <button
          disabled={shipping_address && shipping_address.address ? false : true}
          className={`${
            shipping_address && shipping_address.address
              ? "bg-secondary"
              : "bg-gray-500"
          } bg-secondary self-center rounded mx-auto flex gap-x-3 h-auto absolute bottom-0 cursor-pointer hover:text-white  transition-all text-xl text-white p-4`}
          onClick={onSubmit}
        >
          Checkout Securely
          <LockOutlinedIcon className="float-right text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default Default;
