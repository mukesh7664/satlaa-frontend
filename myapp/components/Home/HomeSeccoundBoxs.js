import { Swiper, SwiperSlide } from "swiper/react";
import ProductCardHome from "../ProductCard/home";
// import Swiper core and required modules
import SwiperCore, { Navigation, Thumbs, Autoplay } from "swiper";

// install Swiper modules
SwiperCore.use([Navigation, Thumbs, Autoplay]);

const Default = ({ state = [], title = { title: "", description: "" } }) => {
  return (
    <div className="bg-gray-100 py-8">
      <div className="mx-auto w-11/12">
        <div className="text-center mb-8">
          <p className="font-Montserrat text-2xl md:text-3xl font-bold">
            {title.title}
          </p>
          <p className="text-lg">{title.description}</p>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          style={{
            "--swiper-navigation-color": "#000",
            "--swiper-pagination-color": "#000",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: true,
          }}
          breakpoints={{
            340: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1224: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {state &&
            state.map((data) => (
              <SwiperSlide key={data._id} className="py-4">
                <ProductCardHome
                  data={data}
                  className="rounded-lg hover:bg-white bg-gray-50 group overflow-hidden shadow-sm hover:shadow-xl"
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Default;
