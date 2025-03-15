"use client";

import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaLinkedin,
  FaPinterest,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

const Share = ({ path = "", state = {} }) => {
  const productUrl = `https://satlaa.com${path || ""}`;
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (state?.allImages?.[0]?.image) {
      setImageUrl(`https://api.satlaa.com/${state.allImages[0].image}`);
    }
  }, [state]);

  return (
    <div className="flex flex-wrap gap-x-1 gp-y-2 mb-5">
      <p className="w-full text-base">
        If you loved this product, then share it on-{" "}
      </p>

      <a
        target="_blank"
        rel="noreferrer"
        href={`whatsapp://send?text=${encodeURIComponent(productUrl)}`}
        className="border px-4 py-2 text-base rounded mt-2 flex items-center justify-center"
      >
        <FaWhatsapp className="text-lg mr-2 text-[#25D366]" /> SEND
      </a>

      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(productUrl)}`}
        className="border px-4 py-2 text-base rounded mt-2 flex items-center justify-center"
      >
        <FaFacebook className="text-lg mr-2 text-[#1877F2]" /> SHARE
      </a>

      <a
        target="_blank"
        rel="noreferrer"
        href={`https://twitter.com/share?text=${encodeURIComponent(
          state?.title || "Check this out!"
        )}&url=${encodeURIComponent(productUrl)}`}
        className="border px-4 py-2 text-base rounded mt-2 flex items-center justify-center"
      >
        <FaTwitter className="text-lg mr-2 text-[#1DA1F2]" /> TWEET
      </a>

      <a
        target="_blank"
        rel="noreferrer"
        href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          productUrl
        )}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(
          state?.title || "Awesome product!"
        )}`}
        className="border px-4 py-2 text-base rounded mt-2 flex items-center justify-center"
      >
        <FaPinterest className="text-lg mr-2 text-[#E60023]" /> PIN IT
      </a>

      <a
        target="_blank"
        rel="noreferrer"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          productUrl
        )}`}
        className="border px-4 py-2 text-base rounded mt-2 flex items-center justify-center"
      >
        <FaLinkedin className="text-lg mr-2 text-[#0077B5]" /> POST
      </a>
    </div>
  );
};

export default Share;