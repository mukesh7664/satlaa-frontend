"use client";
import { Fade } from "react-slideshow-image";
import { getStrapiMedia } from "@/util/strapi-api-helpers";
import Image from "next/image";

export default function Slideshow({ data }) {
  return (
    <div className="slide-container">
      <Fade>
        {data.files.data.map((fadeImage, index) => {
          const imageUrl = getStrapiMedia(fadeImage.attributes.url);
          return (
            <div key={index}>
              {imageUrl && <Image className="w-full h-96 object-cover rounded-lg" height={400} width={600} alt="alt text" src={imageUrl} />}
            </div>
          );
        })}
      </Fade>
    </div>
  );
}
