import Link from "next/link";
import { useSelector } from "react-redux";
import Price from "../Price";
import { IMG_URL } from "../../../../config";
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
  const { settings } = useSelector(({ settings }) => settings);
  const { badges } = useSelector(({ badges }) => badges);
  badges;
  const getVariantPrice = (data) => {
    
    return (
          <span>
            <Price data={data[0].price} />
          </span>
        );
    // if (data.length > 0) {
    //   const newData = data.sort((a, b) => {
    //     return a.price - b.price;
    //   });
    //   return (
    //     <span>
    //       <Price data={newData[0].price} /> -{" "}
    //       <Price data={newData[data.length - 1].price} />{" "}
    //     </span>
    //   );
    // }
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
    <div className={`${className} `} key={data._id}>
      <div className="relative cursor-pointer h-full">
        <Link
          href={`/products/${data.seo}${
            category ? `?category=${category}` : ""
          }`}
          className="h-full"
        >
          <div className="w-full">
            <div className="w-full relative overflow-hidden ">
              {/* <span
                        className={`${func.getDiscount(data) ? "visible" : "invisible"
                        } absolute z-10 top-0 mt-2 text-xs float-right py-1 px-2  bg-red-600 text-white`}
                     >
                        {settings.price_type
                           ? "%" + Number(func.getDiscount(data)).toFixed(0)
                           : Number(func.getDiscount(data)).toFixed(0) + "%"}{" "}
                        discount
                     </span> */}

              <Image
                //  loader={ imageLoader}
                className="w-full h-full bg-center md:group-hover:opacity-75 transition-all "
                src={img}
                width="220"
                height="220"
                alt={data.title}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(700, 475)
                )}`}
              />
              <div className="absolute bottom-0 left-0 flex text-xs border bg-pink-50 pr-1">
                <div className="flex text-xs flex-row justify-center items-center content-center bg-secondary text-white px-1">
                  <p>{data.reviewData.average_rating}</p>
                  <AiFillStar className="" />
                </div>
                <p className="ml-2">{data.reviewData.total_rating}</p>
              </div>
              <p
                style={{
                  backgroundColor: data.badge
                    ? bg_color(data.badges[0])
                    : "#000000",
                }}
                className={`absolute top-0 left-0 px-1 text-sm text-white`}
              >
                {data.badge && data.badges[0]}
              </p>
              <ul className="product-links">
                {/* <li><a href="#" data-tip="Add to Wishlist"><HeartOutlined /></a></li> 
                  <li><a href="#" data-tip="Quick View"><EyeOutlined /></a></li>
                */}
              </ul>
            </div>
            <div className="mt-2 w-full h-full flex flex-col  ">
              {/* <ul className="rating">
                      <li className="fas fa-star"></li>
                      <li className="fas fa-star"></li>
                      <li className="fas fa-star"></li>
                      <li className="far fa-star"></li>
                      <li className="far fa-star"></li>
                  </ul> 
              */}
              <h3 className="w-full text-center px-1 text-black text-sm md:text-base py-2 group-hover:underline">
                {data.title}
              </h3>
              <div className="text-center text-md items-center justify-center  relative flex flex-row ">
                <p className="md:text-lg">
                  {data.type ? (
                    getVariantPrice(data.variant_products)
                  ) : (
                    <Price data={data.price} />
                  )}

              
                </p>
                <p className="ml-2 line-through text-xs mb-0">
                  {!data.type ? (
                    <>
                      {" "}
                      {data.before_price != 0 ? (
                        <Price data={data.before_price} />
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Default;
