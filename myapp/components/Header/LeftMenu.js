import React from "react";
import { Collapse, Menu } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";

import { useRouter } from "next/router";
import { FaMinus, FaPlus } from "react-icons/fa";
const { Panel } = Collapse;
const CustomExpandIcon = ({ isActive }) =>
  isActive ? <FaMinus /> : <FaPlus />;
const LeftMenu = ({ mode }) => {
  const router = useRouter();
  return (
    <Menu
      mode={mode}
      className="hover:bg-white active:bg-white md:w-full md:flex md:justify-center border-b-0 text-xl md:text-base md:items-center"
    >
      <Menu.SubMenu
        key="shopAll"
        className="md:hover:underline md:hover:underline-offset-8 md:flex md:flex-row pl-0 items-center justify-center content-center ml-6"

        title={
          <>
            Shop All &nbsp;
          
          </>
        }
      >
        <MegaMenu mode={mode} />
      </Menu.SubMenu>
      {/* <Menu.Item key="best" className="mr-4">
        <Link
          className="md:hover:underline md:hover:underline-offset-8 pb-1"
          href="/rings"
        >
          <span className="">Bestsellers</span>
        </Link>
      </Menu.Item> */}
          <Menu.Item key="Anklets" className="md:mr-4">
        <Link
          className="md:hover:underline md:hover:underline-offset-8 pb-1"
          href="/Anklets"
        >
          <span className="">Anklets</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="features" className="p-0">
        <Link
          className="md:hover:underline md:hover:underline-offset-8 pb-1 "
          href="/rings"
        >
          <span className="">Rings</span>
        </Link>
      </Menu.Item>
  
      <Menu.Item key="rings" className="mr-4">
        <Link
          className="md:hover:underline md:hover:underline-offset-8 pb-1"
          href="/bracelets"
        >
          <span className="">Bracelets</span>
        </Link>
      </Menu.Item>
      <Menu.Item key="collection" className="mr-4">
        <Link
          className="md:hover:underline md:hover:underline-offset-8 pb-1"
          href="/collections"
        >
          <span className="">Collections</span>
        </Link>
      </Menu.Item>
   

      <Menu.SubMenu
        key="more"
        title={
          <>
            More &nbsp;{" "}
            <svg
              className="text-xs hidden md:inline-block"
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </svg>
          </>
        }
        className="md:hover:underline md:hover:underline-offset-8 md:flex md:flex-row pl-0 items-center justify-center content-center ml-6"
      >
        <Menu.Item key="about-us">
          <Link href="/about-us">
            <span className="">About Us</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="gold" className="mr-4">
        <a
          className="md:hover:underline md:hover:underline-offset-8 pb-1"
          href="https://satlaa.com/dj"
        >
          <span className="">Gold Jewellery</span>
        </a>
      </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default LeftMenu;

const MegaMenu = () => {
  const { categories } = useSelector(({ categories }) => categories);
  const { colors } = useSelector(({ colors }) => colors);
  const { styles } = useSelector(({ styles }) => styles);
  const { subcategory } = useSelector(({ subcategory }) => subcategory);

  return (
    <>
      <div className="w-full h-96 p-6 gap-x-6 hidden md:flex">
        <div className="">
          <p className="mb-4 font-bold">Category</p>
          <div className="flex flex-col h-full w-full pt-4">
            {categories &&
              categories.map((category) => {
                return (
                  <Link
                    key={category.seo}
                    href={`/${category.seo}`}
                    className="md:hover:underline md:hover:underline-offset-4 pb-1 h-full hover:text-red"
                  >
                    <span className=""> {category.title}</span>
                  </Link>
                );
              })}
                    <Link
                     
                     href={`/search`}
                     className="md:hover:underline md:hover:underline-offset-4 pb-1 h-full hover:text-red"

                   >
                     <span className="">All Products</span>
                   </Link>
          </div>
        </div>

        <div className="">
          <p className="w-full mb-4 font-bold">Styles</p>
          <div className="flex flex-col h-full w-full pt-4">
            {styles &&
              styles.map((style) => {
                return (
                  <Link
                    key={style._id}
                    href={`/search?styles=${style.seo}`}
                    className="md:hover:underline md:hover:underline-offset-4 pb-1 h-full"
                  >
                    <span className=""> {style.title}</span>
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="">
          <p className="w-full mb-4 font-bold">Sub Category</p>
          <div className="flex flex-col h-full w-full pt-4">
            {subcategory &&
              subcategory.map((subCat) => {
                return (
                  <Link
                    key={subCat._id}
                    href={`search?&subcategory=${subCat.seo}`}
                    className="md:hover:underline md:hover:underline-offset-4 pb-1 h-full"
                  >
                    <span className=""> {subCat.title}</span>
                  </Link>
                );
              })}
          </div>
        </div>
        <div className="">
          <p className="w-full mb-4 font-bold">Colors</p>
          <div className="flex flex-col h-full w-full pt-4">
            {colors &&
              colors.map((color) => {
                return (
                  <Link
                    key={color._id}
                    href={{
                      pathname: '/search',
                      query: { colors: color.seo },
                    }}
                    className="md:hover:underline md:hover:underline-offset-4 pb-1 h-full"
                  >
                    <span className=""> {color.title}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
      <div className="block md:hidden">
        <Collapse
          collapsible="header"
          accordion="true"
          bordered={false}
          expandIcon={({ isActive }) => <CustomExpandIcon isActive={isActive} />}
          className="bg-white border-b-2 ml-4 text-lg"
          ghost
          expandIconPosition="end"
        >
          <Panel className="font-semibold" header="Shop By Category" key="1">
            <div className="text-base font-normal  flex flex-col">
              {categories &&
                categories.map((category, index) => {
                  return (
                    <Link
                      key={category.title}
                      href={`/${category.seo}`}
                      className="md:hover:underline md:hover:underline-offset-8 pb-1 text-lg"
                    >
                      <span className=""> {category.title}</span>
                    </Link>
                  );
                })}
                  <Link
                     
                      href={`/search`}
                      className="md:hover:underline md:hover:underline-offset-8 pb-1 text-lg"
                    >
                      <span className="">All</span>
                    </Link>
            </div>
          </Panel>

          <Panel className="font-semibold" header="Shop By Style" key="2">
            <div className="text-base font-normal flex flex-col">
              {styles &&
                styles.map((style, index) => {
                  return (
                    <Link
                      key={style.title}
                      href={`/search?style=${style.seo}`}
                      className="md:hover:underline md:hover:underline-offset-8 pb-1 text-base"
                    >
                      <span className=""> {style.title}</span>
                    </Link>
                  );
                })}
            </div>
          </Panel>
          <Panel
            className="font-semibold text-lg"
            header="Shop By Colors"
            key="3"
          >
            <div className="font-normal flex flex-col">
              {colors &&
                colors.map((color, index) => {
                  return (
                    <Link
                      key={color.title}
                      href={{
                        pathname: '/search',
                        query: { colors: color.seo },
                      }}
                      
                      className="md:hover:underline md:hover:underline-offset-8 pb-1 text-base"
                    >
                      <span className=""> {color.title}</span>
                    </Link>
                  );
                })}
            </div>
          </Panel>
        </Collapse>
      </div>
    </>
  );
};
