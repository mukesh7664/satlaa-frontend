"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import LoginForm from "@/myapp/components/Header/LoginForm";
import { fetchData } from "@/util/fetchData";
import axiosInstance from "@/util/axios";
import { getCart } from "@/redux/reducers/Cart";
import { API_URL } from "@/config";
import { toast } from "@/components/ui/use-toast";

const axios = axiosInstance();

const SignInPage = () => {
  const { isAuthenticated } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    fetchData(dispatch);
  }, [dispatch]);

  const handleCancelLogin = () => {};

  const handleSuccessfulLogin = async (user, userCart) => {
    try {
      await axios.post(`${API_URL}/cart/${userCart._id}`, cart);
      dispatch(getCart(user.id));
      toast({ title: "Success", description: "User Logged In", duration: 3000 });
    } catch (err) {
      toast({ title: "Error", description: "Some Error, Please Try Again", duration: 3000, variant: "destructive" });
    }
  };

  return (
    <div className="grid container-custom gap-10 p-20 grid-cols-12">
      <div className="col-span-6">
        <h2 className="text-lg font-semibold text-primary mb-5">Login</h2>
        <LoginForm
          handleCancelLogin={handleCancelLogin}
          onSuccessfulLogin={handleSuccessfulLogin}
        />
      </div>
    </div>
  );
};

export default SignInPage;