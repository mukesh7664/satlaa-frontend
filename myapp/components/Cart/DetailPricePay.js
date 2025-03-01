import axiosInstance from "@/util/axios";
import { useState, useEffect } from "react";
import { Button, Divider, Typography, Box } from "@mui/material";
import Price from "../Price";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";
import { cartFetch } from "../../../redux/reducers/Cart";
import Coupon from "./Coupon";

const Default = () => {
  const axios = axiosInstance();
  const cart = useSelector((state) => state.cart);

  const [allPrice, setAllPrice] = useState({
    total: 0,
    discount: 0,
    appliedDiscount: 0,
  });

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

          if (!priceMath[0].visible) {
            errorArray.push("Product Not Active");
          } else if (Number(priceMath[0].qty) < Number(x.qty)) {
            errorArray.push("Out Of Stock");
          } else {
            errorArray.push(null);
          }

          cartTotalPrice += x.qty * priceMath[0].price;
          cartTotalDiscountPrice += x.qty * priceMath[0].before_price;
        } else {
          if (!resData.isActive) {
            errorArray.push("Product Not Active");
          } else if (Number(resData.qty) < Number(x.qty)) {
            errorArray.push("Out Of Stock");
          } else {
            errorArray.push(null);
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

      try {
        const res = await axios.post(`${API_URL}/cart/allproducts`, { _id: arrayId });
        getCartProducts(res.data, cart.products);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      }
    }
  };

  useEffect(() => {
    getProducts();
  }, [cart]);

  const finalPrice = () => {
    const discount = Math.ceil((allPrice.total * cart.coupon_discount) / 100) || 0;
    return Math.floor(allPrice.total + (cart.cargo_price || 0) - discount);
  };

  return (
    <Box className="h-full relative">
      <Typography variant="h6" className="p-3 my-5 bg-gray-50 font-semibold">
        Cart Summary
      </Typography>
      <Box className="w-full px-4 mt-1">
        <Typography display="inline">Items Price</Typography>
        <Typography display="inline" className="float-right font-semibold">
          <Price data={allPrice.total} />
        </Typography>
      </Box>
      <Box className="w-full px-4 mt-1">
        <Typography display="inline">Shipping</Typography>
        <Typography display="inline" className="float-right font-semibold">
          <Price data={cart.cargo_price || 0} />
        </Typography>
      </Box>

      <Coupon total_price={allPrice.total} />

      <Box className="w-full px-4 text-lg mb-6 mt-4">
        <Typography variant="h6" display="inline">
          Total Price:
        </Typography>
        <Typography display="inline" className="float-right font-semibold text-primary">
          <Price data={finalPrice()} />
        </Typography>
      </Box>
    </Box>
  );
};

export default Default;