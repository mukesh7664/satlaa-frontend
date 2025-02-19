import React, { useState } from "react";
import {
  MenuList,
  Popper,
  ClickAwayListener,
  Paper,
  Grow,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa";

const CustomExpandIcon = ({ isActive }) => (isActive ? <FaMinus /> : <FaPlus />);

const LeftMenu = () => {
  const [anchorElShop, setAnchorElShop] = useState(null);
  const [anchorElMore, setAnchorElMore] = useState(null);

  const openShop = Boolean(anchorElShop);
  const openMore = Boolean(anchorElMore);

  const handleShopClick = (event) => {
    setAnchorElShop(event.currentTarget);
  };

  const handleMoreClick = (event) => {
    setAnchorElMore(event.currentTarget);
  };

  const handleCloseShop = () => {
    setAnchorElShop(null);
  };

  const handleCloseMore = () => {
    setAnchorElMore(null);
  };

  return (
    <div className="hover:bg-white md:w-full md:flex md:justify-center border-b-0 text-xl md:text-base md:items-center">
      {/* Shop All Button */}
      <button
        onClick={handleShopClick}
        className="md:hover:underline md:hover:underline-offset-8 md:flex md:flex-row pl-0 items-center justify-center ml-6 pr-4 pb-1"
      >
        Shop All
      </button>
      <Popper open={openShop} anchorEl={anchorElShop} transition disablePortal>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleCloseShop}>
                <MenuList>
                  <MegaMenu />
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

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
      <button
        onClick={handleMoreClick}
        className="md:hover:underline md:flex md:flex-row pl-0 items-center justify-center ml-6"
      >
        More &nbsp;
      </button>
      <Popper open={openMore} anchorEl={anchorElMore} transition disablePortal>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleCloseMore}>
                <MenuList>
                  <MenuItem>
                    <Link href="/about-us">About Us</Link>
                  </MenuItem>
                  <MenuItem>
                    <a href="https://satlaa.com/dj">Gold Jewellery</a>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
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