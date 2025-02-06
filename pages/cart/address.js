import axiosInstance from "@/util/axios";
const axios = axiosInstance();

import { API_URL } from "../../../config";
import Breadcrumbs from "../../myapp/components/Utils/BreadCrumbs";
import authservice from "../../util/services/authservice";
import { cartFetch, getCart } from "../../redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "../../redux/reducers/Login";
import { wrapper } from "../../redux/store";
import LoginForm from "../../myapp/components/Header/LoginForm";
import Head from "../../myapp/core/Head";
import DetailPriceAddress from "../../myapp/components/Cart/DetailPriceAddress";
import AddressList from "../../myapp/components/Cart/AddressList";
import { fetchData } from "../../util/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { message } from "antd";

const Page = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.login);
  const cart = useSelector((state) => state.cart);

  const [initialAddress, setInitialAddress] = useState([]);
  const fetchAddress = async () => {
    if (isAuthenticated) {
      try {
        const res = await axios.get(API_URL + "/customerspublic/address", {});
        if (res.data.length > 0) {
          setInitialAddress(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    // Fetch and store data client-side
    fetchAddress();
    fetchData(dispatch);
  }, [dispatch]);

  const handleSuccessfulLogin = async (user, userCart) => {
    axios
      .post(`${API_URL}/cart/${userCart._id}`, cart)
      .then(() => {
        getCart(user.id);
        fetchAddress();
        message.success({ content: "User Logged In", duration: 3 });
      })
      .catch((err) => {
        message.error({
          content: "Some Error, Please Try Again",
          duration: 3,
        });
      });
  };
  return (
    <div className="container-custom">
      <Head title="Address" />
      <div className="flex justify-center">
        <Breadcrumbs
          items={[
            {
              path: "/",

              title: "Home",
            },
            {
              path: "/cart",

              title: "Cart",
            },
            {
              title: "Address",
            },
          ]}
        />
      </div>
      {!isAuthenticated ? (
        <div className="w-full px-2 md:w-7/12 md:mx-auto mt-8">
          <p className="text-lg font-semibold font-Montserrat mb-8">
            Please Log in to save your Address and Order Details
          </p>
          <div className="p-4 shadow-square md:shadow-md rounded">
            <LoginForm
              handleCancelLogin={() => {}}
              onSuccessfulLogin={handleSuccessfulLogin}
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col md:flex-row gap-x-6 mt-3">
          <div className="w-full md:w-8/12 m-0  md:py-5 bg-white">
            <AddressList initalAddress={initialAddress} />
          </div>
          <div className="w-full md:w-4/12  shadow-lg m-0 bg-white pb-4">
            <DetailPriceAddress />
          </div>
        </div>
      )}
    </div>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (context) => {
//     await fetchData(store.dispatch);

//     const { req } = context;

//     let data = [];
//     const auth = await authservice.isAuthenticated(context);
//     if (auth.isAuthenticated) {
//       await store.dispatch(cartFetch(auth.userCart));
//       await store.dispatch(setLogin(auth.user));
//       await store.dispatch(setIsAuthenticated(true));
//     }
//     try {
//       const res = await axios.get(API_URL + "/customerspublic/address", {
//         headers: {
//           Cookie: req.headers.cookie,
//         },
//       });
//       if (res.data.length > 0) {
//         data = res.data;
//       }
//     } catch (err) {
//       console.log(err);
//     }

//     return { props: { initialData: data } };
//   }
// );
export default Page;
