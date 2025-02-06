import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/util/axios";
import TagManager from "react-gtm-module";
import { cartFetch } from "../../redux/reducers/Cart";
import { API_URL, IMG_URL } from "../../../config";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import SimilarProducts from "../../myapp/components/ProductDetail/SimilarProducts";
import Breadcrumbs from "../../myapp/components/Utils/BreadCrumbs";
import authservice from "../../util/services/authservice";
import { setIsAuthenticated, setLogin } from "../../redux/reducers/Login";

import Head from "../../myapp/core/Head";

import PoductVariants from "../../myapp/components/ProductDetail/PoductVariants";
import { fetchData } from "../../util/fetchData";
import Image from "next/image";
import Categories from "../../myapp/components/Tags";
import Link from "next/link";
import SkeletonProductCard from "../../myapp/components/ProductCard/skeleton";
// const ProductGallerry = dynamic(
//   () => import("../../myapp/components/ProductDetail/Gallerry"),
//   { ssr: true }
// );
import ProductGallerry from "../../myapp/components/ProductDetail/Gallerry";
import NotFound from "../404";
import Reviews from "../../myapp/components/Reviews";
const Product = ({
  productData,
  seo,
  parentCategory,
  similarProducts,
  reviews,
}) => {
  if (!productData || !productData.title) {
    // Trigger a 404 response
    return <NotFound />;
  }
  const { user } = useSelector(({ login }) => login);
  const state = productData;
  const sortedImages = [...state.allImages].sort((a, b) => a.order - b.order);
  const dispatch = useDispatch();
  let banners = {
    top: null,
    middle: null,
    bottom: null,
  };

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
    setBanners();
  }, [dispatch]);
  const baseUrl = "https://api.satlaa.com";
  const imagesWithBaseURL = sortedImages.map(
    (imgObj) => baseUrl + imgObj.image
  );
  let userInfo;
  if (user) {
    userInfo = {
      user_name: user.name,
      user_phone: user.prefix + user.phone,
    };

    if (user.last_name) {
      userInfo.user_last_name = user.last_name;
    }
    if (user.email) {
      userInfo.user_email = user.email;
    }
  }
  const structuredData = getStructureData(state, imagesWithBaseURL);

  useEffect(() => {
    const dataLayerContent = {
      event: "view_item",
      user_info: userInfo,
      ecommerce: {
        currency: "INR",
        items: [
          {
            item_name: state.title, // Name or ID is required.
            item_id: state.sku, // Name or ID is required.
            price: state.price,
            brand: "SATLAA Jewellery",
            category: state.categories[0],
            quantity: 1, // Optional fields may be omitted or set to null.
          },
        ],
      },
    };
    TagManager.dataLayer({ dataLayer: null });
    TagManager.dataLayer({ dataLayer: dataLayerContent });
  }, [state]);

  const setBanners = () => {
    if (!parentCategory.bottom_banners && !productData.bottom_banners) {
      return;
    }
    // Helper function to find a landscape banner
    const findLandscapeBanner = (bannersArray) => {
      if (!bannersArray) {
        return;
      }
      return bannersArray.find((banner) => banner.landscape);
    };

    // Helper function to sort banners by order and filter non-landscape
    const sortAndFilterBanners = (bannersArray) => {
      if (!bannersArray) {
        return;
      }
      return bannersArray
        .filter((banner) => !banner.landscape)
        .sort((a, b) => a.order - b.order);
    };

    // Try to get a landscape banner from product data
    let landscapeBanner = findLandscapeBanner(productData.bottom_banners);

    // If no landscape banner in product data, get from parent category
    if (!landscapeBanner) {
      landscapeBanner = findLandscapeBanner(parentCategory.bottom_banners);
    }

    // Assign landscape banner to bottom
    if (landscapeBanner) {
      banners.bottom = landscapeBanner;
    }
    // Sort and filter product banners
    let sortedProductBanners = sortAndFilterBanners(productData.bottom_banners);
    if (!sortedProductBanners || !sortedProductBanners.length) {
      return;
    }
    // Assign top and middle banners from sorted product banners
    if (sortedProductBanners.length > 0) {
      banners.top = sortedProductBanners[0];
      if (sortedProductBanners.length > 1) {
        banners.middle = sortedProductBanners[1];
      }
    }

    // If no middle banner, use parent category banners
    if (!banners.middle) {
      let sortedParentBanners = sortAndFilterBanners(
        parentCategory.bottom_banners
      );
      if (sortedParentBanners.length > 0) {
        banners.middle = sortedParentBanners[0];
      }
    }

    // If still no middle banner, use the first parent banner
    if (!banners.middle) {
      banners.middle = parentCategory.bottom_banners[0];
    }

    // If no top banner, use the second parent banner
    if (!banners.top) {
      banners.top = parentCategory.bottom_banners[1];
    }

    // Ensure middle and bottom banners are set if productData has only one banner
    if (sortedProductBanners.length === 1) {
      banners.middle = sortedProductBanners[0];
      banners.bottom = parentCategory.bottom_banners[0] || banners.bottom;
    }

  };
  setBanners();
 console.log('cat',state)
  return (
    <div className="xl:mx-36 h-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Head
        title={`SATLAA ${state.brand === 'satlaa' ? '925 Silver' : 'Silver'} ${state.title}`}
        description={state.description_short}
        canonical={`https://satlaa.com/products/${seo}`}
        image={state.allImages.length > 0 ? state.allImages[0].image : ""}
      />

      <Breadcrumbs
        items={[
          {
            path: "/",
            title: "Home",
          },
          {
            path: `/${state.categoriesSeo[0]}`,
            title: state.categories[0],
          },

          {
            title: state.title,
          },
        ]}
      />

      <div className="bg-white  p-0  grid grid-cols-12 my-0 pt-4  relative">
        <div className=" col-span-12 lg:col-span-6  rounded-lg sticky top-4 h-max ">
          <Suspense fallback={<SkeletonProductCard />}>
            <ProductGallerry
              images={state.allImages}
              productData={state}
              banners={banners}
            />
          </Suspense>
        </div>
        <div className=" col-span-12 lg:col-span-5">
          <PoductVariants
            data={state}
            seo={seo}
            reviews={reviews}
            parentCategory={parentCategory}
            banners={banners}
          />
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="flex content-center flex-col mt-2">
          <p className="text-xl md:text-3xl text-center font-bold">
            Similar Products
          </p>
          <SimilarProducts similarProducts={similarProducts} />
        </div>
      )}
      {banners.bottom && (
        <div className=" col-span-12 lg:col-span-12  rounded-lg sticky top-4 h-max ">
          <Image
            src={
              banners.bottom.banner_mobile
                ? `${IMG_URL}${banners.bottom.banner_mobile}`
                : "/images/bb.jpg"
            }
            height="100"
            width="1680"
            className="w-full border m-2 md:m-3 bg-gray-100 group overflow-hidden pb-0"
            priority="true"
            style={{ width: "100%" }}
            alt={
              banners.bottom.seo_title
                ? banners.bottom.seo_title
                : "Default Title"
            }
          />{" "}
        </div>
      )}
      <div className="flex content-center flex-col mt-6">
        <p className="text-xl md:text-3xl text-center font-bold">
          Browse All Categories
        </p>
        <div className="relative mt-2">
          <Categories />
        </div>
      </div>
      <div className="mt-8 flex flex-col justify-center items-center container-custom gap-y-3 px-2">
        <p className="text-xl md:text-3xl text-center font-bold">
          Buy from SATLAA, Govt. of India Certified Startup
        </p>
        <Image
          className="object-cover rounded-lg"
          height={400}
          width={600}
          quality={100}
          alt="alt text"
          src="/images/startup_cert.png"
        />
        <Link
          href="/pages/startup"
          className="text-left underline text-blue-500"
        >
          Know More About Startup
        </Link>
        <Link
          href="/pages/certificates"
          className="text-left underline text-blue-500"
        >
          See our All Documents & Certificates
        </Link>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  try {
    const response = await axios.get(`${API_URL}/productspublic/all`);
    const products = response.data;
    // Filter out products without a valid 'seo' value
    const paths = products
      .filter((product) => product.seo && typeof product.seo === "string")
      .map((product) => ({
        params: { seo: product.seo },
      }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("Error fetching product list:", error);
    // Return an empty paths array if there's an error fetching products
    return { paths: [], fallback: "blocking" };
  }
}
export async function getStaticProps({ params }) {
  console.log("Fetching data for:", params);
  try {
    // Fetch product information based on SEO param
    const productResponse = await axios.get(
      `${API_URL}/productspublic/product/${params.seo}`
    );

    const product = productResponse?.data?.product?.[0];

    // Check if product exists
    if (!product) {
      throw new Error("Product not found");
    }

    return {
      props: {
        productData: product,
        seo: params.seo || "",
        parentCategory: productResponse.data.parentCategory || {},
        similarProducts: productResponse.data.similarProducts || {},
        reviews: productResponse.data.reviews || {},
      },
      revalidate: 3600, // Regenerate the page every hour
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
      props: {},
    };
  }
}

export default Product;

const getStructureData = (state, imagesWithBaseURL) => {
  const escapeXml = (str) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };
  return {
    "@context": "http://schema.org/",
    "@type": "Product",
    "@id": state.sku,
    name: `SATLAA ${state.brand === 'satlaa' ? '925 Silver' : 'Silver'} ${state.title}`,
    url: "https://satlaa.com/products/" + state.seo,
    image: imagesWithBaseURL,
    description: escapeXml(
      state.description
        .replace(/<[^>]+>/g, "") // Remove HTML tags
        .replace(/&nbsp;/g, " ") // Replace &nbsp; with spaces
        .replace(/\s+/g, " ") // Normalize multiple spaces
        .replace(/&#x27;/g, "'") // Replace encoded apostrophe
    ),
    sku: state.sku,
    brand: {
      "@type": "Brand",
      name: "SATLAA Jewellery",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: state.reviewData.average_rating,
      reviewCount: state.reviewData.total_rating,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      priceValidUntil: "2025-11-05",
      price: state.price,
      itemCondition: "http://schema.org/NewCondition",
      availability: "http://schema.org/InStock",

      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCountry: "IN",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        refundType: "FullRefund",
        returnFees: "https://schema.org/FreeReturn",
        returnMethod: "https://schema.org/ReturnByMail",
        merchantReturnDays: 7,
        merchantReturnLink:
          "https://satlaa.com/pages/cancellation-return-policy",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",

        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0.00",
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 10,
            unitCode: "d",
          },
          businessDays: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "21:00",
          },
          cutoffTime: "15:00",
        },
      },
    },
  };
};
