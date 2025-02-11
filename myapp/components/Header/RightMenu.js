import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();

import { Input, Modal, message, Badge, Layout, Button, TextField } from "@mui/material";
import { setLogin, setIsAuthenticated, setLogout } from "../../../redux/reducers/Login";
import router, { useRouter } from "next/router";
import Link from "next/link";
import LoginForm from "./LoginForm";
import AuthService from "../../../util/services/authservice";

import { FiSearch, FiShoppingBag } from "react-icons/fi";
import { AiOutlineUser, AiOutlineClose } from "react-icons/ai";
import { cartFetch, getCart } from "../../../redux/reducers/Cart";
import { API_URL } from "../../../config";

const RightMenu = ({ mode }) => {
  const cart = useSelector((state) => state.cart);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const [openModalLogin, seTopenModalLogin] = useState(false);
  const [openModalSearch, seTopenModalSearch] = useState(false);
  const [confirmLoadingLogin, seTconfirmLoadingLogin] = useState(false);

  const dispatch = useDispatch();

  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState(null);

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
  };

  return (
    <div className="flex flex-row w-full">
      <div className="text-base text-right px-0 flex flex-row w-full">
        <div className="flex flex-row w-full justify-evenly items-center border-b-0 md:gap-x-4 md:mr-4">
          <button
            onClick={() => seTopenModalSearch(true)}
            className="py-2 w-auto h-auto inline-flex items-center text-xl "
            aria-label="Search"
          >
            <FiSearch className="text-2xl" />
          </button>
          <Link href="/cart" className="py-2 relative text-lg flex justify-center">
            <FiShoppingBag className="text-2xl" />
            {cart && cart.products && cart.products.length > 0 && (
              <div className="absolute top-0 right-0 -mr-2 bg-secondary text-white rounded-full w-4 h-4 flex items-center justify-center">
                <span className="text-xs text-">{cart.products.length}</span>
              </div>
            )}
          </Link>
          {isAuthenticated ? (
            <Link href="/profile">
              <AiOutlineUser className="text-2xl" />
            </Link>
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
        onClick={() => seTopenModalLogin(false)}
      >
        <LoginForm handleCancelLogin={() => seTopenModalLogin(false)} onSuccessfulLogin={handleSuccessfulLogin} />
      </Modal>

      <CustomModal isOpen={openModalSearch} onClose={() => seTopenModalSearch(false)} router={router} />
    </div>
  );
};

export default RightMenu;

const CustomModal = ({ isOpen, onClose, router }) => {
  const searchInputRef = useRef(null);

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
            <TextField
              inputRef={searchInputRef}
              fullWidth
              variant="outlined"
              placeholder="Search"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              style={{ marginLeft: "8px" }}
            >
              <FiSearch className="text-2xl" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};