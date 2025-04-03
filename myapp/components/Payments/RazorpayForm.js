import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../../../config";
import { getCart as getCart_r } from "../../../redux/reducers/Cart";
import { cartFetch } from "../../../redux/reducers/Cart";
import Script from "next/script";

export default function RazorpayForm({ cart, onRazorpaySelected}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.login);

  const [isChecked, setIsChecked] = useState(false);

  const handleRadioChange = () => {
    setIsChecked(!isChecked);
    onRazorpaySelected();
  };

  const initiatePayment = async () => {
    const arrayId = [];
    cart.products?.map((x) => {
       arrayId.push(x.product_id);
    });
    let response = await axios.post(
      `${API_URL}/payment/razorpay/create-order`,
      {
        ids: arrayId,
        items: cart.products,
        shipping_charges: 50,
        allCart: cart,
      }
    );
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      currency: response.data.order.currency,
      amount: response.data.order.amount,
      order_id: response.data.order.id,
      // image: logoBase64,
      handler: async function (response) {
        const payload = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          cart: cart,
          user: user,
          ids:arrayId,
          items: cart.products,
          allCart: cart,
        };

        // Verify the payment signature and update the order
        await axios.post(`${API_URL}/payment/razorpay/verify-payment`, payload);

        // Clear the cart and redirect to the success page
        resetCart(cart, response);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: {
        color: "#F37254",
      },
      modal: {
        ondismiss: function() {
          // Redirect to the success page
          router.push("/cart/checkout?order_id=" + response.razorpay_order_id);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function () {
      alert("Payment failed. Please try again. Contact support for help");
    });
  };

  // Function to reset the cart
  const resetCart = async (cart, response) => {
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
      cartWithoutId.cargo_price = 0;
      cartWithoutId.cargo_price_discount = 0;
  
      if (isAuthenticated) {
        await axios
          .post(`${API_URL}/cart/${id}`, cartWithoutId)
          .then(async () => {
            await dispatch(getCart_r(user.id));
            router.push(
              "/cart/checkout?order_id=" + response.razorpay_order_id
            );
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        await dispatch(cartFetch(cartWithoutId));
        router.push(
          "/cart/checkout?order_id=" + response.razorpay_order_id
        );
      }
    }
  };
  

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
       <div className="flex items-center mb-4">
        <input
          type="radio"
          id="razorpay-radio"
          checked={isChecked}
          onChange={handleRadioChange}
          className="mr-2"
        />
        <label htmlFor="razorpay-radio">Pay with Razorpay</label>
      </div>
      <button
        onClick={() => {
          initiatePayment();
        }}
        className="bg-black text-white p-4 rounded"
      >
        Pay with Razorpay
      </button>
    </>
  );
}
