"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateData } from "@/redux/reducers/DataSlice";
import Link from "next/link";

const AboutUsClient = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (data) {
//       dispatch(hydrateData(data)); // ✅ Dispatch fetched data
//     }
//   }, [dispatch, data]);

  return (
    <div className="container-custom text-center items-center pb-14">
      <div className="text-left">
        <div className="lg:col-span-9 sm:order-2 order-1 prose lg:prose-xl col-span-12">
          <h2 className="text-2xl font-semibold text-primary mb-5">About Us</h2>

          <p>Welcome to Satlaa!</p>

          <p>
            At Satlaa, our mission is to provide exceptional products and services that cater to the diverse needs of our customers.
            With years of experience in our industry, we are dedicated to delivering top-quality items while ensuring a seamless and enjoyable shopping experience.
          </p>

          <h3>Our Team:</h3>
          <p>
            Our team is composed of passionate and skilled professionals committed to delivering the best experience for our customers.
            We take pride in our deep understanding of the market and our ability to offer a wide range of products tailored to your needs.
          </p>

          <h3>Our Products:</h3>
          <p>
            We offer a wide variety of products, sourced from the best manufacturers and suppliers in the industry.
            Our products are carefully selected to ensure that we provide our customers with items that are not only high-quality but also affordable.
          </p>

          <h3>Our Commitment:</h3>
          <p>
            Customer satisfaction is our top priority, and we are committed to delivering an unparalleled level of service to our customers.
            We strive to continuously improve our offerings and stay ahead of industry trends to ensure that we remain the go-to destination for all your shopping needs.
          </p>

          <h3>Our Promise:</h3>
          <p>
            At Satlaa, we believe in building long-lasting relationships with our customers.
            We are dedicated to providing you with an enjoyable shopping experience, and we will do everything in our power to ensure that you are completely satisfied with your purchases.
          </p>

          <p>
            Thank you for choosing Satlaa. We look forward to serving you for years to come!
          </p>

          <p>
            If you have any questions or concerns, please feel free to reach out to our customer support team at{" "}
            <Link href="mailto:support@satlaa.com" className="underline text-blue-600">
              support@satlaa.com
            </Link> or call <strong>8239418128</strong>.
          </p>

          <p>Satlaa - Quality, Value, and Exceptional Service, Every Time</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsClient;