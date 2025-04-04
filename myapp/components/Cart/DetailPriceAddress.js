'use client'

import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useState, useEffect } from "react";
import {useRouter} from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MdLockOutline } from "react-icons/md";
import Price from "../Price";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";
import { cartFetch, getCart as getCart_r } from "../../../redux/reducers/Cart";

const Default = () => {
  const router = useRouter();
  const cart = useSelector((state) => state.cart);
  const { user } = useSelector(({ login }) => login);
  const { shipping_address } = useSelector((state) => state.cart);
  const [allPrice, setAllPrice] = useState({
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

    products.forEach((x) => {
      const array = data.find((y) => y._id === x.product_id);
      if (array) {
        const resData = array;
        if (x.selectedVariants !== undefined) {
          const priceMath = func.filter_array_in_obj(
            resData.variant_products,
            x.selectedVariants
          );

          if (!priceMath[0].visible) errorArray.push("Product Not Active");
          else if (Number(priceMath[0].qty) < Number(x.qty))
            errorArray.push("Out Of Stock");
          else errorArray.push(null);

          cartTotalPrice += x.qty * priceMath[0].price;
          cartTotalDiscountPrice += x.qty * priceMath[0].before_price;
        } else {
          if (!resData.isActive) errorArray.push("Product Not Active");
          else if (Number(resData.qty) < Number(x.qty))
            errorArray.push("Out Of Stock");
          else errorArray.push(null);

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
      try {
        const res = await axios.post(`${API_URL}/cart/allproducts`, {
          _id: arrayId,
        });
        getCartProducts(res.data, cart.products);
      } catch (error) {
        console.error("Error fetching cart products", error);
      }
    }
  };

  const onSubmit = async () => {
    const errorArray = [];
    const arrayId = cart.products?.map((x) => x.product_id);

    try {
      const res = await axios.post(`${API_URL}/cart/allproducts`, {
        _id: arrayId,
      });

      const data = res.data;
      const products = cart.products;
      let cartTotalPrice = 0;
      let cartTotalDiscountPrice = 0;

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

      if (!errorArray.includes(true)) {
        router.push("/cart/payment");
      } else {
        dispatch(getCart_r(user.id));
        router.push("/cart");
      }
    } catch (error) {
      console.error("Error processing checkout", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, [cart]);

  return (
    <Card className="p-4">
      <CardHeader className="bg-gray-100 p-3 font-semibold text-lg">
        Shipping Address Summary
      </CardHeader>
      <CardContent>
        {shipping_address && shipping_address.address ? (
          <div>
            <p className="font-semibold">{shipping_address.name}</p>
            <p className="text-sm text-gray-600">
              {shipping_address.address}, {shipping_address.district}, {shipping_address.state}, {shipping_address.pin_code}
            </p>
          </div>
        ) : (
          <p className="text-center text-red-500 font-medium">Please Select Address</p>
        )}
      </CardContent>

      <CardHeader className="bg-gray-100 p-3 mt-4 font-semibold text-lg">
        Cart Summary
      </CardHeader>
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
            <Price data={cart.cargo_price} />
          </span>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total Price:</span>
          <span className="text-primary">
            <Price data={allPrice.total + (cart.cargo_price || 0)} />
          </span>
        </div>

        <p className="text-xs text-gray-500">Apply Discount at Checkout</p>
      </CardContent>

      <CardFooter className="flex justify-center mt-4">
        <Button 
          className="px-6 py-3 text-lg" 
          disabled={!shipping_address?.address} 
          onClick={onSubmit}
        >
          <MdLockOutline className="mr-2 h-5 w-5" />
          Checkout Securely
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Default;