import { useEffect, useOrder } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Link from "next/link";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../../../../config";

import Head from "@/myapp/core/Head";
import Price from "@/myapp/components/Price";
import { wrapper } from "@/redux/store";
import authservice from "@/util/services/authservice";
import { cartFetch } from "@/redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";
import { FiShoppingBag } from "react-icons/fi";
import { fetchData } from "@/util/fetchData";
import TagManager from "react-gtm-module";
import { message } from "@mui/material";
import { useState } from "react";
import { ErrorMessage, Field, Formik, Form } from "formik";
import GoogleCustomerReviews from "../../../../myapp/components/Helper/GoogleCustomerReviews";

const Page = ({ order }) => {
  const { user } = useSelector((state) => state.login);
  const mapCartProductsToItems = (cartProducts) => {
    return cartProducts.map((product) => ({
      item_name: product.title, // assume the product object has a name property
      item_id: product.sku, // and an id property
      price: product.price, // and a price property
      brand: "SATLAA Jewellery", // fixed value
      variant: "", // placeholder, fill in with actual value if available
      list: "", // placeholder, fill in with actual value if available
      position: "", // placeholder, fill in with actual value if available
      quantity: product.qty, // assume the product object has a qty property
    }));
  };

  let userInfo = {
    user_name: user.name, // Assume user.name is always available
    user_phone: user.prefix + user.phone, // Assume user.phone is always available
    customerBillingCountry:"IN",
    customerBillingPostcode:order.shipping_address.pin_code,
    customerBillingStreet:order.shipping_address.address,
    customerBillingCity:order.shipping_address.district,
    customerBillingRegion:order.shipping_address.state
  };
  if (user.last_name) {
    userInfo.user_last_name = user.last_name;
  }
  if (user.email) {
    userInfo.user_email = user.email;
  }

  const dataLayerContent = {
    event: "purchase",
    user_info: userInfo,

    ecommerce: {
      currency: "INR",
      transaction_id: order.ordernumber,
      value: order.order_price,
      coupon: order.coupon_code,
      items: mapCartProductsToItems(order.products),
    },
  };

  if (typeof window !== "undefined") {
    TagManager.dataLayer({ dataLayer: null });
    TagManager.dataLayer({ dataLayer: dataLayerContent });
  }
  const getVariant = (data) => {
    const variants = [];

    for (const property in data) {
      variants.push(
        <div className="text-xs ">
          {" "}
          {property}: {data[property]}{" "}
        </div>
      );
    }
    return variants.length > 0 ? <> {variants}</> : <> </>;
  };
  return (
    <div className="container-custom h-full grid grid-cols-12 ">
      <Head title="Order Placed" />
      <GoogleCustomerReviews
        orderId={order.ordernumber}
        email={order.receiver_email}
        deliveryCountry="IN"
        estimatedDeliveryDate="YYYY-MM-DD"
        products1={order.products.map((product) => ({ sku: product.sku }))}
      />
      <div className="col-span-12 shadow-lg my-5">
        <div className="grid grid-cols-12 p-2 sm:p-10 bg-white">
          {order ? (
            <>
              <div className="text-4xl col-span-12 text-primary font-semibold text-center mb-10">
                Order Placed
              </div>
              <div className="text-2xl col-span-12   font-semibold text-center mb-10">
                Order Number:{order.ordernumber}{" "}
              </div>
              <div className="col-span-6">
                <div className="font-bold">Shipping Address</div>
                <div>{order.receiver_name}</div>
                <div>{order.receiver_email}</div>
                <div>{order.receiver_phone}</div>

                <div>
                  {order.shipping_address.name}, {order.shipping_address.phone}{" "}
                  <br />
                  {order.shipping_address.address},{" "}
                  {order.shipping_address.district},{" "}
                  {order.shipping_address.state},{" "}
                  {order.shipping_address.pin_code} <br />
                  {order.shipping_address.alternate_phone &&
                    order.shipping_address.alternate_phone}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 mt-10 sm:mt-0 ">
                <div className="font-bold">Products</div>
                <table className="w-full ">
                  <tr className="bg-gray-50">
                    <td className="font-semibold">Title</td>
                    <td className="font-semibold hidden sm:block">Variant</td>
                    <td className="font-semibold">Qty</td>
                    <td className="font-semibold"> Price</td>
                  </tr>
                  {order.products &&
                    order.products.map((x, i) => (
                      <tr className="h-16 border-b " key={i}>
                        <td className="border-b font-semibold">
                          <Link href={"/products/" + x.seo} legacyBehavior>
                            {x.title}
                          </Link>
                          <span className="block sm:hidden mt-3">
                            {getVariant(x.selectedVariants)}
                          </span>
                        </td>
                        <td className="hidden sm:block pt-3">
                          {getVariant(x.selectedVariants)}
                        </td>
                        <td>{x.qty}</td>
                        <td>
                          <Price data={x.price * x.qty} />
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td className="hidden sm:block"> </td>
                    <td className="hidden sm:block"> </td>
                    <td className="font-semibold">
                      <br />
                      Order Price:
                    </td>
                    <td className="font-bold">
                      <br />
                      <Price data={Number(order.order_price)} />
                    </td>
                  </tr>
                  <tr>
                    <td className="hidden sm:block"> </td>
                    <td className="hidden sm:block"> </td>
                    <td className="font-semibold">
                      <br />
                      Total Discount:
                    </td>
                    <td className="font-bold">
                      <br />
                      <Price data={Number(order.total_discount)} />
                    </td>
                  </tr>
                  <tr>
                    <td className="hidden sm:block"> </td>
                    <td className="hidden sm:block"> </td>
                    <td className="font-semibold">
                      <br />
                      Shipping Charges:
                    </td>
                    <td className="font-bold">
                      <br />
                      <Price data={Number(order.shipping_price)} />
                    </td>
                  </tr>{" "}
                  <tr>
                    <td className="hidden sm:block"> </td>
                    <td className="hidden sm:block"> </td>
                    <td className="font-semibold">
                      <br />
                      Total Price:
                    </td>
                    <td className="font-bold">
                      <br />
                      <Price
                        data={Number(order.total_price + order.shipping_price)}
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </>
          ) : (
            ""
          )}

          <div className="col-span-12 text-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded"
            >
              <FiShoppingBag className="mr-2" />
              Shop More
            </Link>
          </div>
        </div>
     
      </div>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    await fetchData(store.dispatch);
    const order_id = context.params.order;
    const { req } = context;
    let orderData = {};
    if (!req.cookies.token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    const axios = axiosInstance(context);
    const auth = await authservice.isAuthenticated(context);

    if (auth.isAuthenticated) {
      await store.dispatch(cartFetch(auth.userCart));
      await store.dispatch(setLogin(auth.user));
      await store.dispatch(setIsAuthenticated(true));
    }
    try {
      const res = await axios.get(`${API_URL}/orders/${order_id}`, {
        headers: {
          Cookie: req.headers.cookie || "",
        },
      });
      orderData = res.data;
    } catch (err) {
      console.error(err);
      return {
        redirect: {
          destination: "/profile/orders",
          permanent: false,
        },
      };
    }
    if (!orderData) {
      return {
        redirect: {
          destination: "/profile/orders",
          permanent: false,
        },
      };
    }
    return {
      props: {
        order: orderData,
      },
    };
  }
);

export default Page;
