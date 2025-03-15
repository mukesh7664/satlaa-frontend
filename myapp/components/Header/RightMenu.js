"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/util/axios";

import {
  Modal,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";

import { FiSearch, FiShoppingBag } from "react-icons/fi";
import { AiOutlineUser, AiOutlineClose } from "react-icons/ai";

import { setLogin, setIsAuthenticated } from "../../../redux/reducers/Login";
import { cartFetch, getCart } from "../../../redux/reducers/Cart";
import { API_URL } from "../../../config";

import LoginForm from "./LoginForm";

const RightMenu = ({ mode }) => {
  const cart = useSelector((state) => state.cart);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const [openModalLogin, setOpenModalLogin] = useState(false);
  const [openModalSearch, setOpenModalSearch] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSuccessfulLogin = async (user, userCart) => {
    axios
      .post(`${API_URL}/cart/${userCart._id}`, cart)
      .then(() => {
        getCart(user.id);
      })
      .catch(() => {});
  };

  return (
    <div className="flex flex-row w-full">
      <div className="text-base text-right px-0 flex flex-row w-full">
        <div className="flex flex-row w-full justify-evenly items-center border-b-0 md:gap-x-4 md:mr-4">
          {/* Search Button */}
          <button
            onClick={() => setOpenModalSearch(true)}
            className="py-2 w-auto h-auto inline-flex items-center text-xl"
            aria-label="Search"
          >
            <FiSearch className="text-2xl" />
          </button>

          {/* Cart Button */}
          <Link href="/cart" className="py-2 relative text-lg flex justify-center">
            <FiShoppingBag className="text-2xl" />
            {cart?.products?.length > 0 && (
              <div className="absolute top-0 right-0 -mr-2 bg-secondary text-white rounded-full w-4 h-4 flex items-center justify-center">
                <span className="text-xs">{cart.products.length}</span>
              </div>
            )}
          </Link>

          {/* User Profile / Login */}
          {isAuthenticated ? (
            <Link href="/profile">
              <AiOutlineUser className="text-2xl" />
            </Link>
          ) : (
            <span
              className="cursor-pointer hover:text-primary text-xl"
              onClick={() => setOpenModalLogin(true)}
            >
              <AiOutlineUser className="text-2xl" />
              <span className="hidden">Login</span>
            </span>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <Modal open={openModalLogin} onClose={() => setOpenModalLogin(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Image src="/images/logo.png" alt="logo" height={70} width={140} />
          </Box>
          <LoginForm 
            handleCancelLogin={() => setOpenModalLogin(false)} 
            onSuccessfulLogin={handleSuccessfulLogin} 
          />
        </Box>
      </Modal>

      {/* Search Modal */}
      <SearchModal isOpen={openModalSearch} onClose={() => setOpenModalSearch(false)} router={router} />
    </div>
  );
};

export default RightMenu;

const SearchModal = ({ isOpen, onClose, router }) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = () => {
    const searchValue = searchInputRef.current?.value.trim();
    if (searchValue) {
      router.push(`/search?text=${encodeURIComponent(searchValue)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md m-4">
        <div className="flex justify-between items-center">
          <Typography variant="h6">Search Your Favorite Jewellery</Typography>
          <Button onClick={onClose}>
            <AiOutlineClose className="text-2xl" />
          </Button>
        </div>
        <div className="flex mt-4">
          <TextField
            inputRef={searchInputRef}
            fullWidth
            variant="outlined"
            placeholder="Search"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ backgroundColor: "#e76e81", color: "white" }}
          >
            <FiSearch className="text-2xl" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { SearchModal };