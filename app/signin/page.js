import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import LoginForm from "../../myapp/components/Header/LoginForm";
import { wrapper } from "@/redux/store";
import { fetchData } from "@/util/fetchData";
import { message } from "@mui/material";
import axiosInstance from "@/util/axios";
import { getCart } from "../../redux/reducers/Cart";
import { API_URL } from "../../config";
const axios = axiosInstance();

const SignInPage = () => {
  const { isAuthenticated } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    if (isAuthenticated) {
      return Router.push("/");
    }
  }, [isAuthenticated]);

  const handleCancelLogin = () => {};
  const handleSuccessfulLogin = async (user, userCart) => {
    axios
      .post(`${API_URL}/cart/${userCart._id}`, cart)
      .then(() => {
        getCart(user.id);
        message.success({ content: "User Logged In", duration: 3 });
      })
      .catch((err) => {
        message.error({
          content: "Some Error, Please Try Again",
          duration: 3,
        });
      });
    // addCart(formResult)
    // router.push("/cart");
  };
  return (
    <>
      <div className="grid container-custom gap-10 p-20 grid-cols-12">
        <div className="col-span-6">
          <div className="text-lg font-semibold col-span-12 text-primary  mb-5 ">
            Login{" "}
          </div>
          <LoginForm
            handleCancelLogin={handleCancelLogin}
            onSuccessfulLogin={handleSuccessfulLogin}
          />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await fetchData(store.dispatch);

    return {
      props: {},
    };
  }
);

export default SignInPage;
