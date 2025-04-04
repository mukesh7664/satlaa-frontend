'use client'

import { useRouter } from "next/navigation";
import axiosInstance from "@/util/axios";
import { API_URL } from "../../../../config";
import Link from "next/link";
import Loader from "@/components/Utils/Loader";
import { FiShoppingBag } from "react-icons/fi";
import { FaBan } from "react-icons/fa";
import Breadcrumbs from "@/myapp/components/Utils/BreadCrumbs";
import { useState, useEffect } from "react";
import { wrapper } from "@/redux/store";
import authservice from "@/util/services/authservice";
import { cartFetch } from "@/redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";
import { fetchData } from "@/util/fetchData";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Script from "next/script";

/*
page component is expecting to receive an order prop directly, 
but Next.js App Router pages need to receive standardized props like params and then fetch their own data.

The key changes:

Changed the component to receive params instead of order
Added a state variable to store the fetched order data
Added a useEffect to fetch the order data when the component mounts
Added loading and error states to handle the asynchronous data fetching
Made the component export default directly instead of exporting a named function
*/

export default function OrderPage({ params }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.login);
  const { toast } = useToast();

  // Fetch order data on mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const auth = await authservice.isAuthenticated();
        if (auth.isAuthenticated) {
          dispatch(setLogin(auth.user));
          dispatch(setIsAuthenticated(true));
          dispatch(cartFetch(auth.userCart));
          
          const res = await axiosInstance().get(`${API_URL}/orders/${params.order}`);
          setOrder(res.data);
        } else {
          router.push('/signin');
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast({ title: "Failed to load order details", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.order, dispatch, router, toast]);

  const handleDialogConfirm = async () => {
    if (!dialogAction || !order) return;
    
    try {
      const res = await axiosInstance().put(`${API_URL}/orders/${dialogAction}/${order.ordernumber}`);
      if (res.status === 200) {
        router.refresh();
        toast({ title: `Order ${dialogAction} successful` });
      }
    } catch (err) {
      console.error(err);
      toast({ title: `Failed to ${dialogAction} order`, variant: "destructive" });
    }
    
    setOpenDialog(false);
    setDialogAction(null);
  };

  const retryPayment = async () => {
    if (!order) return;
    
    setIsLoading(true);
    try {
      const responseServer = await axiosInstance().post(
        `${API_URL}/payment/razorpay/retry-payment`,
        { orderId: order.ordernumber }
      );
      const paymentDetails = responseServer.data;
      const payload = {};

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentDetails.amount,
        order_id: paymentDetails.id,
        handler: async (responseOrderCreated) => {
          if (!responseOrderCreated.razorpay_payment_id) {
            toast({ title: "Payment cancelled by user", variant: "destructive" });
            return;
          }

          payload.razorpay_order_id = responseOrderCreated.razorpay_order_id;
          payload.razorpay_payment_id = responseOrderCreated.razorpay_payment_id;
          payload.razorpay_signature = responseOrderCreated.razorpay_signature;
          payload.order_id = order.ordernumber;
          payload.user = user;

          await axiosInstance().post(
            `${API_URL}/payment/razorpay/verify-payment`,
            payload
          );
          router.push(`/profile/orders/${order.ordernumber}/order-success`);
        },
        prefill: {
          name: user.name,
          contact: user.phone,
        },
        theme: { color: "#e26f83" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error in retrying payment: ", error);
      toast({ title: "Payment retry failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader loading={true} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-red-500">Order not found</p>
        <Link href="/profile/orders" className="mt-4 inline-block text-blue-500">
          Return to orders
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script 
        id="razorpay-checkout-js" 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="container mx-auto px-4">
        <Loader loading={isLoading} />
        <Breadcrumbs
          items={[
            { path: "/", title: "Home" },
            { path: "/profile", title: "Profile" },
            { path: "/profile/orders", title: "Orders" },
            { title: order.ordernumber },
          ]}
        />

        <div className="mt-8 p-4 bg-white shadow-lg rounded-lg">
          {!order.isPaid && !order.orderEvents.cancelled.status && (
            <div className="p-2">
              <p className="text-bold text-xl">
                Payment is Pending. Please try again, or your order will be
                cancelled. If deducted, it will be refunded.
              </p>
              <Button className="mt-2" onClick={retryPayment}>
                Retry Payment
              </Button>
            </div>
          )}
          <h2 className="text-xl font-bold mb-4">Order Info</h2>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="font-bold">Order Number</dt>
            <dd>{order.ordernumber}</dd>
            <dt className="font-bold">Payment Mode</dt>
            <dd>{order.payment_mode}</dd>
            <dt className="font-bold">Total Price</dt>
            <dd>{order.total_price + order.shipping_price}</dd>
            <dt className="font-bold">Tracking Link</dt>
            <dd>
              {order.tracking_link ? (
                <a href={order.tracking_link} rel="noreferrer" className="text-blue-500 hover:underline" target="_blank">
                  Track
                </a>
              ) : (
                "Not Yet Dispatched"
              )}
            </dd>
          </dl>

          <h2 className="text-xl font-bold mt-6 mb-4">Items</h2>
          {order.products.map((item, index) => (
            <div key={index} className="flex space-x-4 items-center">
              <Link href={`/products/${item.seo}`} className="text-blue-500 hover:underline">
                {item.title}
              </Link>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="font-bold">Price</dt>
                <dd>{item.price}</dd>
                <dt className="font-bold">Quantity</dt>
                <dd>{item.qty}</dd>
              </dl>
            </div>
          ))}

          <div className="flex justify-center space-x-4 mt-8">
            <Link href="/" className="inline-flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded">
              <FiShoppingBag className="mr-2" />
              Shop More
            </Link>

            {!order.orderEvents.shipped.status &&
              !order.orderEvents.delivered.status &&
              !order.orderEvents.cancelled.status && (
                <Button variant="destructive" onClick={() => {
                  setDialogAction("cancel");
                  setOpenDialog(true);
                }}>
                  <FaBan className="mr-2" />
                  Cancel The Order
                </Button>
              )}

            {order.orderEvents.delivered.status &&
              !order.orderEvents.returned.status && (
                <Button variant="secondary" onClick={() => {
                  setDialogAction("return");
                  setOpenDialog(true);
                }}>
                  <FaBan className="mr-2" />
                  Return The Order
                </Button>
              )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "cancel" ? "Cancel Order" : "Return Order"}
            </DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to {dialogAction} this order?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenDialog(false)}>No</Button>
            <Button variant="destructive" onClick={handleDialogConfirm}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}