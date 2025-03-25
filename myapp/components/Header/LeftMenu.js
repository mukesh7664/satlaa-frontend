"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const CustomExpandIcon = ({ isActive }) => (isActive ? <FaMinus /> : <FaPlus />);

const LeftMenu = () => {
  const [shopOpen, setShopOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="hover:bg-white md:w-full md:flex md:justify-center border-b-0 text-xl md:text-base md:items-center">
      {/* Shop All Button */}
      <Popover open={shopOpen} onOpenChange={setShopOpen}>
        <PopoverTrigger asChild>
          <button className="md:hover:underline md:flex md:flex-row pl-0 items-center justify-center ml-6 pr-4 pb-1">
            Shop All
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full max-w-screen-lg bg-white shadow-lg rounded-lg">
          <MegaMenu />
        </PopoverContent>
      </Popover>

      {/* Direct Navigation Links */}
      <Link className="md:hover:underline pb-1 md:mr-4" href="/Anklets">
        Anklets
      </Link>
      <Link className="md:hover:underline pb-1 pr-4" href="/rings">
        Rings
      </Link>
      <Link className="md:hover:underline pb-1 mr-4" href="/bracelets">
        Bracelets
      </Link>
      <Link className="md:hover:underline pb-1 mr-4" href="/collections">
        Collections
      </Link>

      {/* More Button */}
      <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
        <DropdownMenuTrigger asChild>
          <button className="md:hover:underline md:flex md:flex-row pl-0 items-center justify-center ml-6">
            More &nbsp;
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href="/about-us">About Us</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="https://satlaa.com/dj">Gold Jewellery</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LeftMenu;

const MegaMenu = () => {
  const { categories } = useSelector((state) => state.categories);
  const { colors } = useSelector((state) => state.colors);
  const { styles } = useSelector((state) => state.styles);
  const { subcategory } = useSelector((state) => state.subcategory);

  return (
    <div className="w-full max-w-screen-lg p-4 bg-white shadow-sm rounded-lg overflow-auto hidden md:flex flex-col">
      <div className="grid grid-cols-4 gap-4 text-sm">
        <div>
          <p className="mb-2 font-semibold text-gray-700">Category</p>
          <div className="flex flex-col space-y-1">
            {categories?.map((category) => (
              <Link
                key={category.seo}
                href={`/${category.seo}`}
                className="hover:underline text-gray-600"
              >
                {category.title}
              </Link>
            ))}
            <Link href="/search" className="hover:underline text-gray-600">
              All Products
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold text-gray-700">Styles</p>
          <div className="flex flex-col space-y-1">
            {styles?.map((style) => (
              <Link
                key={style._id}
                href={`/search?styles=${style.seo}`}
                className="hover:underline text-gray-600"
              >
                {style.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold text-gray-700">Sub Category</p>
          <div className="flex flex-col space-y-1">
            {subcategory?.map((subCat) => (
              <Link
                key={subCat._id}
                href={`/search?subcategory=${subCat.seo}`}
                className="hover:underline text-gray-600"
              >
                {subCat.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold text-gray-700">Colors</p>
          <div className="flex flex-col space-y-1">
            {colors?.map((color) => (
              <Link
                key={color._id}
                href={`/search?colors=${color.seo}`}
                className="hover:underline text-gray-600"
              >
                {color.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};