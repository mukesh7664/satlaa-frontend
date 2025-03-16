
import React from "react";
import { fetchData } from "@/util/fetchData";
import AboutUsClient from "@/components/AboutUsClient/AboutUsClient";

// ✅ Define metadata directly for SEO (Next.js 15)
export const metadata = {
  title: "About Satlaa - Buy Premium Silver Fashion Jewellery Online at Affordable Price.",
  keywords: "About Satlaa, Online Silver Jewelry, Silver Jewelry Inquiry, Jewelry Support, Customer Feedback, Silver Jewelry Shopping, Satlaa Customer Service",
  description: "Get in touch with us for inquiries, support or feedback. At Satlaa, we value our customer's experience and are here to assist you with your silver jewelry needs.",
};

const AboutUs = async () => {
  // ✅ Fetch data on the server
  //const data = await fetchData(dispatch); // No need for dispatch here

  return <AboutUsClient/>;
};

export default AboutUs;