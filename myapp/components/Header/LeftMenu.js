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
    <div className="w-full h-96 p-6 gap-x-6 hidden md:flex">
      <div>
        <p className="mb-4 font-bold">Category</p>
        <div className="flex flex-col pt-4">
          {categories?.map((category) => (
            <Link
              key={category.seo}
              href={`/${category.seo}`}
              className="md:hover:underline pb-1"
            >
              {category.title}
            </Link>
          ))}
          <Link href="/search" className="md:hover:underline pb-1">
            All Products
          </Link>
        </div>
      </div>

      <div>
        <p className="mb-4 font-bold">Styles</p>
        <div className="flex flex-col pt-4">
          {styles?.map((style) => (
            <Link
              key={style._id}
              href={`/search?styles=${style.seo}`}
              className="md:hover:underline pb-1"
            >
              {style.title}
            </Link>
          ))}
        </div>
      </div>
      

      <div>
        <p className="mb-4 font-bold">Sub Category</p>
        <div className="flex flex-col pt-4">
          {subcategory?.map((subCat) => (
            <Link
              key={subCat._id}
              href={`/search?subcategory=${subCat.seo}`}
              className="md:hover:underline pb-1"
            >
              {subCat.title}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-4 font-bold">Colors</p>
        <div className="flex flex-col pt-4">
          {colors?.map((color) => (
            <Link
              key={color._id}
              href={`/search?colors=${color.seo}`}
              className="md:hover:underline pb-1"
            >
              {color.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};