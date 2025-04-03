"use client";

import axiosInstance from "@/util/axios";
const axios = axiosInstance();

import { API_URL } from "@/config";
import Breadcrumbs from "@/myapp/components/Utils/BreadCrumbs";
import authservice from "@/util/services/authservice";
import { cartFetch, getCart } from "@/redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";
import LoginForm from "@/myapp/components/Header/LoginForm";
import Head from "@/myapp/core/Head";
import DetailPriceAddress from "@/myapp/components/Cart/DetailPriceAddress";
import AddressList from "@/myapp/components/Cart/AddressList";
import { fetchData } from "@/util/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.login);
  const cart = useSelector((state) => state.cart);

  const [initialAddress, setInitialAddress] = useState([]);

  useEffect(() => {
    // Fetch addresses only if the user is authenticated
    const fetchAddress = async () => {
      if (isAuthenticated) {
        try {
          const res = await axios.get(`${API_URL}/customerspublic/address`);
          if (res.data.length > 0) {
            setInitialAddress(res.data);
          }
        } catch (err) {
          console.error("Error fetching addresses:", err);
        }
      }
    };

    fetchAddress();
    fetchData(dispatch);
  }, [dispatch, isAuthenticated]);

  const handleSuccessfulLogin = async (user, userCart) => {
    try {
      await axios.post(`${API_URL}/cart/${userCart._id}`, cart);
      getCart(user.id);
      setInitialAddress([]); // Clear and re-fetch addresses
      toast.success("User Logged In");
    } catch (err) {
      toast.error("Some Error, Please Try Again");
    }
  };

  return (
    <div className="container-custom">
      <Head title="Address" />
      <div className="flex justify-center">
        <Breadcrumbs
          items={[
            { path: "/", title: "Home" },
            { path: "/cart", title: "Cart" },
            { title: "Address" },
          ]}
        />
      </div>

      {!isAuthenticated ? (
        <div className="w-full px-2 md:w-7/12 md:mx-auto mt-8">
          <p className="text-lg font-semibold font-Montserrat mb-8">
            Please Log in to save your Address and Order Details
          </p>
          <div className="p-4 shadow-md rounded bg-white">
            <LoginForm
              handleCancelLogin={() => {}}
              onSuccessfulLogin={handleSuccessfulLogin}
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col md:flex-row gap-x-6 mt-3">
          <div className="w-full md:w-8/12 bg-white md:py-5">
            <AddressList initialAddress={initialAddress} />
          </div>
          <div className="w-full md:w-4/12 bg-white shadow-lg pb-4">
            <DetailPriceAddress />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;