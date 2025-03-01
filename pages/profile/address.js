import { useEffect } from "react";
import { useSelector } from "react-redux";
import Router from "next/router";

import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../../config";
import authservice from "../../util/services/authservice";
import { cartFetch } from "../../redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "../../redux/reducers/Login";
import { wrapper } from "../../redux/store";

import Head from "../../myapp/core/Head";
import Address from "../../myapp/components/Profile/Address";
import ProfileLeftMenu from "../../myapp/components/Profile/LeftMenu";
import AddressList from "../../myapp/components/Cart/AddressList";
import { fetchData } from "../../util/fetchData";

const Default = ({initialData}) => {
  const { isAuthenticated } = useSelector((state) => state.login);



  return (
    <>
      <Head title="Address" />
      <div className="container-custom ">
        <div className="grid shadow-lg p-4 grid-cols-12 my-8 sm:gap-9 bg-white">
          <div className=" col-span-12 order-2 lg:order-1 lg:col-span-3 ">
            <ProfileLeftMenu />
          </div>
          <div className=" col-span-12 order-1 lg:order-2 lg:col-span-9 ">
            <div className="text-2xl font-semibold col-span-12 text-primary  mb-5">
              Manage Addresses
            </div>
            {/* <Address /> */}
            <AddressList initalAddress={initialData} />
          </div>
        </div>
      </div>
    </>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
  const { req } = context;
  await fetchData(store.dispatch);
  // Add authentication check here
  if (!req.cookies.token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let data = [];
  const axios = axiosInstance(context);
  const auth = await authservice.isAuthenticated(context);

  if (auth.isAuthenticated) {
    await store.dispatch(cartFetch(auth.userCart));
    await store.dispatch(setLogin(auth.user));
    await store.dispatch(setIsAuthenticated(true));
  }
  try {
    const res = await axios.get(API_URL + "/customerspublic/address", {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    if (res.data.length > 0) {
      data = res.data;
    }
  } catch (err) {
    console.log(err);
  }

  return { props: { initialData: data } };
})
export default Default;
