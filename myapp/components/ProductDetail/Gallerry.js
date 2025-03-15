"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Thumbs, Autoplay, Pagination } from "swiper";
import dynamic from "next/dynamic";
import Image from "next/image";
import { SlMagnifierAdd } from "react-icons/sl";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import "yet-another-react-lightbox/styles.css";

const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});
const Zoom = dynamic(
  () => import("yet-another-react-lightbox/plugins/zoom"),
  { ssr: false }
);
const Download = dynamic(
  () => import("yet-another-react-lightbox/plugins/download"),
  { ssr: false }
);
const VideoPlayer = dynamic(() => import("../Utils/VideoPlayer"), {
  ssr: false,
});
const NextJsImage = dynamic(() => import("../Helper/FancyBox"), {
  ssr: false,
});

SwiperCore.use([Navigation, Thumbs, Autoplay, Pagination]);

import { IMG_URL } from "../../../config";

const ProductImages = ({ images = [], productData }) => {
  const sortedImages = images.sort((a, b) => a.order - b.order);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [playing, setPlaying] = useState(
    sortedImages.map((slide) => slide.type === "video")
  );

  const handleImageClick = (position) => {
    setSelectedImage(position);
    setLightboxOpen(true);
  };

  const handleSlideChange = (swiper) => {
    const index = swiper.realIndex;
    const newPlayingState = playing.map((state, i) => i === index);
    setPlaying(newPlayingState);
  };

  return (
    <div className="w-full relative">
      {/* Main Swiper */}
      <Swiper
        style={{
          "--swiper-navigation-color": "#000",
          "--swiper-pagination-color": "#000",
        }}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-[500px] text-center"
        onSlideChange={handleSlideChange}
      >
        {sortedImages.map((val, i) => (
          <SwiperSlide key={val.image}>
            <div className="h-full relative bg-white flex justify-center items-center">
              <div
                className="absolute bottom-4 right-3 rounded-full bg-white shadow p-2 cursor-pointer"
                onClick={() => handleImageClick(i)}
              >
                <SlMagnifierAdd className="text-base md:text-2xl" />
              </div>
              {val.video ? (
                <VideoPlayer
                  playing={playing[i]}
                  url={`https://stream.mux.com/${val.video}.m3u8`}
                />
              ) : (
                <Image
                  onClick={() => handleImageClick(i)}
                  src={
                    val.image ? `${IMG_URL + val.image}` : "/images/nofoto.jpg"
                  }
                  width={500}
                  height={500}
                  priority
                  alt={val.title || `${productData.title} ${i}`}
                  title={val.title || `${productData.title} ${i}`}
                  quality={100}
                  className="w-full h-full object-contain cursor-pointer"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}
      <Swiper
        onSwiper={setThumbsSwiper}
        freeMode
        watchSlidesProgress
        className="mySwiper mt-2 h-[100px] w-full overflow-hidden"
        breakpoints={{
          100: { slidesPerView: 4.5, spaceBetween: 10 },
          1024: { slidesPerView: 7, spaceBetween: 15 },
        }}
      >
        {sortedImages.map((val, i) => (
          <SwiperSlide key={i}>
            <div className="cursor-pointer border border-transparent hover:border-gray-400 rounded">
              <Image
                src={val.image ? `${IMG_URL + val.image}` : "/images/nofoto.jpg"}
                width={100}
                height={100}
                alt={val.title || `${productData.title} ${i}`}
                title={val.title || `${productData.title} ${i}`}
                className="w-20 h-20 object-cover"
                onClick={() => handleImageClick(i)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={sortedImages.map((image) => ({
            src: IMG_URL + image.image,
            width: 1000,
            height: 1000,
          }))}
          index={selectedImage}
          plugins={[Zoom, Download]}
          render={{ slide: (props) => <NextJsImage {...props} /> }}
        />
      )}
    </div>
  );
};

export default ProductImages;