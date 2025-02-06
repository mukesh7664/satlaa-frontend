import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Divider, Radio, Form, Input } from "antd";

import { getCart as getCart_r } from "../../../redux/reducers/Cart";
import Price from "../Price";
import AddProductButton from "./AddProductButton";
import func from "../../../util/helpers/func";

const ProductDrawer = dynamic(
  () => import("../../components/Drawer/ProductDrawer"),
  {
    ssr: false,
  }
);

import { useRouter } from "next/router";

import StarRating from "../Utils/StarRating";
import Image from "next/image";

import { API_URL, IMG_URL } from "../../../../config";
import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Share from "./Share";
import MoreInfo from "./MoreInfo";
import Marketplace from "./Marketplace";
import DeliveryTime from "./DeliveryTime";
import Offers from "./Offers";
const Reviews = dynamic(() => import("../Reviews"));
const features = [
  { title: "Affordable Jewellery", icon: "affordable_c" },
  { title: "6 Month Warranty", icon: "warranty_c" },
  { title: "All India COD", icon: "delivery_c" },
  { title: "7 Days Return", icon: "return_c" },
];
const features_bw = [
  { title: "Affordable Jewellery", icon: "affordable" },
  { title: "6 Month Warranty", icon: "warranty" },
  { title: "All India COD", icon: "delivery" },
  { title: "7 Days Return", icon: "return" },
];
const HTMLParser = dynamic(() => import("../../components/Utils/HtmlParser"), {
  ssr: false, // Disable server-side rendering if needed
  // Optional loading component
});

