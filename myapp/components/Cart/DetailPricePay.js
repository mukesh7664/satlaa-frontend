import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useState, useEffect } from "react";
import { Button, Divider, Input, Alert } from "@mui/material";
import Price from "../Price";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";
import { TagsOutlined } from "@ant-design/icons";
import { cartFetch } from "../../../redux/reducers/Cart";
import Coupon from "./Coupon";
const Default = () => {
  const cart= useSelector((state) => state.cart);

  const [allPrice, seTallPrice] = useState({
    total: 0,
    discount: 0,
    appliedDiscount: 0,
  });
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

      // seTshippingAddress(cart.shipping_address);
    }
  };

  useEffect(() => {
    getProducts();
  }, [cart]);

  const finalPrice = () => {
    let discount = Math.ceil(Math.ceil(allPrice.total * cart.coupon_discount) / 100) || 0;
    
    return Math.floor(allPrice.total + (cart.cargo_price || 0 )- discount);
  };
  return (
    <div className="h-full relative">
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
          <Price data={cart.cargo_price || 0} />
        </span>
      </div>

      <Coupon total_price={allPrice.total}/>
      <div className="w-full px-4 text-lg mb-6 mt-4">
        <span>Total Price:</span>
        <span className="float-right font-semibold text-primary">
          <Price data={finalPrice()} />
        </span>
      </div>
    </div>
  );
};

export default Default;
