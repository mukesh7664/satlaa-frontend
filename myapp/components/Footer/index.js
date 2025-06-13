"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import { IMG_URL } from "../../../config";
import Image from "next/legacy/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPinterest, FaYoutube, FaAmazon } from "react-icons/fa6";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { SiFlipkart, SiMyntra, SiEtsy } from "react-icons/si";

const Default = ({ footerMenu }) => {
  const { settings: siteSettings } = useSelector((state) => state.settings);

  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://www.facebook.com/satlaa.jewel/", label: "Facebook" },
    { icon: <FaYoutube />, href: "https://www.youtube.com/@satlaa", label: "YouTube" },
    { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/company/satlaa", label: "LinkedIn" },
    { icon: <FaInstagram />, href: "https://www.instagram.com/satlaa.in/", label: "Instagram" },
    { icon: <FaTwitter />, href: "https://x.com/SatlaaOnline", label: "Twitter" },
    { icon: <FaPinterest />, href: "https://in.pinterest.com/satlaajewellery/", label: "Pinterest" },
  ];

  const partnerLinks = [
    { icon: <FaAmazon className="text-xl" />, href: "https://www.amazon.com", label: "Amazon" },
    { icon: <SiFlipkart className="text-xl" />, href: "https://www.flipkart.com", label: "Flipkart" },
    { icon: <SiEtsy className="text-xl" />, href: "https://www.etsy.com", label: "Etsy" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-200">
          {/* Logo and Description */}
          <div className="md:col-span-4 col-span-12 flex flex-col gap-6 pl-0">
            <div className="flex flex-col gap-2 ml-0">
                <div className="ml-0">
                  <Image
                    src="https://api.satlaa.com/images/uploads/custom/logo.png"
                    className="h-auto w-40"
                    width="160"
                    height="56"
                    alt="Logo"
                  />
                </div>
                <p className="text-gray-900 text-lg font-semibold ml-0">{siteSettings?.company}</p>
                <p className="text-gray-600 font-medium text-sm ml-0">BIS- HM/C-8690392312</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Discover the Premium Silver Jewelry at SATLAA, where luxury becomes accessible and affordability is our promise. 
                Seamlessly blending high-end craftsmanship with contemporary fashion, our collections are a tribute to India's rich jewelry-making heritage.
              </p>              
            <div>
                <Image
                  src="/images/razorpay.png"
                  className="h-auto w-60"
                  width="240"
                  height="76"
                  alt="razorpay payment"
                />
            </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-8 col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Company Links */}
              <div>
                <h3 className="text-gray-900 font-semibold text-lg mb-4">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/about-us" className="text-gray-600 hover:text-gray-900 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/blogs" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Blogs
                    </Link>
                  </li>
                  <li>
                    <Link href="/warranty" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Warranty
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact-us" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/certificates" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Certificates
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Policies */}
              <div>
                <h3 className="text-gray-900 font-semibold text-lg mb-4">Policies</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/shipping-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Shipping Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/cancellation-return-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Returns & Refunds
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-gray-900 font-semibold text-lg mb-4">Contact</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <HiOutlineLocationMarker className="text-gray-600 text-xl flex-shrink-0 mt-1" />
                    <span className="text-gray-600">Satlaa Jewel, Sangaria Bypass, Jodhpur (342013)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <HiOutlinePhone className="text-gray-600 text-xl" />
                    <a href="tel:+918239418128" className="text-gray-600 hover:text-gray-900 transition-colors">
                      +91 82394 18128
                    </a>
                  </li>
                  <li className="flex items-center space-x-3">
                    <HiOutlinePhone className="text-gray-600 text-xl" />
                    <a href="tel:+919257120925" className="text-gray-600 hover:text-gray-900 transition-colors">
                      +91 92571 20925
                    </a>
                  </li>
                  <li className="flex items-center space-x-3">
                    <HiOutlineMail className="text-gray-600 text-xl" />
                    <a href="mailto:support@satlaa.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                      support@satlaa.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>

            {/* Partners */}
            <div className="flex items-center space-x-6">
              {partnerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} {siteSettings?.company}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Default;