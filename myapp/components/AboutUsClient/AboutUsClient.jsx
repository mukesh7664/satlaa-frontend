"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaGem, FaUserFriends, FaHandHoldingHeart, FaMedal } from "react-icons/fa";

const AboutUsClient = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-secondary text-black py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Crafting Timeless Beauty</h1>
            <p className="text-xl md:text-2xl opacity-90">
              At Satlaa, we transform premium silver into exquisite pieces of wearable art,
              making luxury accessible to everyone.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow">
              <FaGem className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Finest silver craftsmanship with meticulous attention to detail</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow">
              <FaHandHoldingHeart className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-gray-600">Dedicated to providing exceptional service and support</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow">
              <FaUserFriends className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p className="text-gray-600">Skilled artisans with years of jewelry crafting experience</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow">
              <FaMedal className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Certified Quality</h3>
              <p className="text-gray-600">Every piece certified for authenticity and quality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Founded with a passion for crafting beautiful silver jewelry, Satlaa has grown into a trusted name
              in the industry. Our journey began with a simple mission: to make premium silver jewelry accessible
              to everyone without compromising on quality or design. Today, we continue to push boundaries in
              jewelry craftsmanship while maintaining our commitment to authenticity and excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Unique Designs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Commitment Section */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Commitment to Quality</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-4">
                At Satlaa, we believe in delivering nothing but the best to our customers. Every piece of jewelry
                we create goes through rigorous quality checks and is certified for authenticity. Our commitment
                to excellence extends beyond our products to every aspect of your shopping experience.
              </p>
              <p className="mb-4">
                We take pride in our craft and stand behind every piece we create. Our jewelry is not just
                an accessory; it's a statement of elegance and quality that we guarantee will exceed your
                expectations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <div className="max-w-xl mx-auto">
            <p className="text-gray-600 mb-6">
              Have questions? We're here to help! Reach out to our customer support team.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="mailto:support@satlaa.com"
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Email Us
              </Link>
              <Link 
                href="tel:+918239418128"
                className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Call Us
              </Link>
            </div>
            <p className="mt-6 text-gray-500">
              Email: support@satlaa.com<br />
              Phone: +91 8239418128<br />
              Address: Satlaa Jewel, Sangaria Bypass, Jodhpur (342013)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsClient;