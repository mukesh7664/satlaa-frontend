"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/util/axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
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
          <Button variant="ghost" onClick={() => setOpenModalSearch(true)} aria-label="Search">
            <FiSearch className="text-2xl" />
          </Button>

          {/* Cart Button */}
          <Link href="/cart" className="relative text-lg flex justify-center">
            <FiShoppingBag className="text-2xl" />
            {cart?.products?.length > 0 && (
              <div className="absolute top-0 right-0 -mr-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
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
            <span className="cursor-pointer hover:text-primary text-xl" onClick={() => setOpenModalLogin(true)}>
              <AiOutlineUser className="text-2xl" />
            </span>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <Dialog open={openModalLogin} onOpenChange={setOpenModalLogin}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <Image src="/images/logo.png" alt="logo" height={70} width={140} />
            </DialogTitle>
          </DialogHeader>
          <LoginForm handleCancelLogin={() => setOpenModalLogin(false)} onSuccessfulLogin={handleSuccessfulLogin} />
        </DialogContent>
      </Dialog>

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Search Your Favorite Jewellery</DialogTitle>
        </DialogHeader>
        <div className="flex mt-4">
          <Input
            ref={searchInputRef}
            placeholder="Search"
            className="w-full mb-2"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="default" onClick={handleSearch} className="ml-2 bg-[#e76e81] text-white">
            <FiSearch className="text-2xl" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SearchModal };