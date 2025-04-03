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
    <div className="mx-1 md:px-10 relative md:mt-8 h-auto text-center">
    <p className="font-Montserrat text-2xl md:text-3xl font-bold">Shop Your Favorite Color</p>
        <Swiper
          breakpoints={{
            // when window width is >= 640px
            640: {
              slidesPerView: 4.5,
              spaceBetween: 10,
            },
            // when window width is <= 639px
            0: {
              slidesPerView: 2.3,
              spaceBetween: 0,
            },
          }}
          centeredSlides={false}
          scrollbar={{ draggable: true }}
          className="tags-slider mt-2 md:mt-4 my-slider w-full text-center flex justify-center"
        >
          {state &&
            state.map((val) => (
              <SwiperSlide key={val.title} className="">
                <div className="item text-center">
                  <Link href={`${val.link}`}>
                    <Image
                      src={
                        val.image
                          ? `${IMG_URL + val.image}`
                          : "/images/nofoto.jpg"
                      }
                      alt={val.title? val.title  + ".": "Default Title"}
                      width="500"
                      height="500"
                      className="mx-auto p-1"
                    />
                    <span className="w-full float-left text-gray-600 md:text-black text-[11px] md:text-base font-Montserrat">
                      {" "}
                      {val.title}
                    </span>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
    </div>
  );
};

export default Default;
