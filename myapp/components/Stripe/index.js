import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { API_URL } from "../../../../config";
import CheckoutForm from "./CheckoutForm";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.

export default function Default({ cart, public_key, contract }) {
   const [clientSecret, setClientSecret] = useState("");
   const stripePromise = loadStripe(public_key);

   const getProductAmounth = () => {
      if (cart.products?.length > 0) {
         const arrayId = [];
         cart.products?.map((x) => {
            arrayId.push(x.product_id);
         });
         axios
            .post(API_URL + "/payment/stripe", {
               ids: arrayId,
               items: cart.products,
               cargoes_id: cart.cargoes_id,
               allCart: cart,
            })
            .then((res) => setClientSecret(res.data.clientSecret));
      }
   };

   useEffect(() => {
      getProductAmounth();
   }, [cart]);

   const appearance = {
      theme: "stripe",
   };
   const options = {
      clientSecret,
      appearance,
   };

   return (
      <div>
         {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
               <CheckoutForm contract={contract} />
            </Elements>
         )}
      </div>
   );
}
