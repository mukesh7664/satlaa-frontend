import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useState, useEffect } from "react";
import router from "next/router";
import { Modal, Divider, message, Button } from "antd";
import Price from "../Price";
import { CheckSquareOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../config";
import func from "../../../util/helpers/func";
import { cartFetch, getCart as getCart_r } from "../../../redux/reducers/Cart";
import Coupon from "./Coupon";
import TagManager from "react-gtm-module";

const Default = () => {
  const cart = useSelector((state) => state.cart);

  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const { productShippingPrice, setProductShippingPrice } = useState(null);
  const [allPrice, setAllPrice] = useState({
    total: 0,
    discount: 0,
    cargo_price: 0,
    cargo_price_discount: 0,
  });
  const dispatch = useDispatch();
  const shipping_price = () => {
    if (productShippingPrice) {
      return productShippingPrice + 30;
    } else {
      return cart.shipping_charges;
    }
  };
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
    setAllPrice({
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
    TagManager.dataLayer({ dataLayer: null });
    TagManager.dataLayer({ dataLayer: dataLayerContent });
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
            // message.success({ content: "Next Stage :)", duration: 3 });
            await dispatch(getCart_r(user.id));
          })
          .catch((err) => {
            message.error({
              content: "Some Error, Please Try Again",
              duration: 3,
            });
            console.log(err);
          });
      } else {
        // message.success({ content: "Next Stage :)", duration: 3 });
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
    user_name: user.name, // Assume user.name is always available
    user_phone: user.prefix + user.phone, // Assume user.phone is always available
  };
  if (user.last_name) {
    userInfo.user_last_name = user.last_name;
  }
  if (user.email) {
    userInfo.user_email = user.email;
  }
  const dataLayerContent = {
    event: "begin_checkout",
    user_info: userInfo,
    ecommerce: {
      currency: "INR",
      value: allPrice.total, // Calculate and add the total value
      items: cart.products?.map((product) => ({
        // Simplified array mapping
        item_name: product.title,
        item_id: product.sku,
        price: product.price,
        brand: "SATLAA Jewellery",
        quantity: product.qty,
      })),
    },
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
          <Price data={shipping_price()} />
        </span>
      </div>
      {/* {allPrice.discount + 0 > 0 ? (
        <>
          <div className="w-full px-4 mt-1">
            <span>Total Discount:</span>
            <span className="float-right  line-through font-semibold">
              <Price data={allPrice.discount + 0} />
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
          <Price data={allPrice.total + Math.floor(shipping_price() || 0)} />
        </span>
        <p className="text-base text-gray-600 mt-2">
          Apply Discount at Checkout
        </p>
      </div>

      <div className="h-24">
        <button
          disabled={cart?.products.length > 0 ? false : true}
          className="bg-secondary rounded w-full h-auto absolute bottom-0 cursor-pointer hover:text-white  transition-all text-lg text-white p-4"
          onClick={onSubmit}
        >
          Procced to Checkout
        </button>
      </div>
    </div>
  );
};

export default Default;
