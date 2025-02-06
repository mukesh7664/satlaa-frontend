import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();

import { Input, Modal, Form, message, Badge, Layout } from "antd";
import {
  setLogin,
  setIsAuthenticated,
  setLogout,
} from "../../../redux/reducers/Login";
import router, { useRouter } from "next/router";
import Link from "next/link";
import LoginForm from "./LoginForm";
import AuthService from "../../../util/services/authservice";

import { FiSearch, FiShoppingBag } from "react-icons/fi";
import { AiOutlineUser, AiOutlineClose } from "react-icons/ai";
import { cartFetch, getCart } from "../../../redux/reducers/Cart";
import { API_URL } from "../../../config";

const RightMenu = ({ mode }) => {
  const [form] = Form.useForm();
  const cart = useSelector((state) => state.cart);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const [openModalLogin, seTopenModalLogin] = useState(false);
  const [openModalSearch, seTopenModalSearch] = useState(false);
  const [confirmLoadingLogin, seTconfirmLoadingLogin] = useState(false);

  const dispatch = useDispatch();

  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(null);
  // useEffect(() => {
  //   // Log or perform actions on authentication change
  //   console.log("Authentication state changed:", isAuthenticated);
  // }, [isAuthenticated]);

  // const onSubmitPhone = (Data) => {
  //   AuthService.sendOTP(Data).then((data) => {
  //     if (data) {
  //       setPhoneNumber(Data.phone);
  //       setStep(1);
  //     } else {
  //       message.error("Failed to send OTP");
  //     }
  //   });
  // };
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
    <div className="flex flex-row w-full">
      <div className="text-base text-right px-0 flex flex-row w-full">
        {/* <Menu
          mode={mode}
          className="border-b-0 flex flex-row justify-around items-center w-full md:gap-x-2"
        >
          <Menu.Item
            key="search"
            className="w-auto h-auto inline-flex items-center text-xl"
          >
            <button
              onClick={() => seTopenModalSearch(true)}
              className="py-2 relative  w-full"
            >
              <FaMagnifyingGlass />
            </button>
          </Menu.Item>
          {stateisAuthenticated ? (
            <Menu.SubMenu
              key="user-menu"
              title={<FaUser />}
              className="hover:border-b-0 py-2 relative text-xl"
            >
              <Menu.Item key="about-us">
                <Link href="/profile">
                  <UserOutlined />

                  <span className="">Profile</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="orders">
                <Link href="/profile/orders">
                  <PieChartOutlined />
                  <span className="">Orders</span>
                </Link>
              </Menu.Item>

              <Menu.Item
                key="log-out"
                onClick={async () => {
                  await AuthService.logout();
                  await dispatch(setLogout());
                  seTstateisAuthenticated(false);
                  removeCookies("isuser");
                  router.push("/");
                }}
              >
                <LogoutOutlined /> <span className=" "> Logout</span>
              </Menu.Item>
            </Menu.SubMenu>
          ) : (
            <Menu.Item key="login" className="border-b-0  text-xl">
              <span
                className="p-2 cursor-pointer hover:text-primary text-2xl"
                onClick={() => seTopenModalLogin(true)}
              >
                <FaUser/>
                <span className="hidden ">Login</span>
              </span>
            </Menu.Item>
          )}

          <Menu.Item key="cart" className="">
            <Link
              href="/cart"
              className="py-2 relative text-lg flex justify-center"
            >
              <ShoppingCartOutlined
                className="text-xl"
                style={{ fontSize: "24px" }}
              />

              {cart &&
                cart.products?.length > 0 &&
                cart.products &&
                cart.products?.length > 0 && (
                  <div className="absolute top-0 right-0  -mr-2 bg-gray-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    <span className="text-xs">{cart.products?.length}</span>
                  </div>
                )}
            </Link>
          </Menu.Item>
        </Menu> */}
        <div className="flex flex-row w-full justify-evenly items-center border-b-0 md:gap-x-4 md:mr-4">
          <button
            onClick={() => seTopenModalSearch(true)}
            className="py-2 w-auto h-auto inline-flex items-center text-xl "
            aria-label="Search"
          >
            <FiSearch className="text-2xl" />
          </button>
          <Link
            href="/cart"
            className="py-2 relative text-lg flex justify-center"
          >
            <FiShoppingBag className="text-2xl" />
            {/* <ShoppingCartOutlined
              className="text-2xl"
              style={{ fontSize: "24px" }}
            /> */}
            {cart && cart.products && cart.products?.length > 0 && (
              <div className="absolute top-0 right-0 -mr-2 bg-secondary text-white rounded-full w-4 h-4 flex items-center justify-center">
                <span className="text-xs text-">{cart.products?.length}</span>
              </div>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/profile">
                <AiOutlineUser className="text-2xl" />
              </Link>
              {/* <div className="hidden">
                <Link href="/profile">
                  <UserOutlined />
                  <span className="">Profile</span>
                </Link>
                <Link href="/profile/orders">
                  <PieChartOutlined />
                  <span className="">Orders</span>
                </Link>
                <button
                  onClick={async () => {
                    await AuthService.logout();
                    await dispatch(setLogout());
                    seTstateisAuthenticated(false);
                    removeCookies("isuser");
                    router.push("/");
                  }}
                >
                  <LogoutOutlined />
                  <span className="">Logout</span>
                </button>
              </div> */}
            </>
          ) : (
            <span
              className="cursor-pointer hover:text-primary text-xl"
              onClick={() => seTopenModalLogin(true)}
            >
              <AiOutlineUser className="text-2xl" />
              <span className="hidden">Login</span>
            </span>
          )}
        </div>
      </div>

      <Modal
        title={
          <Image
            src="/images/logo.png"
            alt="loader"
            height={70}
            width={140}
            className="mx-auto"
          />
        }
        open={openModalLogin}
        onOk={() => seTconfirmLoadingLogin(true)}
        confirmLoading={confirmLoadingLogin}
        onCancel={() => seTopenModalLogin(false)}
        footer={null}
      >
        <LoginForm
          handleCancelLogin={() => seTopenModalLogin(false)}
          onSuccessfulLogin={handleSuccessfulLogin}
        />
      </Modal>
      <CustomModal
        isOpen={openModalSearch}
        onClose={() => seTopenModalSearch(false)}
        router={router}
      />
      {/* <Modal
        title="Search"
        className=""
        width="800"
        open={openModalSearch}
        onCancel={() => seTopenModalSearch(false)}
        footer={null}
      >
        <Input.Search
          className=""
          size="large"
          placeholder="Search..."
          enterButton
          onSearch={(val) => {
            router.push("/search?&text=" + val);
            document.activeElement.blur();
            seTopenModalSearch(false);
          }}
        />
      </Modal> */}
    </div>
  );
};

export default RightMenu;

const CustomModal = ({ isOpen, onClose, router }) => {
  const searchInputRef = useRef(null);

  // Function to handle the search action
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);
  const handleSearch = () => {
    const searchValue = searchInputRef.current.value;
    if (searchValue.trim()) {
      router.push(`/search?&text=${searchValue}`);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md m-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg">Search Your Favorite Jewellery</h4>
            <button onClick={onClose} className="text-black">
              <AiOutlineClose className="text-2xl" />
            </button>
          </div>
          <div className="flex mt-4">
            <input
              ref={searchInputRef}
              className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:border-blue-500"
              type="search"
              placeholder="Search "
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              className="bg-primary text-lg text-white font-bold py-2 px-4 rounded"
              onClick={handleSearch}
            >
              <FiSearch className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
