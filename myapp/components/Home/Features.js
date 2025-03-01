import Image from "next/image";
import React from "react";
const features = [
  {
    title: "Affordable Jewellery",
    icon: "affordable",
    desc: "High-quality pieces at pocket-friendly prices.",
  },
  {
    title: "6 Month Warranty",
    icon: "warranty",
    desc: "Peace of mind with a 6-month guarantee on all items.",
  },
  {
    title: "Free Shipping",
    icon: "delivery",
    desc: "No extra costs, we cover the shipping for you.",
  },
  {
    title: "7 Days Return",
    icon: "return",
    desc: "Not satisfied? Return it within 7 days, hassle-free.",
  },
];

const Features = () => {
  return (
    <div className="flex flex-row content-center my-2 pt-2 w-full bg-[#f8cce4] p-4 px-4">
      {features.map((feature, i) => {
        return (
          <div
          className="md:py-2 flex gap-x-4 flex-1 flex-col md:flex-row items-center justify-center text-center px-2"
            key={i}
          >
            <Image
              className="w-1/2 md:w-2/12"
              src={
                feature.icon
                  ? `/images/icons/${feature.icon}.png`
                  : "/images/nofoto.jpg"
              }
              alt={feature.title? feature.title  + ".": "Default Title"}
              width="50"
              height="50"
            />
            <p className="mt-2 text-black font-Montserrat text-[12px] md:text-lg">
              {feature.title}
            </p>
            {/* <Image
              className=""
              src={`/images/icons/${feature.icon}.png`}
              width="60"
              height="60"
              quality={100}
              alt={feature.title}
            />
            <p className="mt-2 text-gray-500 font-Montserrat text-sm">
              {feature.title}
            </p> */}
          </div>
        );
      })}
    </div>
  );
};

export default Features;
