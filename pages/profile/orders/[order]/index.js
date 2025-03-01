import { useRouter } from "next/router";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../../../../config";
import Head from "next/head";
import { Modal } from "@mui/material";
import Link from "next/link";
import Loader from "@/components/Utils/Loader";
import { FiShoppingBag } from "react-icons/fi";
import { FaBan } from "react-icons/fa";
import Breadcrumbs from "@/myapp/components/Utils/BreadCrumbs";
import { useState } from "react";
import { wrapper } from "@/redux/store";
import authservice from "@/util/services/authservice";
import { cartFetch } from "@/redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";
import { fetchData } from "@/util/fetchData";
import Script from "next/script";
import { useSelector } from "react-redux";

function OrderPage({ order }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.login);

  const cancelOrder = async () => {
    Modal.confirm({
      title: "Do you want to cancel this order?",
      content: "Once you click on Yes, this order will be cancelled.",
      onOk: async function () {
        try {
          const res = await axios.put(
            `${API_URL}/orders/cancel/${order.ordernumber}`
          );
          if (res.status === 200) {
            router.reload(); // Reload the page to reflect the updated status
          }
        } catch (err) {
          console.error(err);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const returnOrder = async () => {
    Modal.confirm({
      title: "Do you want to cancel this order?",
      content: "Once you click on Yes, this order will be cancelled.",
      onOk: async function () {
        try {
          const res = await axios.put(
            `${API_URL}/orders/return/${order.ordernumber}`
          );
          if (res.status === 200) {
            router.reload(); // Reload the page to reflect the updated status
          }
        } catch (err) {
          console.error(err);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const retryPayment = async () => {
    setIsLoading(true);
    try {
      // Call the backend endpoint to create a new Razorpay payment instance
      const responseServer = await axios.post(
        `${API_URL}/payment/razorpay/retry-payment`,
        {
          orderId: order.ordernumber,
        }
      );
      const paymentDetails = responseServer.data;
      const payload = {};
      // Open Razorpay modal with the new payment details
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentDetails.amount,
        order_id: paymentDetails.id,
        handler: async (responseOrderCreated) => {
          if (!responseOrderCreated.razorpay_payment_id) {
            alert("Payment cancelled by the user.");
            // Additional cancellation handling
            return;
          }

          payload.razorpay_order_id = responseOrderCreated.razorpay_order_id;
          payload.razorpay_payment_id =
            responseOrderCreated.razorpay_payment_id;
          payload.razorpay_signature = responseOrderCreated.razorpay_signature;
          payload.order_id = order.ordernumber;
          payload.user = user;
          // Verify the payment signature and update the order
          await axios.post(
            `${API_URL}/payment/razorpay/verify-payment`,
            payload
          );
          router.push(
            "/profile/orders/" + order.ordernumber + "/order-success"
          );
          // Clear the cart and redirect to the success page
        },
        prefill: {
          name: user.name,
          // email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#e26f83",
        },
        // ...other options like prefill, theme, etc.
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error in retrying payment: ", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="container mx-auto px-4">
        <Loader loading={isLoading} />
        <Breadcrumbs
          items={[
            {
              path: "/",
              title: "Home",
            },
            {
              path: "/profile",
              title: "Profile",
            },
            {
              path: "/profile/orders",
              title: "Orders",
            },
            {
              title: order.ordernumber,
            },
          ]}
        />

        <div className="mt-8">
          <div className="mt-8 p-4 bg-white shadow-lg">
            {!order.isPaid && !order.orderEvents.cancelled.status && (
              <div className="p-2">
                <p className="text-bold text-xl">
                  Payment is Pending please try again otherwise order will be
                  cancelled. If it deducted from your account it will be
                  refunded.
                </p>
                <button
                  className="text-xl bg-green-500 mt-2 px-4 py-2 text-white"
                  onClick={retryPayment}
                >
                  Retry Payment
                </button>
              </div>
            )}
            <h2 className="text-xl font-bold mb-4">Order Info</h2>

            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="font-bold">Status</dt>
              <dd
                className={`font-semibold ${
                  order.orderEvents.delivered.status &&
                  !order.orderEvents.returned.status
                    ? "text-green-500"
                    : "text-black"
                }`}
              >
                {order.order_status}
              </dd>
              <dt className="font-bold">Order Number</dt>
              <dd>{order.ordernumber}</dd>

              <dt className="font-bold">Payment Mode</dt>
              <dd>{order.payment_mode}</dd>

              <dt className="font-bold">Total Order Price</dt>
              <dd>{order.order_price || "N/A"}</dd>
              <dt className="font-bold">Discount Price</dt>
              <dd>{order.total_discount || "N/A"}</dd>
              <dt className="font-bold">Shipping Charges</dt>
              <dd>{order.shipping_price || "N/A"}</dd>
              <dt className="font-bold">Total Price</dt>
              <dd>{order.total_price + order.shipping_price}</dd>

              <dt className="font-bold">Tracking Link</dt>
              <dd>
                {order.tracking_link ? (
                  <a
                    href={order.tracking_link}
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                    target="_blank"
                  >
                    Track
                  </a>
                ) : (
                  "Not Yet Dispatched"
                )}
              </dd>

              <dt className="font-bold">Shipping Address</dt>
              <dd>
                {order.shipping_address.name}, {order.shipping_address.phone}{" "}
                <br />
                {order.shipping_address.address},{" "}
                {order.shipping_address.district},{" "}
                {order.shipping_address.state},{" "}
                {order.shipping_address.pin_code} <br />
                {order.shipping_address.alternate_phone &&
                  order.shipping_address.alternate_phone}
              </dd>
            </dl>

            <h2 className="text-xl font-bold mt-6 mb-4">Items</h2>
            {order.products.map((item, index) => (
              <div key={index} className="flex space-x-4 items-center">
                <Link
                  href={`/products/${item.seo}`}
                  className="text-blue-500 hover:underline"
                >
                  {item.title}
                </Link>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="font-bold">Price</dt>
                  <dd>{item.price}</dd>

                  <dt className="font-bold">Original Price</dt>
                  <dd>{item.before_price}</dd>

                  <dt className="font-bold">Quantity</dt>
                  <dd>{item.qty}</dd>
                </dl>
              </div>
            ))}

            <div className="flex justify-center space-x-4 mt-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded"
              >
                <FiShoppingBag className="mr-2" />
                Shop More
              </Link>

              {!order.orderEvents.shipped.status &&
                !order.orderEvents.delivered.status &&
                !order.orderEvents.cancelled.status && (
                  <button
                    onClick={cancelOrder}
                    className="inline-flex items-center justify-center px-4 py-2 text-red-500 hover:underline"
                  >
                    <FaBan className="mr-2" />
                    Cancel The Order
                  </button>
                )}

              {order.orderEvents.delivered.status &&
                !order.orderEvents.returned.status && (
                  <button
                    onClick={returnOrder}
                    className="inline-flex items-center justify-center px-4 py-2 text-purple-500 hover:underline"
                  >
                    <FaBan className="mr-2" />
                    Return The Order
                  </button>
                )}
            </div>
          </div>
          <div className="space-y-4 mt-2">
            <p className="font-bold text-lg">Note</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Once the Orders is dispatched it can&rsquo;t be cancelled. It
                will automatically get cancelled if you reject at delivery.
              </li>
              <li>Items can be returned up to 7 days of delivery.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { order } = context.params;
    const { req } = context;
    await fetchData(store.dispatch);
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
      const res = await axios.get(`${API_URL}/orders/${order}`, {
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
    console.log(orderData);
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

export default OrderPage;
