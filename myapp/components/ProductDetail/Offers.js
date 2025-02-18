import React from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
const Offers = () => {
  const { coupons } = useSelector(({ coupons }) => coupons);
  return (
    <div>
      <p className="mt-3 w-full font-semibold text-[15px] md:text-xl text-gray-700">
        SPECIAL OFFERS
      </p>
      <Swiper
        slidesPerView={"auto"}
        pagination={false}
        breakpoints={{
          // when window width is >= 640px
          640: {
            slidesPerView: 2.8,
            spaceBetween: 10,
          },
          // when window width is <= 639px
          0: {
            slidesPerView: 2.3,
            spaceBetween: 5,
          },
        }}
        className="tags-slider my-slider w-full text-center flex justify-center gap-x-2 mt-2 ml-2"
      >
        {coupons &&
          coupons.map((coupon, i) => {
            return (
              <SwiperSlide
                key={i}
                className="border ml-1 w-full h-full gap-y-2 md:w-1/2 "
              >
                <p className="uppercase text-lg font-bold">{coupon.code}</p>
                <p className="text-sm mt-1 w-full text-gray-600">
                  {coupon.description}
                </p>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
};

export default Offers;
