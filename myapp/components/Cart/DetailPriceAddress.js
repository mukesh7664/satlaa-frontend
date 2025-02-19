import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useState, useEffect } from "react";
import router from "next/router";
import { Button, Divider, Typography, Paper, Box, Stack } from "@mui/material";
import Price from "../Price";
import { MdLockOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";
import { cartFetch, getCart as getCart_r } from "../../../redux/reducers/Cart";

const Default = () => {
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
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ bgcolor: "grey.100", p: 2 }}>
        Shipping Address Summary
      </Typography>

      <Box sx={{ p: 2 }}>
        {shipping_address && shipping_address.address ? (
          <>
            <Typography variant="body1" fontWeight="bold">
              {shipping_address.name}
            </Typography>
            <Typography variant="body2">
              {shipping_address.address}, {shipping_address.district},{" "}
              {shipping_address.state}, {shipping_address.pin_code}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" color="error" textAlign="center">
            Please Select Address
          </Typography>
        )}
      </Box>

      <Typography variant="h6" gutterBottom sx={{ bgcolor: "grey.100", p: 2, mt: 3 }}>
        Cart Summary
      </Typography>

      <Stack spacing={1} sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography>Items Price</Typography>
          <Typography fontWeight="bold">
            <Price data={allPrice.total} />
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Typography>Shipping</Typography>
          <Typography fontWeight="bold">
            <Price data={cart.cargo_price} />
          </Typography>
        </Box>

        <Divider />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Total Price:</Typography>
          <Typography fontWeight="bold" color="primary">
            <Price data={allPrice.total + (cart.cargo_price || 0)} />
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          Apply Discount at Checkout
        </Typography>
      </Stack>

      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<MdLockOutline />}
          disabled={!shipping_address?.address}
          sx={{ py: 1.5, px: 4 }}
          onClick={onSubmit}
        >
          Checkout Securely
        </Button>
      </Box>
    </Paper>
  );
};

export default Default;