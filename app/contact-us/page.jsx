"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "@/config";

export async function generateMetadata() {
  return {
    title: "Contact Satlaa - Buy Premium Silver Fashion Jewellery Online at Affordable Price.",
    description:
      "Get in touch with us for inquiries, support or feedback. At Satlaa, we value our customer's experience and are here to assist you with your silver jewelry needs.",
    keywords:
      "Contact Satlaa, Online Silver Jewelry, Silver Jewelry Inquiry, Jewelry Support, Customer Feedback, Silver Jewelry Shopping, Satlaa Customer Service",
  };
}

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    email: "",
    phone_no: "",
    user_message: "",
  });
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      toast.error("Please verify the CAPTCHA.");
      return;
    }

    setIsSubmitting(true);
    const jsonData = JSON.stringify({
      ...formData,
      captchaValue,
    });

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        body: jsonData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Error in sending message");
      } else {
        setFormData({
          first_name: "",
          email: "",
          phone_no: "",
          user_message: "",
        });
        setCaptchaValue(null);
        toast.success("Message sent successfully");
      }
    } catch (error) {
      toast.error("Error in sending message");
    }
    setIsSubmitting(false);
  };

  const handleCaptchaChange = (value) => setCaptchaValue(value);

  const handleChange = (e) =>
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  return (
    <div className="container-custom text-center items-center pb-14">
      <ToastContainer />
      <div className="text-center">
        <h1 className="mt-4 mx-auto font-Merriweather text-4xl border-primary border-b-4 w-auto inline-block align-middle mb-4">
          Get In Touch
        </h1>
        <section className="flex flex-wrap lg:mx-6">
          <div className="w-full md:w-1/2 text-left">
            <div className="mx-2 lg:m-6 rounded lg:mx-4 p-4 lg:p-8 mb-10 shadow-lg">
              <h1 className="font-Merriweather text-center text-3xl text-secondary">Reach Us</h1>
              <h2 className="text-primary text-xl font-Montserrat font-bold pt-2">Address</h2>
              <a href="https://maps.app.goo.gl/ppBAwFGyc73yLYaDA" className="text-lg underline">
                Satlaa Jewel, Sangaria Bypass, Jodhpur (342013)
              </a>
              <h2 className="text-primary text-xl font-Montserrat font-bold pt-3">Email</h2>
              <a href="mailto:support@satlaa.com" className="text-lg underline">
                Support@satlaa.com
              </a>
              <h2 className="text-primary text-xl font-Montserrat font-bold pt-5">Phone</h2>
              <a href="tel:+919257120925" className="text-lg underline">
                +91 9257120925
              </a>
              <h2 className="text-primary text-xl font-Montserrat font-bold pt-5">WhatsApp</h2>
              <a
                rel="noopener"
                target="_blank"
                href="https://api.whatsapp.com/send?phone=919257120925&text=Hi"
                className="text-lg underline"
              >
                +91 9257120925
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mx-2 lg:m-6 rounded lg:mx-4 p-4 lg:p-8 lg:mt-6 shadow-lg">
              <h1 className="font-Merriweather text-3xl text-secondary">CONTACT US</h1>
              <p>We will be in touch with you soon.</p>
              <form onSubmit={handleSubmit} className="row">
                <div>
                  <input
                    className="w-full border text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                    type="text"
                    name="first_name"
                    placeholder="Name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    className="w-full border text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    className="w-full border text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                    type="number"
                    name="phone_no"
                    placeholder="Phone Number"
                    value={formData.phone_no}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <textarea
                    className="w-full h-24 border text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                    name="user_message"
                    placeholder="How can we help?"
                    value={formData.user_message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div>
                  <ReCAPTCHA
                    sitekey="6Lfb9McoAAAAAEYGZDIWeicKjMZYir5OUKogP9XP" // Replace with your actual Site Key
                    onChange={handleCaptchaChange}
                  />
                </div>
                <div>
                  <input
                    className="mt-4 uppercase h-16 text-sm font-bold tracking-wide bg-primary text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline transition duration-300 hover:bg-red"
                    type="submit"
                    value={isSubmitting ? "Sending..." : "Send Message"}
                    disabled={isSubmitting}
                  />
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}