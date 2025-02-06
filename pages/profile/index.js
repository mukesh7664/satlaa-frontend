import { useEffect } from "react";
import { useSelector } from "react-redux";
import Router from "next/router";

import { wrapper } from "../../redux/store";
import axiosInstance from "../../util/axios";
import authservice from "../../util/services/authservice";
import { cartFetch } from "../../redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "../../redux/reducers/Login";

import Head from "../../myapp/core/Head";
import Profile from "../../myapp/components/Profile";
import ProfileLeftMenu from "../../myapp/components/Profile/LeftMenu";
import { fetchData } from "../../util/fetchData";


const Default = () => {
  const { isAuthenticated } = useSelector((state) => state.login);

  useEffect(() => {
    if (!isAuthenticated) {
      Router.push("/");
    }
  }, []);

  return (
    <>
      <Head title="Profile" />
      <div className="container-custom ">
        <div className="grid shadow-lg p-4 grid-cols-12 my-8 sm:gap-9 bg-white">
          <div className=" col-span-12 order-2 lg:order-1 lg:col-span-3 ">
            <ProfileLeftMenu />
          </div>
          <div className=" col-span-12 order-1 lg:order-2 lg:col-span-9 ">
            <div className="text-2xl font-semibold col-span-12 text-primary  mb-5 ">
              Profile Info
            </div>
            <Profile />
          </div>
        </div>
      </div>
    </>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const axios = axiosInstance(context);
    const auth = await authservice.isAuthenticated(context);
    await fetchData(store.dispatch);
    if (auth.isAuthenticated) {
      await store.dispatch(cartFetch(auth.userCart));
      await store.dispatch(setLogin(auth.user));
      await store.dispatch(setIsAuthenticated(true));
    }
    return {
      props: {},
    };
  }
);
export default Default;
