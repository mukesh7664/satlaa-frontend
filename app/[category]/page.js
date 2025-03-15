"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useRouter } from "next/navigation";
import { API_URL, IMG_URL } from "@/config";
import authservice from "@/util/services/authservice";
import { cartFetch } from "@/redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";
import dynamic from "next/dynamic";
import Head from "@/myapp/core/Head";

const FilterSelectedTop = dynamic(
  () => import("@/myapp/components/FilterProducts/FilterSelectedTop"),
  { ssr: false }
);

const FilterBar = dynamic(
  () => import("@/myapp/components/FilterProducts/FilterBar"),
  { ssr: false }
);

const SortProducts = dynamic(
  () => import("@/myapp/components/FilterProducts/SortProducts"),
  { ssr: true }
);

const CategoryDrawer = dynamic(
  () => import("@/myapp/components/Drawer/CategoryDrawer"),
  { ssr: false }
);

const FAQ = dynamic(() => import("@/myapp/components/FAQ"), { ssr: false });

import Image from "next/image";
import { fetchData } from "@/util/fetchData";
import Breadcrumbs from "@/myapp/components/Utils/BreadCrumbs";
import { FaFilter } from "react-icons/fa";
import FilterProductArea from "@/myapp/components/FilterProducts/FilterProductArea";

const HTMLParser = dynamic(() => import("@/myapp/components/Utils/HtmlParser"), {
  ssr: false,
});

const Category = ({ categoryData, productData }) => {
  const router = useRouter();
  const category = router.query?.category || "";
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = await authservice.isAuthenticated();
      await fetchData(dispatch);
      if (auth.isAuthenticated) {
        dispatch(cartFetch(auth.userCart));
        dispatch(setLogin(auth.user));
        dispatch(setIsAuthenticated(true));
      }
    };

    fetchUserData();
  }, [dispatch]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  if (!productData || productData.products.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full">
      {categoryData?.banner_mobile && (
        <Image
          src={`${IMG_URL + categoryData.banner_mobile}`}
          height={500}
          width={1680}
          className="w-full block md:hidden"
          priority
          style={{ width: "100%" }}
          alt={categoryData.seo_title || "Default Title"}
        />
      )}
      {categoryData?.banner_web && (
        <Image
          src={`${IMG_URL + categoryData.banner_web}`}
          height={500}
          width={1680}
          className="w-full md:block hidden"
          priority
          style={{ width: "100%" }}
          alt={categoryData.seo_title || "Default Title"}
        />
      )}

      <div className="flex flex-col h-full my-2 py-2 md:px-16 container">
        <Head
          title={categoryData?.seo_title}
          description={categoryData?.short_description}
          canonical={`https://satlaa.com/${category}`}
          image={categoryData?.image}
        />

        <FilterBar />
        <CategoryDrawer visible={visible} onClose={onClose} />
        
        <div className="ml-2 md:ml-4">
          <Breadcrumbs
            items={[
              { path: "/", title: "Home" },
              { path: `/categories`, title: "Categories" },
              { title: category },
            ]}
          />
        </div>

        <div className="md:col-span-10 col-span-12">
          <div className="fixed bottom-0 left-0 z-10 w-full flex flex-row bg-white">
            <div className="w-full">
              <button
                className="items-center py-2 w-full z-10 bg-white border rounded-sm p-0.3 text-base md:hidden font-bold flex"
                onClick={showDrawer}
              >
                Filter By <FaFilter />
              </button>
            </div>
            <div className="w-full md:w-6/12 z-12 md:hidden">
              <SortProducts />
            </div>
          </div>

          <div className="w-full float-left pb-0">
            <FilterSelectedTop category="true" />
          </div>
          <div className="w-full mt-3 float-left">
            {productData && (
              <FilterProductArea
                initialData={productData}
                category={category}
                categoryData={categoryData}
              />
            )}
          </div>

          <div className="px-4">
            <h1 className="mb-4 text-2xl">{categoryData.h1tag}</h1>
            <HTMLParser html={categoryData.description || ""} />
          </div>
          <FAQ categoryData={categoryData} />
        </div>
      </div>
    </div>
  );
};

export default Category;