const ProductDetail = ({ data = {}, reviews, parentCategory, banners }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const cart = useSelector(({ cart }) => cart);

  const state = data;
  const [contentDescription, seTcontentDescription] = useState("<p></p>");
  const [contentPoints, seTcontentPoints] = useState("<p></p>");
  const [loadingButton, seTloadingButton] = useState(true);
  const [disabledVariant, seTdisabledVariant] = useState(true);
  const [priceAdd, seTpriceAdd] = useState({
    before_price: 0,
    price: 0,
    qty: 1,
  });
  const [addToCartForm] = Form.useForm();
  const dispatch = useDispatch();
  // const seo = router.query.seo
  const getCart = (id) => {
    dispatch(getCart_r(id));
  };
  const replaceStyle = (dataHtml) => {
    return dataHtml
      .replaceAll("<p>", "<p style='min-height:25px' >")
      .replaceAll(
        "<pre>",
        "<pre  style='min-height:30px; background-color:#dbdbdb; padding:15px' >"
      )
      .replaceAll("<img ", "<img class='w-full sm:w-auto' ")
      .replaceAll(
        '<div class="media-wrap image-wrap ',
        '<div class="media-wrap image-wrap  w-full sm:w-auto '
      );
  };
  useEffect(() => {
    if (user && user.id) {
      getCart(user.id);
    }
    seTcontentDescription(replaceStyle(state.description));
    seTcontentPoints(replaceStyle(state.bullet_points || ""));
  }, [state.description, state.bullet_points, user]);

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  const getVariantPrice = (data) => {
    if (data.length > 0) {
      const newData = data.sort((a, b) => {
        return a.price - b.price;
      });
      return (
        <span>
          <Price data={newData[0].price} /> -
          <Price data={newData[data.length - 1].price} />
        </span>
      );
    }
  };
  const removeSilverWords = (str) => {
    return str.replace(/\b(925|silver)\b\s*/gi, "");
  };
  return (
    <div className="lg:pl-10 px-2">
      <h2 className="font-semibold font-Roboto mt-5 md:mt-0 text-xl md:text-2xl">
      {state.brand === 'satlaa' ? '925 Silver': 'Silver'}  {removeSilverWords(state.title)}
      </h2>
      <div className="flex items-center content-center p-1">
        <div className="flex flex-row justify-center items-center content-center text-black">
          <StarRating
            className="text-lg"
            rating={data.reviewData.average_rating}
          />
        </div>
        <p className="ml-1 flex content-center">
          {data.reviewData.average_rating} | {data.reviewData.total_rating}{" "}
          (Inc. Amazon/Flipkart)
        </p>
      </div>
      {/* <p className="">MADE WITH 925 SILVER</p> */}
      <h3 className="text-gray-500 font-bold mt-1 text-[24px] font-Samarkan md:ml-1">
        MADE IN PURE SILVER
      </h3>
      <div className="my-4 w-full">
        {state.type ? (
          <>
            {disabledVariant ? (
              <h1 className=" text-primary font-semibold text-2xl">
                {priceAdd.price != 0 ? (
                  <Price data={priceAdd.price} />
                ) : (
                  getVariantPrice(state.variant_products)
                )}

                {priceAdd.before_price != 0 &&
                priceAdd.before_price > priceAdd.price ? (
                  <span className="line-through ml-3 text-sm text-black">
                    <Price data={priceAdd.before_price} /> (Incl. of all taxes)
                  </span>
                ) : (
                  ""
                )}
              </h1>
            ) : (
              <h2 className="text-red-500">This is variant not shipping.</h2>
            )}
          </>
        ) : (
          <h1 className="text-black text-2xl">
            {disabledVariant ? (
              <>
                <Price data={state.price} />

                {state.before_price != 0 ? (
                  <span className="ml-3 text-sm text-gray-500">
                    MRP&nbsp;
                    <span className="line-through">₹{state.before_price}</span>
                    (Incl. of all taxes)
                  </span>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </h1>
        )}
      </div>

      {/* <div className="overflow-hidden bg-gray-100 py-2 out-of-box">
        <div className="whitespace-nowrap animate-marquee flex flex-row gap-x-4  text-black">
          {features_bw.map((feature, i) => {
            return (
              <div
                className="flex flex-row items-center mx-2 gap-x-2 mr-6" // Added items-center for vertical alignment
                key={i}
              >
                <Image
                  className=""
                  src={`/images/icons/${feature.icon}.png`}
                  width="30"
                  height="30"
                  quality={100}
                  alt={feature.title}
                />
                <p className="text-black font-Montserrat text-sm">
                  {feature.title}
                </p>
              </div>
            );
          })}
        </div>
      </div> */}

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

      {state.parentData && (
        <>
          <Divider />
          <div className="mt-4">
            <p className="text-lg text-black font-semibold font-Montserrat">
              {/* {state.parentData.option_title} */}
              Try Different Style
            </p>
            <div className="flex flex-wrap gap-x-4">
              {state.parentData.products.map((product, i) => {
                return (
                  <div
                    key={i}
                    className={`flex w-1/4 md:w-1/6 xl:w-[18%] flex-col items-center justify-between mt-2 mb-3 ${
                      state.sku === product.product.sku ? "" : ""
                    }`}
                  >
                    <p className="font-Nunito">{product.title}</p>
                    <Link
                      href={`/products/${product.product.seo}`}
                      className={` shadow-md p-1 mt-1 ${
                        state.sku === product.product.sku
                          ? "border-2 border-primary"
                          : ""
                      }`}
                    >
                      <Image
                        className=""
                        src={
                          product.product.imageData?.image
                            ? `${API_URL}/${product.product.imageData?.image}`
                            : "/images/nofoto.jpg"
                        }
                        width="90"
                        height="90"
                        alt={product.product.title}
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          <Divider />
        </>
      )}

      <div>
        <Form
          form={addToCartForm}
          name="add"
          onFinishFailed={onFinishFailed}
          scrollToFirstError
          layout="vertical"
          className="w-full "
        >
          {state.type ? (
            <>
              {state.variants.map((x) => (
                <div key={x.name}>
                  <Form.Item
                    name={x.name}
                    label={
                      addToCartForm.getFieldValue(x.name) ? (
                        <span className="font-normal">
                          {x.name} :
                          <span className="font-semibold">
                            {addToCartForm.getFieldValue(x.name)}
                          </span>
                        </span>
                      ) : (
                        <span className="font-normal">
                          {x.name} :
                          <span className="text-gray-500"> Please Select</span>
                        </span>
                      )
                    }
                    labelAlign="left"
                    className="mb-0 pb-0 mt-5 "
                    rules={[
                      {
                        required: true,
                        message: "Please Select",
                        whitespace: true,
                      },
                    ]}
                  >
                    <Radio.Group
                      name={x.name}
                      optionType="button"
                      buttonStyle="outline"
                      className="pl-2 mt-2 mb-1 "
                      required
                      onChange={(y) => {
                        const data = state;
                        data.selectedVariants = {
                          ...data.selectedVariants,
                          [y.target.name]: y.target.value,
                        };
                        const priceMath = func.filter_array_in_obj(
                          data.variant_products,
                          data.selectedVariants
                        );

                        if (priceMath.length == 1) {
                          if (priceMath[0].qty == "0") {
                            seTdisabledVariant(false);
                          } else if (priceMath[0].visible) {
                            seTdisabledVariant(true);
                          } else {
                            seTdisabledVariant(false);
                          }
                        }

                        seTpriceAdd({
                          qty: priceAdd.qty,
                          price: priceMath[0].price * priceAdd.qty,
                          before_price:
                            priceMath[0].before_price * priceAdd.qty,
                        });
                      }}
                    >
                      {x.value.map((z, i) => {
                        return (
                          <Radio.Button key={i} value={z}>
                            {z}
                          </Radio.Button>
                        );
                      })}
                    </Radio.Group>
                  </Form.Item>
                </div>
              ))}
            </>
          ) : (
            ""
          )}

          {/* <label>Adet: <br /></label>
                            <div>
                                <Input type="number" onChange={x => {

                                    seTpriceAdd({
                                        qty: x.target.value,
                                        price: state.price * x.target.value,
                                        before_price: state.before_price * x.target.value
                                    })

                                }}
                                    value={priceAdd.qty}
                                />
                            </div> */}

          {state.qty > 0 ? (
            <AddProductButton
              disabledVariant={disabledVariant}
              form={addToCartForm}
              seTloadingButton={seTloadingButton}
              loadingButton={loadingButton}
              cart={cart}
              isAuthenticated={isAuthenticated}
              user={user}
              state={state}
              priceAdd={priceAdd}
              getCart={getCart}
            />
          ) : (
            <div className="flex flex-col">
              <p className="text-red-600 text-xl font-semibold">
                Currently Out Of Stock
              </p>
              <p className="text-base">
                We will restock it soon, Click to get notification when
                restock&nbsp;
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://api.whatsapp.com/send?phone=919257120925&text=Notify%20me%20about%20this%20https://satlaa.com${router.asPath}`}
                  className="underline text-blue-600"
                >
                  Notify Me
                </a>
              </p>
            </div>
          )}
        </Form>
      </div>
      <DeliveryTime />
      <Divider className="hidden md:block" />
      {banners.top && (
        <Image
          src={
            banners.top.banner_mobile
              ? `${IMG_URL}${banners.top.banner_mobile}`
              : "/images/nofoto.jpg"
          }
          height="500"
          width="1680"
          className="w-full border my-2 md:my-3 bg-gray-100 group overflow-hidden pb-0"
          priority="true"
          style={{ width: "100%" }}
          alt={
            banners.top.seo_title
              ? banners.top.seo_title
              : "Default Title"
          }
        />
      )}
      <Divider className="hidden md:block" />
      <Offers />
      {(data.marketplaceLinks?.amazon || data.marketplaceLinks?.flipkart || data.marketplaceLinks?.myntra)  && (
        <Marketplace data={data} />
      )}

      {contentPoints && (
        <div className="flex flex-col justify-center mt-4">
          <p className="text-[18px] md:text-xl font-semibold font-Poppins  ">
            About this item
          </p>
          <div className="text-base px-1 list-disc gap-y-2">
            <HTMLParser html={contentPoints} />
          </div>
        </div>
      )}
      {/* <h3 className="text-gray-500">{state.description_short}</h3> */}
      <ProductDrawer contentDescription={contentDescription} state={state} />
      <MoreInfo />
      <Divider />
      
      {banners.middle && (
        <Image
          src={
            banners.middle.banner_mobile
              ? `${IMG_URL}${banners.middle.banner_mobile}`
              : "/images/nofoto.jpg"
          }
          height="500"
          width="1680"
          className="w-full border my-2 md:my-3 bg-gray-100 group overflow-hidden pb-0"
          priority="true"
          style={{ width: "100%" }}
          alt={
            banners.middle.seo_title
              ? banners.middle.seo_title
              : "Default Title"
          }
        />
      )}
      <Divider />
      {/* Share Button  */}
      <Share path={router.asPath} state={state} />
      {reviews && reviews.length > 0 && <Reviews reviews={reviews} />}
      <Divider />
    </div>
  );
};

export default ProductDetail;
