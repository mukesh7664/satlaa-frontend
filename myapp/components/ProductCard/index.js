"use client"

import Link from "next/link";
import { useSelector } from "react-redux";
import Price from "../Price";
import { IMG_URL } from "../../../config";
import Image from "next/image";
import "react-loading-skeleton/dist/skeleton.css";
import { AiFillStar } from "react-icons/ai";

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f3f3" offset="20%" />
      <stop stop-color="#e0eafc" offset="50%" />
      <stop stop-color="#f3f3f3" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f3f3" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const Default = ({ data = null, className, category = null }) => {
  const settings = useSelector((state) => state.settings?.settings || {});
  const badges = useSelector((state) => state.badges?.badges || []);

  const getVariantPrice = (data) => {
    return (
      <span>
        <Price data={data[0].price} />
      </span>
    );
  };

  const allImgData = data?.allImages
    ? [...data.allImages].sort((a, b) => a.order - b.order)
    : [];

  const img = allImgData[0]
    ? IMG_URL + allImgData[0].image
    : "/images/nofoto.jpg";

  const bg_color = (title) => {
    const badge = badges.find((badge) => badge.title === title);
    return badge ? badge.bg_color : null;
  };

  return (
    <div className={`${className} h-full`} key={data._id}>
      <div className="relative cursor-pointer h-full flex flex-col border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <Link
          href={`/products/${data.seo}${category ? `?category=${category}` : ""}`}
          className="h-full flex flex-col"
        >
          <div className="aspect-square w-full relative overflow-hidden bg-gray-100">
            <Image
              className="w-full h-full object-contain bg-center group-hover:scale-105 transition-transform duration-300"
              src={img}
              width="220"
              height="220"
              alt={data.title}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            />
            {/* Moved rating to bottom left */}
            <div className="absolute bottom-2 left-2 flex text-xs border rounded-md overflow-hidden shadow-sm bg-white">
              <div className="flex text-xs flex-row justify-center items-center content-center bg-[#e76e81] text-white px-2 py-1">
                <p className="font-medium">{data.reviewData?.average_rating || "0.0"}</p>
                <AiFillStar className="ml-1" />
              </div>
              <p className="px-2 py-1 text-gray-700">{data.reviewData?.total_rating || 0}</p>
            </div>
            {data.badge && data.badges?.length > 0 && (
              <p
                style={{
                  backgroundColor: bg_color(data.badges[0]) || "#000000",
                }}
                className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white rounded-md"
              >
                {data.badges[0]}
              </p>
            )}
          </div>
          <div className="p-3 flex flex-col flex-grow justify-between">
            <h3 className="text-sm font-medium line-clamp-2 text-gray-800 mb-2 min-h-[40px] text-left">
              {data.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <p className="font-semibold text-gray-900">
                  {data.type ? getVariantPrice(data.variant_products) : <Price data={data.price} />}
                </p>
                {!data.type && data.before_price !== 0 && (
                  <p className="ml-2 line-through text-xs text-gray-500">
                    <Price data={data.before_price} />
                  </p>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Default;