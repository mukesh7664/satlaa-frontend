"use client"

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import func from "../../../util/helpers/func";
import { API_URL } from "../../../config";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getCart as getCart_r } from "../../../redux/reducers/Cart";
import { cartFetch } from "../../../redux/reducers/Cart";
import Link from "next/link";
import { LiaExchangeAltSolid } from "react-icons/lia";
import Loader from "@/components/Utils/Loader";
import Head from "../../../myapp/core/Head";
import DetailPricePay from "../../../myapp/components/Cart/DetailPricePay";
import { FaWhatsapp } from "react-icons/fa";
const items = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/cart",
    title: "Cart",
  },
  {
    path: "/cart/address",
    title: "Address",
  },
  {
    path: "",
    title: "Payment",
  },
];
import Breadcrumbs from "../../../myapp/components/Utils/BreadCrumbs";
import authservice from "../../../util/services/authservice";
import { setIsAuthenticated, setLogin } from "../../../redux/reducers/Login";
import { wrapper } from "../../../redux/store";
import TagManager from "react-gtm-module";
import { fetchData } from "../../../util/fetchData";
import Script from "next/script";
import { ErrorMessage, Field, Formik, Form } from "formik";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const cart= useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [shippingAddress, seTshippingAddress] = useState({});
  const [shipping_charges, setShipping_charges] = useState(60);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.login);


  const onChangePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value === "razorpay") {
      // Assuming 'updateCart' is your Redux action to update the cart
      dispatch(cartFetch({ ...cart, cargo_price: 0 }));
    } else {
      dispatch(cartFetch({ ...cart, cargo_price: 50 }));
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

      seTshippingAddress(cart.shipping_address);
    }
  };
  useEffect(() => {
    // Fetch and store data client-side
    fetchData(dispatch);
  }, [dispatch]);
  
  useEffect(() => {
    getProducts();
  }, [cart]);

  const initiatePayment = async () => {
    setIsLoading(true);
    let response;
    const arrayId = [];
    cart.products?.map((x) => {
      arrayId.push(x.product_id);
    });
    let payload = {
      user: user,
      ids: arrayId,
      items: cart.products,
      cart: cart,
      shipping_charges: shipping_charges,
    };

    if (paymentMethod === "razorpay") {
      payload.shipping_charges = payload.shipping_charges - 30;
      await initiateRazorPayPayment(payload);
    } else {
      response = await axios.post(
        `${API_URL}/payment/cod/create-order`,
        payload
      );
      console.log(response.data);
      resetCart(cart, response.data.order.ordernumber, false);
    }
  };

  // Function to reset the cart
  const resetCart = async (cart, orderId, pending) => {
    if (cart.products?.length > 0) {
      const arrayId = [];

      cart.products?.map((x) => {
        arrayId.push(x.product_id);
      });

      const id = cart._id;
      const cartWithoutId = { ...cart };
      delete cartWithoutId._id;

      cartWithoutId.products = [];
      cartWithoutId.cargoes_id = null;
      cartWithoutId.total_price = 0;
      cartWithoutId.total_discount = 0;
      cartWithoutId.coupon = "";
      cartWithoutId.cargo_price = 0;
      cartWithoutId.cargo_price_discount = 0;

      await axios
        .post(`${API_URL}/cart/${id}`, cartWithoutId)
        .then(async () => {
          await dispatch(getCart_r(user.id));
          if (pending) {
            router.push("/profile/orders/" + orderId);
          } else {
            router.push("/profile/orders/" + orderId + "/order-success");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const initiateRazorPayPayment = async (payload) => {
    const responseServer = await axios.post(
      `${API_URL}/payment/razorpay/create-order`,
      payload
    );
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      currency: responseServer.data.order.currency,
      amount: responseServer.data.order.amount,
      order_id: responseServer.data.order.id,
      modal: {
        ondismiss: function () {
          // Handle the modal close event
          // alert(responseServer.data.order.receipt);
          resetCart(cart, responseServer.data.order.receipt, true);
          setIsLoading(false);
          // You can add more logic here as per your requirement
        },
      },
      // image: logoBase64,
      handler: async function (responseOrderCreated) {
        if (!responseOrderCreated.razorpay_payment_id) {
          alert("Payment cancelled by the user.");
          // Additional cancellation handling
          return;
        }

        payload.razorpay_order_id = responseOrderCreated.razorpay_order_id;
        payload.razorpay_payment_id = responseOrderCreated.razorpay_payment_id;
        payload.razorpay_signature = responseOrderCreated.razorpay_signature;
        payload.user = user;
        payload.order_id = responseServer.data.order.receipt;
        // Verify the payment signature and update the order
        const response = await axios.post(
          `${API_URL}/payment/razorpay/verify-payment`,
          payload
        );

        // Clear the cart and redirect to the success page
        resetCart(cart, response.data.order);
      },
      prefill: {
        name: user.name,
        // email: user.email,
        contact: user.phone,
      },
      theme: {
        color: "#e26f83",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("modal.close", function () {
      // Handle the event when the Razorpay modal is closed
      // For example, you might want to reset certain state variables or display a message
      console.log("Payment modal closed by the user");
    });
    paymentObject.on("payment.failed", function (response) {
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
    });
  };

  return (
    <div className="container-custom">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <Loader loading={isLoading} />

      <div className="flex justify-center">
        <Breadcrumbs items={items} />
      </div>
      {cart.products?.length > 0 ? (
        <div className="flex md:flex-wrap flex-wrap-reverse my-8 gap-9">
          <div className="flex-1 min-w-0 md:mx-2 bg-white p-5 order-2">
            <div className="w-full bg-white rounded p-4">
              {shippingAddress ? (
                <>
                  <div>
                    <div className="text-2xl font-medium text-black">
                      Deliver to
                    </div>
                    <div className="text-base font-semibold py-3  mt-2">
                      <b>{shippingAddress.name} </b>
                      <br />
                      <div className="flex w-full justify-between pt-1 ">
                        {shippingAddress.phone}
                        <br />
                        {shippingAddress.address}
                        <br />
                        {shippingAddress.district},{shippingAddress.state},
                        {shippingAddress.pin_code}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/cart/address"
                    className="mt-2 flex items-center underline"
                  >
                    <LiaExchangeAltSolid className="mr-2" /> Change Address
                  </Link>
                </>
              ) : (
                <div className="text-red-500 text-center font-semibold p-4">
                  Please Select Address
                </div>
              )}
            </div>

            <div className="m-4 flex flex-col py-5 bg-white order-2 lg:order-1">
              <h2 className="font-semibold text-2xl mb-4">Payment Method</h2>

            <RadioGroup
            onValueChange={onChangePaymentMethod}
            value={paymentMethod}
            className="flex flex-col px-2 py-4 gap-y-2 text-lg"
          >
            {/* <div className="flex items-center gap-x-2">
              <RadioGroupItem value="phonepe" id="phonepe" />
              <Label htmlFor="phonepe" className="text-xl">UPI/Cards/Net Banking</Label>
            </div> */}
            
            <div className="flex items-center gap-x-2">
              <RadioGroupItem value="razorpay" id="razorpay" />
              <Label htmlFor="razorpay" className="text-xl">Online</Label>
            </div>

            <div className="flex items-center gap-x-2 opacity-50 cursor-not-allowed">
              <RadioGroupItem value="cod" id="cod" disabled />
              <Label htmlFor="cod" className="text-xl">COD (COD not available for this order)</Label>
            </div>
          </RadioGroup>
              {paymentMethod === "cod" ? (
                <p>
                  Choose Online Payment and Get ₹50 discount for Free Shipping
                  and Faster Delivery.
                </p>
              ) : (
                <p>You Got ₹50 discount for Free Shipping</p>
              )}

              <button
                disabled={!paymentMethod}
                onClick={initiatePayment}
                className="w-full lg:w-auto mt-8 px-6 py-4 text-xl bg-secondary text-white rounded disabled:opacity-50"
              >
                Complete Order
              </button>
              <div className="flex mt-4 font-semibold">
                <p>Still Need Help, Chat with Us &nbsp;</p>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://api.whatsapp.com/send?phone=919257120925&text=I%20want%20to%20know%20about%20https://satlaa.com${router.asPath}`}
                  className="flex items-center justify-center text-base rounded  text-[#25D366] hover:text-[#398f58] font-bold transition duration-100"
                >
                  <FaWhatsapp className="text-lg mr-1" /> Here
                </a>
              </div>
            
            </div>
          </div>

          <div className="lg:flex-1 w-full h-full md:mx-4 shadow-lg bg-white p-5 order-3">
            <DetailPricePay />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center content-center mt-4 space-x-4 bg-white p-4 rounded  md:space-x-0 md:flex-col md:items-start">
          <p className="text-gray-800 text-lg mb-2 md:mb-4">
            Your Cart is Empty
          </p>
          <Link
            href="/"
            className="bg-primary  hover:text-white px-4 py-2 text-white inline-block rounded transition duration-200 ease-in-out w-full md:w-auto"
          >
            Add Some Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;