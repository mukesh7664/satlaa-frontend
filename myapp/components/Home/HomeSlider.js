import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper core and required modules

import SwiperCore, { Autoplay, Pagination, EffectFade } from "swiper";
// install Swiper modules
SwiperCore.use([Autoplay, Pagination, EffectFade]);
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { IMG_URL } from "../../../config";
import Image from "next/image";

const Default = ({ state = [] }) => {
  useEffect(() => {}, []);

  return (
    <div className=" relative  homeSliderReslative">
      <div className="position-absolute w-full">
        <Swiper
          spaceBetween={0}
          effect="fade"
          style={{
            "--swiper-navigation-color": "#000",
            "--swiper-pagination-color": "#000",
          }}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          className="w-full"
          pagination={{ clickable: true }}
        >
          {state.map((val) => (
            <SwiperSlide key={val._id}>
              <div className="item">
                <Link href={val.link}>
                  {val.image_mobile && (
                    <Image
                      src={
                        val.image_mobile
                          ? `${IMG_URL + val.image_mobile}`
                          : "/images/nofoto.jpg"
                      }
                      alt={val.title? val.title  + ".": "Default Title"}
                      height="500"
                      width="1680"
                      quality={100}
                      className="block md:hidden"
                      priority='true'
                      style={{ width: "100%" }}
                    />
                  )}
                  <Image
                     src={
                      val.image
                        ? `${IMG_URL + val.image}`
                        : "/images/nofoto.jpg"
                    }
            
                    className="md:block hidden w-full"
                    height="500"
                    priority='true'
                    width="1680"
                    quality={100}

                 alt={val.title? val.title  + ".": "Default Title"}
                  />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div style={{ clear: "both" }} />
    </div>
  );
};

export default Default;
