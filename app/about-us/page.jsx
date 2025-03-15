import React, { useState } from "react";
import Head from "../../myapp/core/Head";
import { wrapper } from "@/redux/store";
import { fetchData } from "@/util/fetchData";
const AboutUs = () => {
  return (
    <div className="container-custom text-center items-center pb-14 ">
      <Head
        title="About Satlaa - Buy Pemium Silver Fashion Jewellery Online at Affordable Price."
        keywords="About Satlaa, Online Silver Jewelry, Silver Jewelry Inquiry, Jewelry Support, Customer Feedback, Silver Jewelry Shopping, Satlaa Customer Service"
        description="Get in touch with us for inquiries, support or feedback. At Satlaa, we value our customer's experience and are here to assist you with your silver jewelry needs."
      />
      <div className="text-left">
        <div className=" lg:col-span-9 sm:order-2 order-1 prose lg:prose-xl col-span-12">
          <div className="text-2xl font-semibold col-span-12 text-primary  mb-5   ">
            About Us
          </div>
          <p>Welcome to Satlaa!</p>
          <p></p>
          <div className="media-wrap image-wrap"></div>
          <p></p>
          <p>
            At Satlaa, our mission is to provide exceptional products and
            services that cater to the diverse needs of our customers. With
            years of experience in our industry, we are dedicated to delivering
            top-quality items, while also ensuring a seamless and enjoyable
            shopping experience.
          </p>
          <p></p>
          <p>Our Team:</p>
          <p>
            Our team is composed of passionate and skilled professionals who are
            committed to delivering the best experience for our customers. We
            take pride in our deep understanding of the market and our ability
            to offer a wide range of products tailored to your needs.
          </p>
          <p>Our Products:</p>
          <p>
            We offer a wide variety of products, sourced from the best
            manufacturers and suppliers in the industry. Our products are
            carefully selected to ensure that we provide our customers with
            items that are not only high-quality but also affordable.
          </p>
          <p>Our Commitment:</p>
          <p>
            Customer satisfaction is our top priority, and we are committed to
            delivering an unparalleled level of service to our customers. We
            strive to continuously improve our offerings and stay ahead of
            industry trends to ensure that we remain the go-to destination for
            all your shopping needs.
          </p>
          <p>Our Promise:</p>
          <p>
            At Satlaa, we believe in building long-lasting relationships with
            our customers. We are dedicated to providing you with an enjoyable
            shopping experience, and we will do everything in our power to
            ensure that you are completely satisfied with your purchases.
          </p>
          <p>
            Thank you for choosing Satlaa. We look forward to serving you for
            years to come!
          </p>
          <p>
            If you have any questions or concerns, please feel free to reach out
            to our customer support team at{" "}
            <u>
              <a href="mailto:support@satlaa.com" target="_new">
                support@satlaa.com
              </a>
            </u>{" "}
            or 8239418128.
          </p>
          <p>Satlaa - Quality, Value, and Exceptional Service, Every Time</p>
        </div>
      </div>
    </div>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await fetchData(store.dispatch);

    return {
      props: {},
    };
  }
);
export default AboutUs;
