"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axiosInstance from "@/util/axios";
import { API_URL } from "@/config";
import { cartFetch } from "@/redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";
import ProfileLeftMenu from "@/myapp/components/Profile/LeftMenu";
import AddressList from "@/myapp/components/Cart/AddressList";

export const metadata = {
  title: "Manage Addresses - SATLAA",
  description: "Manage your saved addresses for faster checkouts and orders.",
};

const AddressPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.login);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie.includes("token");
        if (!token) {
          router.push("/");
          return;
        }

        const axios = axiosInstance();
        const res = await axios.get(`${API_URL}/customerspublic/address`);
        if (res.data.length > 0) {
          setAddresses(res.data);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="container-custom">
      <div className="grid shadow-lg p-4 grid-cols-12 my-8 sm:gap-9 bg-white">
        <div className="col-span-12 order-2 lg:order-1 lg:col-span-3">
          <ProfileLeftMenu />
        </div>
        <div className="col-span-12 order-1 lg:order-2 lg:col-span-9">
          <div className="text-2xl font-semibold text-primary mb-5">
            Manage Addresses
          </div>
          <AddressList initialAddress={addresses} />
        </div>
      </div>
    </div>
  );
};

export default AddressPage;