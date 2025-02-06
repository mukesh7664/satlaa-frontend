import React from "react";
import { BiSolidStar, BiSolidStarHalf } from "react-icons/bi";

function StarRating({ rating, className = "" }) {
  const stars = Array(5).fill(0);
  const fullStars = Math.floor(rating);

  for (let i = 0; i < fullStars; i++) {
    stars[i] = 1;
  }

  if (!Number.isInteger(rating) && fullStars < 5) {
    stars[fullStars] = 0.5;
  }

  return (
    <div className={`flex ${className}`}>
      {stars.map((star, index) => (
        <div key={index} className="mr-1">
          {star === 1 && (
            <span className="">
              <BiSolidStar className="text-[#fbdb13] " />
            </span>
          )}
          {star > 0.1 && star < 1 && (
            <span className="">
              <BiSolidStarHalf className="text-[#fbdb13] " />
            </span>
          )}
          {star === 0 && (
            <span className="text-gray-400">
              <BiSolidStar className="text-text-gray-400" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
export default StarRating;
