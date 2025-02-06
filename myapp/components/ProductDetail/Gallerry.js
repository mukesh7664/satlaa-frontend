"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Thumbs, Autoplay, Pagination } from "swiper";
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});
import "yet-another-react-lightbox/styles.css";
SwiperCore.use([Navigation, Thumbs, Autoplay, Pagination]);
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import { SlMagnifierAdd } from "react-icons/sl";

import "swiper/css/pagination";
import { IMG_URL } from "../../../config";
import Image from "next/image";
import NextJsImage from "../Helper/FancyBox";
import dynamic from "next/dynamic";
const VideoPlayer = dynamic(() => import("../Utils/VideoPlayer"), {
  ssr: false,
});

const ProductImages = ({ images = [], productData }) => {
  const state = images.sort((a, b) => a.order - b.order);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [playing, setPlaying] = useState(
    state.map((slide) => slide.type === "video")
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
      <Swiper
        style={{
          "--swiper-navigation-color": "#000",
          "--swiper-pagination-color": "#000",
        }}
        spaceBetween={20}
        thumbs={{ swiper: thumbsSwiper }}
        autoplay={{
          delay: 15000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="w-full mb-1 text-center h-full"
        onSlideChange={handleSlideChange}
      >
        {state.map((val, i) => (
          <SwiperSlide key={val.image}>
            <div className="item -mb-10 h-full my-auto relative bg-white">
              <div className="absolute bottom-4 right-3 rounded-full bg-white shadow p-2">
                <SlMagnifierAdd className="text-base md:text-2xl " />
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
                  width="500"
                  height="500"
                  priority={true}
                  alt={val.title ? val.title : productData.title + " " + i}
                  title={val.title ? val.title : productData.title + " " + i}
                  quality={100}
                  className="w-full object-contain h-full mb-8"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        freeMode={true}
        watchSlidesProgress={true}
        className="mySwiper h-full w-full"
        breakpoints={{
          100: {
            slidesPerView: 4.5,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 7,
            spaceBetween: 30,
          },
        }}
      >
        {state.map((val, i) => (
          <SwiperSlide key={i}>
            <div className="item">
              <Image
                src={
                  val.image ? `${IMG_URL + val.image}` : "/images/nofoto.jpg"
                }
                priority={true}
                width="500"
                height="500"
                alt={val.title ? val.title + "." : productData.title + " " + i}
                title={
                  val.title ? val.title + "." : productData.title + " " + i
                }
                className="bg-cover bg-center object-contain w-20"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {setLightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          zoom={true}
          plugins={[Zoom, Download]}
          close={() => setLightboxOpen(false)}
          slides={state.map((image) => ({
            src: IMG_URL + image.image,
            width: 500,
            height: 500,
          }))} // Provide necessary properties for NextJsImage
          index={selectedImage}
          render={{ slide: (props) => <NextJsImage {...props} /> }} // Use function to render NextJsImage
        />
      )}
    </div>
  );
};

export default ProductImages;
