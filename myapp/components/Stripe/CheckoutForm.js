"use client";

import { useEffect, useState } from "react";
import {
   PaymentElement,
   useStripe,
   useElements,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { getCart as getCart_r } from "../../../redux/reducers/Cart";
import { cartFetch } from "../../../redux/reducers/Cart";
import axiosInstance from "@/util/axios";
import { API_URL } from "../../../config";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const axios = axiosInstance();

export default function CheckoutForm({ contract }) {
   const stripe = useStripe();
   const elements = useElements();
   const dispatch = useDispatch();
   const router = useRouter();
   const cart = useSelector((state) => state.cart);
   const { user, isAuthenticated } = useSelector((state) => state.login);
   const [message, setMessage] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [isChecked, setIsChecked] = useState(false);

   useEffect(() => {
      if (!stripe) return;

      const clientSecret = new URLSearchParams(window.location.search).get(
         "payment_intent_client_secret"
      );

      if (!clientSecret) return;

      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
         switch (paymentIntent.status) {
            case "succeeded":
               setMessage("Payment succeeded!");
               break;
            case "processing":
               setMessage("Your payment is processing.");
               break;
            case "requires_payment_method":
               setMessage("Your payment was not successful, please try again.");
               break;
            default:
               setMessage("Something went wrong.");
               break;
         }
      });
   }, [stripe, user]);

   const handleSubmit = async (event) => {
      event.preventDefault();

      if (!stripe || !elements) return;

      setIsLoading(true);

      const data = new FormData(event.target);
      cart.receiver_name = data.get("name");
      cart.receiver_email = data.get("email");
      cart.receiver_phone = data.get("phone");

      stripe
         .confirmPayment({
            elements,
            redirect: "if_required",
         })
         .then(async (res) => {
            if (res.error) {
               setMessage(res.error.message);
            } else {
               if (cart.products?.length > 0) {
                  const arrayId = cart.products.map((x) => x.product_id);
                  cart.payment_intent = res.paymentIntent.id;
                  const id = cart._id;
                  delete cart._id;

                  const dataRes = await axios.post(`${API_URL}/payment/stripeokey`, {
                     ids: arrayId,
                     items: cart.products,
                     cart: cart,
                  });

                  cart.products = [];
                  cart.cargoes_id = null;
                  cart.total_price = 0;
                  cart.total_discount = 0;
                  cart.cargo_price = 0;
                  cart.cargo_price_discount = 0;

                  if (isAuthenticated) {
                     await axios.post(`${API_URL}/cart/${id}`, cart).then(async () => {
                        await dispatch(getCart_r(user.id));
                        router.push(
                           `/cart/checkout?payment_intent=${dataRes.data.payment_intent}&ordernumber=${dataRes.data.ordernumber}`
                        );
                     });
                  } else {
                     await dispatch(cartFetch(cart));
                     router.push(
                        `/cart/checkout?payment_intent=${dataRes.data.payment_intent}&ordernumber=${dataRes.data.ordernumber}`
                     );
                  }
               }
            }
         });

      setIsLoading(false);
   };

   return (
      <form onSubmit={handleSubmit} className="grid grid-cols-12 lg:gap-10 lg:m-10 lg:p-0 p-5">
         <div className="lg:col-span-4 col-span-12">
            <h2 className="text-lg font-semibold text-primary mb-5 mt-5">Receiver</h2>
            <Card className="p-4">
               <CardContent className="space-y-4">
                  <div>
                     <Label htmlFor="name">Name</Label>
                     <Input id="name" name="name" defaultValue={user.name} required />
                  </div>
                  <div>
                     <Label htmlFor="email">E-mail</Label>
                     <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        required
                     />
                  </div>
                  <div>
                     <Label htmlFor="phone">Phone</Label>
                     <Input
                        id="phone"
                        name="phone"
                        defaultValue={user.phone ? user.prefix + user.phone : ""}
                        required
                     />
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="lg:col-span-8 col-span-12">
            <h2 className="text-lg font-semibold text-primary mt-5">Stripe Payment</h2>
            <Card className="p-4 mt-5">
               <CardContent>
                  <PaymentElement />
               </CardContent>
            </Card>
         </div>

         <div className="col-span-12">
            <h2 className="text-lg font-semibold text-primary">Contract</h2>
            <div className="overflow-y-scroll h-36 my-2 bg-gray-50 text-gray-500 p-7 rounded-lg">
               {contract}
            </div>

            <div className="flex items-center gap-2 my-4">
               <Checkbox id="contract" checked={isChecked} onCheckedChange={setIsChecked} />
               <Label htmlFor="contract">I accept the contract</Label>
            </div>

            {message && (
               <div className="text-red-600 font-semibold text-center text-xl m-10">{message}</div>
            )}

            <Button
               type="submit"
               disabled={!isChecked || isLoading || !stripe || !elements}
               className={cn(
                  "w-full h-auto mb-5 text-xl text-white p-5 transition-all",
                  isChecked
                     ? "bg-black hover:bg-primary focus:bg-black"
                     : "bg-gray-400 cursor-not-allowed"
               )}
            >
               {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
            </Button>
         </div>
      </form>
   );
}