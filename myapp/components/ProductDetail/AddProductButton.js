import { useDispatch } from "react-redux";
import { message } from "@mui/material";
import { Modal } from "@mui/material";
import LoginForm from "../Header/LoginForm";

import Link from "next/link";
import { useSelector } from "react-redux";

import { useState, useEffect } from "react";
import { addProductToCart, cartFetch } from "../../../redux/reducers/Cart";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../../../config";
// import RazorpayAffordability from "../../components/Payments/RazorpayAffordability";
import { useRouter } from "next/router";
import Loader from "@/components/Utils/Loader";
import TagManager from "react-gtm-module";
import Image from "next/image";

const Page = ({
  form,
  disabledVariant = true,
  seTloadingButton,
  loadingButton,
  cart,
  state,
  priceAdd,
  getCart,
}) => {
  const dispatch = useDispatch();

  // const seo = router.query.seo
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // for login modal dialog
  const { isAuthenticated, user } = useSelector(({ login }) => login);
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
    event: "add_to_cart",
    user_info: userInfo,
    ecommerce: {
      currency: "INR",
      value: state.price,
      items: [
        {
          item_name: state.title, // Name or ID is required.
          item_id: state.sku, // Name or ID is required.
          price: state.price,
          brand: "SATLAA Jewellery",
          quantity: 1, // Optional fields may be omitted or set to null.
        },
      ],
    },
  };


  const addCart = (res) => {
    setIsLoading(true);
    TagManager.dataLayer({ dataLayer: null });
    TagManager.dataLayer({ dataLayer: dataLayerContent });
console.log(res,'datares')
    const productsDataArray = cart.products;
    const productsData = [];

    if (state.type) {
      const variantControl = productsDataArray.find(
        (x) =>
          (x.product_id._id == state._id || x.product_id == state._id) &&
          JSON.stringify(x.selectedVariants) == JSON.stringify(res)
      );
      const variantControlNot = productsDataArray.filter(
        (x) => JSON.stringify(x.selectedVariants) != JSON.stringify(res)
      );
      if (variantControl == undefined) {
        productsData.push(...productsDataArray, {
          product_id: state._id,
          selectedVariants: res,
          seo: state.seo,
          qty: 1,
          price: state.price,
          sku: state.sku,
        });
      } else {
        productsData.push(...variantControlNot, {
          product_id: state._id,
          selectedVariants: res,
          seo: state.seo,
          qty: variantControl.qty + 1,
          price: state.price,
          sku: state.sku,
        });
      }
    } else {
      console.log(productsDataArray,'prd')
      const variantControlId = productsDataArray.find(
        (x) => x.product_id._id == state._id || x.product_id == state._id
      );
      const variantControlIdNot = productsDataArray.filter(
        (x) =>
          JSON.stringify(x.selectedVariants) != JSON.stringify(res) &&
          x.product_id != state._id
      );

      if (variantControlId == undefined) {
        productsData.push(...productsDataArray, {
          product_id: state._id,
          selectedVariants: undefined,
          seo: state.seo,
          qty: 1,
          price: state.price,
          sku: state.sku,
        });
      } else {
        productsData.push(...variantControlIdNot, {
          product_id: state._id,
          selectedVariants: undefined,
          seo: state.seo,
          qty: variantControlId.qty + 1,
          price: state.price,
          sku: state.sku,
        });
      }
    }

    
    const post = {
      products: productsData.sort(
        (a, b) =>
          (a.seo + JSON.stringify(a.selectedVariants)).length -
          (b.seo + JSON.stringify(b.selectedVariants)).length
      ),
    };

    if (isAuthenticated) {
      post.created_user= {
        name: user.name,
        id: user.id,
      },
      post.customer_id= user.id,
      axios
        .post(`${API_URL}/cart/${cart._id}`, post)
        .then(() => {
          getCart(user.id);
          seTloadingButton(true);
          form.resetFields();
          message.success({ content: "Product Added!", duration: 3 });
        })
        .catch((err) => {
          message.error({
            content: "Some Error, Please Try Again",
            duration: 3,
          });
        });
    } else {
      seTloadingButton(true);
      form.resetFields();
      message.success({ content: "Product Added!", duration: 3 });
      dispatch(cartFetch(post));
    }
  };

  return (
    <div className="flex flex-col md:flex-row z-40 gap-y-2 md:gap-x-2 bg-white">
      <Loader loading={!loadingButton} />
      <div className="flex md:relative  gap-x-2 fixed bottom-0 font-bold py-1 px-1 left-0 z-40 w-full  bg-white">
        <button
          className="w-full rounded-sm shadow-md bg-primary py-2 text-white border transition duration-200 border-transparent hover:text-primary hover:bg-white hover:border-secondary hover:border capitalize"
          // className="xl:w-4/12 w-full border-primary bg-primary text-2xl h-auto hover:bg-white hover:border-primary hover:text-primary"

          disabled={!disabledVariant}
          onClick={() => {
            form
              .validateFields()
              .then((res) => {
                // if (!isAuthenticated) {
                //   setFormResult(res);
                //   openLogin();
                //   return;
                // }
                seTloadingButton(false);
                if (loadingButton) {
                  addCart(res);
                }
              })
              .catch((err) => console.log("err", err));
          }}
        >
          ADD TO CART
          {/* {loadingButton ? (
        <ShoppingCartOutlined />
      ) : (
        <LoadingOutlined className="animate-spin h-5 w-5 mr-3" />
      )} */}
        </button>

        <button
          className="w-full rounded-sm shadow-md bg-primary py-2 text-white border border-transparent transition duration-200"
          disabled={!disabledVariant}
          onClick={() => {
            form
              .validateFields()
              .then((res) => {
                // if (!isAuthenticated) {
                //   setFormResult(res);
                //   openLogin();
                //   return;
                // }
                seTloadingButton(false);
                if (loadingButton) {
                  addCart(res);
                  router.push("/cart");
                }
              })
              .catch((err) => console.log("err", err));
          }}
        >
          BUY NOW
          {/* {loadingButton ? (
        <CreditCardOutlined />
      ) : (
        <LoadingOutlined className="animate-spin h-5 w-5 mr-3" />
      )} */}
        </button>
      </div>
    
    </div>
  );
};

export default Page;
