import React from "react";
import SwiperCore, { Navigation, Thumbs } from "swiper";

SwiperCore.use([Navigation, Thumbs]);

import Link from "next/link";
import { IMG_URL } from "../../../config";
import Image from "next/image";

const Default = ({ state = [] }) => {
  const css = [
    " w-8/12 md:w-4/12",
    " w-4/12 md:w-2/12",
    " w-full md:w-4/12",
    " w-6/12 md:w-2/12 md:block hidden",
    " w-6/12 md:w-6/12 md:block hidden",
  ];
  return (
    <div className="mb-14 md:px-10">
      <div className="row homeFirsBoxs ">
        {state.map((val, i) => (
          <React.Fragment key={val._id}>
            {i < 6 ? (
              <div className={" item rounded-lg group " + css[i]}>
                <Link
                  aria-label={val.link}
                  href={val.link}
                  className="rounded-lg"
                >
                  <div className="w-100 position-relative h-100 overflow-hidden rounded-lg">
                    <div className="text">{val.title}</div>
                    <Image
                      src={
                        val.image
                          ? `${IMG_URL + val.image}`
                          : "/images/nofoto.jpg"
                      }
                      alt={val.title ? val.title + "." : "Default Title"}
                      width="500"
                      height="500"
                      className="w-full h-full group-hover:scale-105 transition-all rounded-lg"
                    />
                  </div>
                </Link>
              </div>
            ) : (
              ""
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="row homeFirsBoxs" style={{ transform: "scalex(-1)" }}>
        {state.map((val, i) => (
          <React.Fragment key={val._id}>
            {i > 5 ? (
              <div
                className={" item " + css[i]}
                style={{ transform: "scalex(-1)" }}
              >
                <Link href={val.link} className="itemzoom  rounded-lg">
                  <div className="w-100 position-relative h-100">
                    <div className="text">{val.title}</div>
                    <Image
                      src={
                        val.image
                          ? `${IMG_URL + val.image}`
                          : "/images/nofoto.jpg"
                      }
                      alt={val.title ? val.title + "." : "Default Title"}
                      width="390"
                      height="390"
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                </Link>
              </div>
            ) : (
              ""
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Default;
