import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, History } from "swiper";
import { useSelector } from "react-redux";
import Link from "next/link";
import { IMG_URL } from "../../../config";
import Image from "next/image";

SwiperCore.use([Navigation, Pagination, History]);

const Default = () => {
  const { categories } = useSelector(({ categories }) => categories);

  return (
    <div className="mx-1 md:mx-4 relative md:mt-8 h-auto ">
      <div className="">
        <Swiper
          slidesPerView={"auto"}
          pagination={false}
          className="tags-slider my-slider w-full text-center flex justify-center"
        >
          {categories &&
            categories.map((val) => (
              <SwiperSlide key={val.title} className="w-1/4">
                <div className="item text-center gradient-border">
                  <Link href={`/${val.seo}`}>
                    <Image
                      src={
                        val.image
                          ? `${IMG_URL + val.image}`
                          : "/images/nofoto.jpg"
                      }
                      alt={val.title ? val.title+' category icon' : "Default Title"}
                      width="180"
                      height="180"
                      priority={true}
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
    </div>
  );
};

export default Default;
