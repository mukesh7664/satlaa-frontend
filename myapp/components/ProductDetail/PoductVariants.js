import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Divider, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import { getCart as getCart_r } from "../../../redux/reducers/Cart";
import Price from "../Price";
import AddProductButton from "./AddProductButton";
import func from "../../../util/helpers/func";
import { API_URL, IMG_URL } from "../../../config";

const HTMLParser = dynamic(() => import("../../components/Utils/HtmlParser"), { ssr: false });
const ProductDrawer = dynamic(() => import("../../components/Drawer/ProductDrawer"), { ssr: false });
const Reviews = dynamic(() => import("../Reviews"));
const Share = dynamic(() => import("./Share"));
const MoreInfo = dynamic(() => import("./MoreInfo"));
const Marketplace = dynamic(() => import("./Marketplace"));
const DeliveryTime = dynamic(() => import("./DeliveryTime"));
const Offers = dynamic(() => import("./Offers"));
import StarRating from "../Utils/StarRating";

const features = [
  { title: "Affordable Jewellery", icon: "affordable_c" },
  { title: "6 Month Warranty", icon: "warranty_c" },
  { title: "All India COD", icon: "delivery_c" },
  { title: "7 Days Return", icon: "return_c" },
];

const ProductDetail = ({ data = {}, reviews, banners }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const cart = useSelector(({ cart }) => cart);
  const dispatch = useDispatch();

  const [contentDescription, setContentDescription] = useState("<p></p>");
  const [contentPoints, setContentPoints] = useState("<p></p>");
  const [loadingButton, setLoadingButton] = useState(true);
  const [disabledVariant, setDisabledVariant] = useState(true);
  const [priceAdd, setPriceAdd] = useState({ before_price: 0, price: 0, qty: 1 });

  const { control, watch, setValue } = useForm();

  useEffect(() => {
    if (user && user.id) {
      dispatch(getCart_r(user.id));
    }
    const replaceStyle = (html) =>
      html
        .replaceAll("<p>", "<p style='min-height:25px' >")
        .replaceAll(
          "<pre>",
          "<pre style='min-height:30px; background-color:#dbdbdb; padding:15px' >"
        )
        .replaceAll("<img ", "<img class='w-full sm:w-auto' ");

    setContentDescription(replaceStyle(data.description));
    setContentPoints(replaceStyle(data.bullet_points || ""));
  }, [data.description, data.bullet_points, user]);

  const handleVariantChange = (variantName, value) => {
    setValue(variantName, value);
    const selectedVariants = {
      ...watch(),
      [variantName]: value,
    };

    const matchedVariant = func.filter_array_in_obj(data.variant_products, selectedVariants);
    if (matchedVariant.length === 1) {
      setDisabledVariant(matchedVariant[0].qty !== "0" && matchedVariant[0].visible);
      setPriceAdd({
        qty: priceAdd.qty,
        price: matchedVariant[0].price * priceAdd.qty,
        before_price: matchedVariant[0].before_price * priceAdd.qty,
      });
    }
  };

  return (
    <div className="lg:pl-10 px-2">
      <h2 className="font-semibold font-Roboto mt-5 md:mt-0 text-xl md:text-2xl">
        {data.brand === "satlaa" ? "925 Silver" : "Silver"} {data.title.replace(/\b(925|silver)\b\s*/gi, "")}
      </h2>
      <div className="flex items-center p-1">
        <StarRating className="text-lg" rating={data.reviewData.average_rating} />
        <p className="ml-1">
          {data.reviewData.average_rating} | {data.reviewData.total_rating} (Inc. Amazon/Flipkart)
        </p>
      </div>
      <h3 className="text-gray-500 font-bold mt-1 text-[24px] font-Samarkan md:ml-1">MADE IN PURE SILVER</h3>
      <div className="my-4 w-full">
        {data.type ? (
          disabledVariant ? (
            <h1 className="text-primary font-semibold text-2xl">
              <Price data={priceAdd.price || data.variant_products?.[0]?.price} />
              {priceAdd.before_price > priceAdd.price && (
                <span className="line-through ml-3 text-sm text-black">
                  <Price data={priceAdd.before_price} /> (Incl. of all taxes)
                </span>
              )}
            </h1>
          ) : (
            <h2 className="text-red-500">This variant is not available.</h2>
          )
        ) : (
          <h1 className="text-black text-2xl">
            {disabledVariant && (
              <>
                <Price data={data.price} />
                {data.before_price !== 0 && (
                  <span className="ml-3 text-sm text-gray-500">
                    MRP <span className="line-through">₹{data.before_price}</span> (Incl. of all taxes)
                  </span>
                )}
              </>
            )}
          </h1>
        )}
      </div>
      <div className=" flex-row content-around px-1 my-2 pt-2 flex ">
        {features.map((feature, i) => {
          return (
            <div
              className="flex flex-1 flex-col justify-center content-center px-2"
              key={i}
            >
              <Image
                className=""
                src={`/images/icons/${feature.icon}.png`}
                width="60"
                height="60"
                alt={feature.title}
              />
              <p className="mt-2 text-gray-500 font-Montserrat text-sm">
                {feature.title}
              </p>
            </div>
          );
        })}
      </div>
      <Divider className="mt-4  mb-4 "/>
      <form>
        {data.variants?.map((variant) => (
          <FormControl key={variant.name} component="fieldset" className="mb-4">
            <FormLabel component="legend" className="font-semibold">
              {variant.name}
            </FormLabel>
            <Controller
              name={variant.name}
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onChange={(e) => handleVariantChange(variant.name, e.target.value)}
                  className="pl-2 mt-2 mb-1"
                >
                  {variant.value.map((option, index) => (
                    <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={
                      <div className="flex items-center space-x-2">
                        {variant.images?.[index] && (
                          <Image
                            src={`${IMG_URL}${variant.images[index]}`}
                            alt={option}
                            width={40}
                            height={40}
                            className="border rounded-md"
                          />
                        )}
                        <span>{option}</span>
                      </div>
                    }
                  />
                  ))}
                </RadioGroup>
              )}
            />
          </FormControl>
        ))}
      </form>
      {data.qty > 0 ? (
        <AddProductButton
          disabledVariant={disabledVariant}
          loadingButton={loadingButton}
          setLoadingButton={setLoadingButton}
          cart={cart}
          isAuthenticated={isAuthenticated}
          user={user}
          state={data}
          priceAdd={priceAdd}
        />
      ) : (
        <p className="text-red-600 text-xl font-semibold">Currently Out Of Stock</p>
      )}
      <DeliveryTime />
      <Divider className="mb-4 mt-4"/>
      {banners?.top && <Image src={`${IMG_URL}${banners.top.banner_mobile}`} width={1680} height={500} alt="Banner" />}
      <Offers />
      {contentPoints && <HTMLParser html={contentPoints} />}
      <ProductDrawer contentDescription={contentDescription} state={data} />
      <MoreInfo />
      <Share path={router.asPath} state={data} />
      {reviews?.length > 0 && <Reviews reviews={reviews} />}
      <Divider />
    </div>
  );
};

export default ProductDetail;