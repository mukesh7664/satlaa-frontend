// app/profile/orders/[order]/page.js
"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import Price from "@/myapp/components/Price";
import GoogleCustomerReviews from "@/myapp/components/Helper/GoogleCustomerReviews";
import TagManager from "react-gtm-module";
import { fetchData } from "@/util/fetchData";
import axiosInstance from "@/util/axios";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { API_URL } from "../../../../../config";

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

// ** Client Component for interactive logic **
export default function OrderPage({ params }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.login);
  const order = getOrder(params.order);

  useEffect(() => {
    fetchData(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      TagManager.dataLayer({ dataLayer: null });
      TagManager.dataLayer({
        dataLayer: {
          event: "purchase",
          user_info: {
            user_name: user?.name || "",
            user_last_name: user?.last_name || "",
            user_email: user?.email || "",
            user_phone: user?.prefix + user?.phone || "",
            customerBillingCountry: "IN",
            customerBillingPostcode: order?.shipping_address?.pin_code,
            customerBillingStreet: order?.shipping_address?.address,
            customerBillingCity: order?.shipping_address?.district,
            customerBillingRegion: order?.shipping_address?.state,
          },
          ecommerce: {
            currency: "INR",
            transaction_id: order?.ordernumber,
            value: order?.order_price,
            coupon: order?.coupon_code,
            items: order?.products.map((product) => ({
              item_name: product.title,
              item_id: product.sku,
              price: product.price,
              brand: "SATLAA Jewellery",
              quantity: product.qty,
            })),
          },
        },
      });
    }
  }, [order, user]);

  const getVariant = (data) => {
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="text-xs">
        {key}: {value}
      </div>
    ));
  };

  return (
    <div className="container-custom h-full grid grid-cols-12">
      <GoogleCustomerReviews
        orderId={order.ordernumber}
        email={order.receiver_email}
        deliveryCountry="IN"
        estimatedDeliveryDate="YYYY-MM-DD"
        products1={order.products.map((product) => ({ sku: product.sku }))}
      />
      <div className="col-span-12 shadow-lg my-5 bg-white p-6">
        {order ? (
          <>
            <h1 className="text-4xl text-primary font-semibold text-center mb-6">
              Order Placed
            </h1>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Order Number: {order.ordernumber}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold">Shipping Address</h3>
                <p>{order.receiver_name}</p>
                <p>{order.receiver_email}</p>
                <p>{order.receiver_phone}</p>
                <p>
                  {order.shipping_address.name}, {order.shipping_address.phone} <br />
                  {order.shipping_address.address}, {order.shipping_address.district}, {order.shipping_address.state}, {order.shipping_address.pin_code} <br />
                  {order.shipping_address.alternate_phone && order.shipping_address.alternate_phone}
                </p>
              </div>

              <div>
                <h3 className="font-bold">Products</h3>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="font-semibold">Title</th>
                      <th className="font-semibold hidden sm:table-cell">Variant</th>
                      <th className="font-semibold">Qty</th>
                      <th className="font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((x, i) => (
                      <tr key={i} className="border-b">
                        <td className="font-semibold">
                          <Link href={`/products/${x.seo}`}>{x.title}</Link>
                          <span className="block sm:hidden mt-3">{getVariant(x.selectedVariants)}</span>
                        </td>
                        <td className="hidden sm:table-cell">{getVariant(x.selectedVariants)}</td>
                        <td>{x.qty}</td>
                        <td><Price data={x.price * x.qty} /></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="font-semibold">Order Price:</td>
                      <td><Price data={Number(order.order_price)} /></td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Total Discount:</td>
                      <td><Price data={Number(order.total_discount)} /></td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Shipping Charges:</td>
                      <td><Price data={Number(order.shipping_price)} /></td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Total Price:</td>
                      <td><Price data={Number(order.total_price + order.shipping_price)} /></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="col-span-12 text-center mt-6">
              <Link href="/" className="inline-flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded">
                <FiShoppingBag className="mr-2" />
                Shop More
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center">No order details found.</p>
        )}
      </div>
    </div>
  );
}

// **Metadata for SEO**
export async function generateMetadata({ params }) {
  return {
    title: `Order ${params.order}`,
  };
}