"use client"

import ProductCard from "../../components/ProductCard/";
import { Swiper, SwiperSlide } from "swiper/react";
const Default = ({ state = { products: [] }, title = { title: "", description: "" } }) => {
  const products = state?.products || [];

  if (!Array.isArray(products)) {
    console.error('Expected products array, received:', products);
    return null;
  }

  return (
    <div className="bg-gray-50 w-full ">
      <div className="md:px-10 pt-2 md:py-10">
        <div className="col-span-12 text-center mb-5">
          <p className="font-Montserrat text-2xl md:text-3xl font-bold">{title.title}</p>
          <p className="text-lg">{title.description}</p>
        </div>
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
          className="tags-slider my-slider w-full text-center flex justify-center"
        >
          {products.map((data, i) => (
              <SwiperSlide key={i} className="mr-0 p-0">
                <div>
                  <ProductCard
                    data={data}
                    className="rounded-lg md:m-2  bg-white  group   overflow-hidden  shadow-sm  pb-0 "
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Default;
