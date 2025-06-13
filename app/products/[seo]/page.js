import { Suspense } from "react";
import { notFound } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import { API_URL, IMG_URL } from "@/config";
import Head from "@/myapp/core/Head";
import Breadcrumbs from "@/myapp/components/Utils/BreadCrumbs";
import SimilarProducts from "@/myapp/components/ProductDetail/SimilarProducts";
import ProductGallery from "@/myapp/components/ProductDetail/Gallerry";
import Categories from "@/myapp/components/Tags";
import Reviews from "@/myapp/components/Reviews";
import ProductVariants from "@/myapp/components/ProductDetail/PoductVariants";
import SkeletonProductCard from "@/myapp/components/ProductCard/skeleton";

import ClientProductLogic from "./ClientProductLogic"; // Client-side logic component

// Configure axios with timeout and retry logic
const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
});

export async function generateStaticParams() {
  try {
    const response = await axiosInstance.get(`${API_URL}/productspublic/all`, {
      retry: 3, // Retry failed requests 3 times
      retryDelay: (retryCount) => retryCount * 1000, // Wait 1s, 2s, 3s between retries
    });
    
    if (!response?.data) {
      console.error("No data received from API");
      return [];
    }

    const products = response.data;
    return products
      .filter((product) => product.seo && typeof product.seo === "string")
      .map((product) => ({ seo: product.seo }));

  } catch (error) {
    console.error("Error fetching product list:", {
      message: error.message,
      code: error.code,
      timeout: error.timeout,
      config: error.config?.url,
    });
    return []; // Return empty array on error to prevent build failure
  }
}

export async function generateMetadata({ params }) {
  try {
    const { seo } = await params;
    if (!seo) return notFound();

    const productResponse = await axiosInstance.get(`${API_URL}/productspublic/product/${seo}`);
    
    if (!productResponse?.data?.product?.[0]) {
      console.error("No product found with SEO:", seo);
      return notFound();
    }

    const product = productResponse.data.product[0];

    return {
      title: `SATLAA ${product.brand === "satlaa" ? "925 Silver" : "Silver"} ${product.title}`,
      description: product.description_short || '',
      openGraph: {
        title: `SATLAA ${product.brand === "satlaa" ? "925 Silver" : "Silver"} ${product.title}`,
        description: product.description_short || '',
        images: product.allImages?.length > 0 ? [`${IMG_URL}${product.allImages[0].image}`] : [],
        url: `https://satlaa.com/products/${seo}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error?.response?.data || error.message);
    return notFound();
  }
}

export default async function ProductPage({ params }) {
  try {
    const { seo } = await params;
    if (!seo) return notFound();

    const productResponse = await axiosInstance.get(`${API_URL}/productspublic/product/${seo}`);
    
    if (!productResponse?.data?.product?.[0]) {
      console.error("No product found with SEO:", seo);
      return notFound();
    }

    const product = productResponse.data.product[0];
    const { parentCategory, similarProducts, reviews } = productResponse.data;

    return (
      <div className="xl:mx-36 h-full bg-white">
        <Head
          title={`SATLAA ${product.brand === "satlaa" ? "925 Silver" : "Silver"} ${product.title}`}
          description={product.description_short}
          canonical={`https://satlaa.com/products/${params.seo}`}
          image={product.allImages.length > 0 ? product.allImages[0].image : ""}
        />

        <Breadcrumbs
          items={[
            { path: "/", title: "Home" },
            { path: `/${product.categoriesSeo?.[0] || ""}`, title: product.categories?.[0] || "Category" },
            { title: product.title },
          ]}
        />

      <div className="bg-white p-0 grid grid-cols-12 my-0 pt-4 relative">
        <div className="col-span-6 lg:col-span-6 rounded-lg sticky top-4 h-max">
          <Suspense fallback={<SkeletonProductCard />}>
            <ProductGallery images={product.allImages} productData={product} />
          </Suspense>
        </div>
        <div className="col-span-4 lg:col-span-5">
          <ProductVariants data={product} reviews={reviews} parentCategory={parentCategory} />
        </div>
      </div>

        {similarProducts?.length > 0 && (
          <div className="flex content-center flex-col mt-2">
            <p className="text-xl md:text-3xl text-center font-bold">Similar Products</p>
            <SimilarProducts similarProducts={similarProducts} />
          </div>
        )}

        <div className="flex content-center flex-col mt-6">
          <p className="text-xl md:text-3xl text-center font-bold">Browse All Categories</p>
          <Categories />
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
            alt="Startup Certification"
            src="/images/startup_cert.png"
          />
          <Link href="/pages/startup" className="underline text-blue-500">
            Know More About Startup
          </Link>
          <Link href="/pages/certificates" className="underline text-blue-500">
            See our All Documents & Certificates
          </Link>
        </div>

        {/* Client-side logic (authentication, cart fetching, etc.) */}
        <ClientProductLogic productData={product} />
      </div>
    );
  } catch (error) {
    return notFound();
  }
}