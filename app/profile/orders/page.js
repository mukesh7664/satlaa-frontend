"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/util/axios";
import { API_URL } from "@/config";
import { cartFetch } from "@/redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";
import ProfileLeftMenu from "@/myapp/components/Profile/LeftMenu";
import Orders from "@/myapp/components/Profile/Orders";
import Breadcrumbs from "@/myapp/components/Utils/BreadCrumbs";

const OrdersPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.login);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = document.cookie.includes("token");
        if (!token) {
          router.push("/");
          return;
        }

        const axios = axiosInstance();
        const res = await axios.get(`${API_URL}/orders`);
        if (res.data.length > 0) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [router]);

  return (
    <div className="container-custom">
      <Breadcrumbs
        items={[
          { path: "/", title: "Home" },
          { path: "/profile", title: "Profile" },
          { title: "Orders" },
        ]}
      />
      <div className="grid p-4 grid-cols-12 my-8 sm:gap-9 bg-white">
        {orders.length > 0 ? (
          <div className="col-span-12 order-1 lg:order-2 lg:col-span-9">
            <div className="text-2xl font-semibold text-primary mb-5">Orders</div>
            <Orders ordersData={orders} />
          </div>
        ) : (
          <div className="col-span-12 order-1 lg:order-2 lg:col-span-9">
            <div className="flex flex-wrap items-center space-x-4 bg-white p-4 rounded shadow md:space-x-0 md:flex-col md:items-start">
              <p className="text-gray-800 text-lg mb-2 md:mb-4">No Orders</p>
              <Link
                href="/"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition duration-200 ease-in-out w-full md:w-auto"
              >
                Let&apos;s Buy Some
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;