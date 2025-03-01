import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { useRouter } from "next/router";
import { API_URL, IMG_URL } from "../config";
import authservice from "../util/services/authservice";
import { cartFetch } from "../redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "../redux/reducers/Login";
import dynamic from "next/dynamic";
import Head from "../myapp/core/Head";

const FilterSelectedTop = dynamic(
  () => import("../myapp/components/FilterProducts/FilterSelectedTop"),
  {
    ssr: false, // If you do not need server-side rendering for this component
  }
);

// Dynamically import the StyleFilter component
const FilterBar = dynamic(
  () => import("../myapp/components/FilterProducts/FilterBar"),
  {
    ssr: false,
  }
);

// Dynamically import the SortProducts component
const SortProducts = dynamic(
  () => import("../myapp/components/FilterProducts/SortProducts"),
  {
    ssr: true,
  }
);
const CategoryDrawer = dynamic(
  () => import("../myapp/components/Drawer/CategoryDrawer"),
  {
    ssr: false,
  }
);
const FAQ = dynamic(() => import("../myapp/components/FAQ"), {
  ssr: false,
});
import Image from "next/image";
import { fetchData } from "../util/fetchData";
import Breadcrumbs from "../myapp/components/Utils/BreadCrumbs";
import { FaFilter } from "react-icons/fa";
import FilterProductArea from "../myapp/components/FilterProducts/FilterProductArea";

// Dynamically import the 'parse' function from 'html-react-parser'
const HTMLParser = dynamic(
  () => import("../myapp/components/Utils/HtmlParser"),
  {
    ssr: false, // Disable server-side rendering if needed
    // Optional loading component
  }
);

const Category = ({ categoryData, productData }) => {
  const router = useRouter();
  const category = router.query.category;
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    // Client-side data fetching for user-specific data
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
  if (productData.products.length === 0) {
    return <p>Loading</p>;
  }
  return (
    <div className="w-full">
      {categoryData?.banner_mobile && (
        <Image
          src={
            categoryData.banner_mobile
              ? `${IMG_URL + categoryData.banner_mobile}`
              : "/images/nofoto.jpg"
          }
          height="500"
          width="1680"
          className="w-full block md:hidden"
          priority="true"
          style={{ width: "100%" }}
          alt={
            categoryData.seo_title ? categoryData.seo_title : "Default Title"
          }
        />
      )}
      {categoryData?.banner_web && (
        <Image
          src={
            categoryData.banner_web
              ? `${IMG_URL + categoryData.banner_web}`
              : "/images/nofoto.jpg"
          }
          height="500"
          width="1680"
          className="w-full md:block hidden"
          priority="true"
          style={{ width: "100%" }}
          alt={
            categoryData.seo_title ? categoryData.seo_title : "Default Title"
          }
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
              {
                path: "/",
                title: "Home",
              },
              {
                path: `/categories`,
                title: "Categories",
              },

              {
                title: category,
              },
            ]}
          />
        </div>

        <div className=" md:col-span-10 col-span-12">
          <div className=" fixed bottom-0 left-0 z-10 w-full flex flex-row bg-white">
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

export async function getStaticPaths() {
  // Fetch the list of categories from your API
  const response = await axios.post(`${API_URL}/categoriespublic/category/all`);
  const categories = response.data;
  const paths = categories.map((category) => ({
    params: { category: category.seo },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  console.log("Fetching data for:", params);
  try {
    const filterProducts = {
      tags: [],
      colors: [],
      subcategory: [],
      styles: [],
      categories: [],
      text: "",
      variants: [],
      minPrice: null,
      maxPrice: null,
      sort: "",
      perPage: 10,
      page: 1,
      category: params.category,
    };

    const productData = await axios.post(
      `${API_URL}/productspublic/${params.category}`,
      filterProducts
    );
    const data = productData.data.category; // Ensure data is not undefined

    return {
      props: {
        categoryData: data ?? {}, // Use nullish coalescing to provide a default object if data is undefined
        productData: {
          products: productData.data.products ?? [],
          pagination: productData.data.pagination ?? {},
        },
      },
      revalidate: 3600,
    };
  } catch (error) {
    // Check if the error is related to no product being found
    if (error.message.includes("Error: No such product")) {
      return {
        notFound: true, // This will trigger the 404 page rendering
      };
    }
    // If there's a different error, handle it appropriately (e.g., return an empty response or a fallback)
    return {
      props: {
        categoryData: {},
        productData: {
          products: [],
          pagination: {},
        },
      },
    };
  }
}

export default Category;
