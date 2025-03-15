"use client";

import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { IMG_URL } from "../../../config";
import Image from "next/image";

// Install Swiper modules
SwiperCore.use([Autoplay, Pagination, EffectFade]);

const HomeSlider = ({ state = [] }) => {
  return (
    <div className="relative homeSliderReslative">
      <div className="position-absolute w-full">
        <Swiper
          spaceBetween={0}
          effect="fade"
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          className="w-full"
          pagination={{ clickable: true }}
        >
          {state.map((val, index) => (
            <SwiperSlide key={val._id}>
              <div className="item">
                <Link href={val.link}>
                  {val.image_mobile && (
                    <Image
                      src={val.image_mobile ? `${IMG_URL + val.image_mobile}` : "/images/nofoto.jpg"}
                      alt={val.title ? val.title + "." : "Default Title"}
                      height={500}
                      width={1680}
                      quality={100}
                      className="block md:hidden"
                      priority={index === 0} // Prioritize first image for better performance
                      style={{ width: "100%" }}
                    />
                  )}
                  <Image
                    src={val.image ? `${IMG_URL + val.image}` : "/images/nofoto.jpg"}
                    className="md:block hidden w-full"
                    height={500}
                    width={1680}
                    quality={100}
                    priority={index === 0} // Prioritize first image for better performance
                    alt={val.title ? val.title + "." : "Default Title"}
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

export default HomeSlider;