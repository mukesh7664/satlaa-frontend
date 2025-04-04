// app/profile/orders/[order]/page.js

// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Link from "next/link";
// import { FiShoppingBag } from "react-icons/fi";
// import Price from "@/myapp/components/Price";
// import GoogleCustomerReviews from "@/myapp/components/Helper/GoogleCustomerReviews";
// import TagManager from "react-gtm-module";
// import { fetchData } from "@/util/fetchData";
import axiosInstance from "@/util/axios";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { API_URL } from "../../../../../config";
import OrderSuccessClient from "@/components/Profile/order-success";

// ** Fetch order data on the server **
async function getOrder(orderId) {
  const token = cookies().get("token")?.value;
  if (!token) redirect("/");

  try {
    const axios = axiosInstance();
    const res = await axios.get(`${API_URL}/orders/${orderId}`, {
      headers: { Cookie: `token=${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching order:", err);
    notFound();
  }
}

export async function generateMetadata({ params }) {
  return {
    title: `Order ${params.order}`,
  };
}

export default async function OrderPage({ params }) {
  const order = await getOrder(params.order);
  
  return <OrderSuccessClient order={order} />;
}