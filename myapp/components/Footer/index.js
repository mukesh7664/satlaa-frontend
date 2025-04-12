import { useSelector } from "react-redux";
import Link from "next/link";
import { IMG_URL } from "../../../config";
import Image from "next/legacy/image";

const Default = ({ footerMenu }) => {
  const { settings } = useSelector(({ settings }) => settings);

  return (
    <div className="bg-white text-black py-10">
      <hr className="border-t border-gray-300 mb-8" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-3 col-span-12 text-center md:text-left">
            <Image
              src="https://api.satlaa.com/images/uploads/custom/logo.png"
              className="w-32 h-auto mx-auto md:mx-0"
              width="128"
              height="45"
              alt="Logo"
            />
            <p className="text-black text-lg font-semibold mt-4">{settings.company}</p>
            <div className="mt-4">
              <p className="font-semibold text-sm">BIS- HM/C-8690392312</p>
              <p className="text-sm mt-2 leading-relaxed">
                Discover the Premium Silver Jewelry at SATLAA, where luxury becomes accessible and affordability is our promise. Seamlessly blending high-end craftsmanship with contemporary fashion, our collections are a tribute to India's rich jewelry-making heritage.
              </p>
            </div>
            <Image
              className="mt-0"
              src="/images/razorpay.png"
              width="305"
              height="97"
              alt="razorpay payment"
            />
          </div>

          {/* Footer Links */}
          <div className="md:col-span-9 col-span-12">
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <li>
                <span className="text-black text-xl font-bold">Company</span>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/about-us" className="text-black hover:underline">About</Link>
                  </li>
                  <li>
                    <a href="https://satlaa.com/blogs" className="text-black hover:underline">Blogs</a>
                  </li>
                  <li>
                    <Link href="/warranty" className="text-black hover:underline">Warranty</Link>
                  </li>
                  <li>
                    <Link href="/contact-us" className="text-black hover:underline">Contact Us</Link>
                  </li>
                  <li>
                    <Link href="/pages/certificates" className="text-black hover:underline">Certificates</Link>
                  </li>
                </ul>
              </li>
              <li>
                <span className="text-black text-xl font-bold">Policies</span>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/shipping-policy" className="text-black hover:underline">Shipping Policy</Link>
                  </li>
                  <li>
                    <Link href="/cancellation-return-policy" className="text-black hover:underline">Cancellation & Return Policy</Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="text-black hover:underline">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions" className="text-black hover:underline">Terms & Conditions</Link>
                  </li>
                </ul>
              </li>
              <li>
                <span className="text-black text-xl font-bold">Partners</span>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="https://www.amazon.com" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">Amazon</a>
                  </li>
                  <li>
                    <a href="https://www.flipkart.com" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">Flipkart</a>
                  </li>
                  <li>
                    <a href="https://www.meesho.com" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">Meesho</a>
                  </li>
                  <li>
                    <a href="https://www.myntra.com" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">Myntra</a>
                  </li>
                  <li>
                    <a href="https://www.etsy.com" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">Etsy</a>
                  </li>
                </ul>
              </li>
              <li>
                <span className="text-black text-xl font-bold">Social Media</span>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="https://www.facebook.com/satlaa.jewel/" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">Facebook</a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/@satlaa" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">YouTube</a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/satlaa" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/satlaa.in/" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">Instagram</a>
                  </li>
                  <li>
                    <a href="https://x.com/SatlaaOnline" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">Twitter</a>
                  </li>
                  <li>
                    <a href="https://in.pinterest.com/satlaajewellery/" className="text-black hover:underline" target="_blank" rel="noopener noreferrer">Pinterest</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Contact Information Section */}
        <div className="mt-10 pt-6 border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center md:text-left">
              <h5 className="text-black text-lg font-semibold mb-2">Our Address</h5>
              <p className="text-sm">Satlaa Jewel, Sangaria Bypass, Jodhpur(342013)</p>
            </div>
            <div className="text-center md:text-left">
              <h5 className="text-black text-lg font-semibold mb-2">Contact Phone</h5>
              <a href="tel:+918239418128" className="text-sm text-black hover:underline">+918239418128</a>
            </div>
            <div className="text-center md:text-left">
              <h5 className="text-black text-lg font-semibold mb-2">Support Phone</h5>
              <a href="tel:+919257120925" className="text-sm text-black hover:underline">+919257120925</a>
            </div>
            <div className="text-center md:text-left">
              <h5 className="text-black text-lg font-semibold mb-2">Support Mail</h5>
              <a href="mailto:support@satlaa.com" className="text-sm text-black hover:underline">support@satlaa.com</a>
            </div>
            <div className="text-center md:text-left">
              <h5 className="text-black text-lg font-semibold mb-2">Contact Mail</h5>
              <a href="mailto:care@satlaa.com" className="text-sm text-black hover:underline">care@satlaa.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Default;