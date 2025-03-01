import { useSelector } from "react-redux";
import { Divider } from "@mui/material";
import Link from "next/link";
import { IMG_URL } from "../../../config";
import Image from "next/legacy/image";
const Default = ({ footerMenu }) => {
  const { settings } = useSelector(({ settings }) => settings);

  return (
    <div className="bg-white text-black py-10">
      <Divider />
      <div className=" container-custom grid grid-cols-12 px-2">
        <div className="md:col-span-3 order-12  md:order-1  sm:py-0 py-5 col-span-12 text-black ">
          <Image
            src={
              "https://api.satlaa.com/images/uploads/custom/logo.png"
            }
            className=" w-32 h-62"
            width="128"
            height="45"
            alt="Logo"
          />
          <p className="text-black text-lg font-semibold mt-2">{settings.company}</p>
          <div className="flex flex-col mb-2">
            <p className="font-semibold">BIS- HM/C-8690392312</p>
            <p>{settings.description}</p>
          </div>
          <Image
            className="mt-5 w-full"
            src="/images/razorpay.png"
            width="305"
            height="97"
            alt="razorpay payment"
          />
        </div>

        <ul className=" grid grid-cols-2 md:grid-cols-4 col-span-12  sm:col-span-9 ml-0 sm:ml-20 order-1 md:order-5  ">
        <li className="mt-2 text-left">
          <span className="text-black text-3xl">Company</span>

          <ul>
            <li className=" my-1 sm:my-4  ">
              <Link href="/about-us" className="text-black">
                About
              </Link>
            </li>
            <li className=" my-1 sm:my-4  ">
              <a href="https://satlaa.com/blogs" className="text-black">
                Blogs
              </a>
            </li>
            <li className=" my-1 sm:my-4  ">
              <Link href="/warranty" className="text-black">
                Warranty
              </Link>
            </li>
            <li className=" my-1 sm:my-4  ">
              <Link href="/contact-us" className="text-black">
                -Contact Us
              </Link>
            </li>
            <li className=" my-1 sm:my-4  ">
              <Link href="/pages/certificates" className="text-black">
                Certificates
              </Link>
            </li>
          </ul></li>
          {footerMenu &&
            footerMenu.map((val) => (
              <li key={val.title} className="mt-2 text-left">
                {!val.children ? (
                  <Link
                    href={val.link ? val.link : "/pages/" + val.seo}
                    className="text-black text-2xl"
                  >
                    {val.title}
                  </Link>
                ) : (
                  <>
                    <span className="text-black text-3xl">{val.title}</span>

                    <ul key={val.title}>
                      {val?.children.map((val2) => (
                        <li key={val2.title} className=" my-1 sm:my-4  ">
                          {!val2.children ? (
                            <Link
                              href={
                                val2.link ? val2.link : "/pages/" + val2.seo
                              }
                              className="text-black"
                            >
                              {val2.title}
                            </Link>
                          ) : (
                            <>
                              <Link href="#" className="text-black ">
                                -{val2.title}
                              </Link>
                              <ul key={val2.title}>
                                {val2?.children.map((val3) => (
                                  <li key={val3.title}>
                                    <Link
                                      href={
                                        val3.link
                                          ? val3.link
                                          : "/pages/" + val3.seo
                                      }
                                      className="text-black "
                                    >
                                      --{val3.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
        </ul>

        <div className="  col-span-12 text-center order-10  ">
          <div className=" text-black  grid grid-cols-2 md:flex items-center flex-row justify-around   md:grid-cols-3 lg:grid-cols-6">
            {settings.address
              ? settings.address.map((val) => (
                  <div key={val.name}>
                    <h5 className="text-xl text-black mt-2">{val.name}</h5>
                    <p className="">{val.value}</p>
                  </div>
                ))
              : ""}

            {settings.phone
              ? settings.phone.map((val) => (
                  <div key={val.name}>
                    <h5 className="text-xl text-black mt-2">{val.name}</h5>
                    <a className="underline" href={`tel:${val.value}`}>
                      {val.value}
                    </a>
                  </div>
                ))
              : ""}
            {settings.email
              ? settings.email.map((val) => (
                  <div key={val.name}>
                    <h5 className="text-xl text-black mt-2">{val.name}</h5>
                    <a href={`mail:${val.value}`} className="underline">
                      {val.value}
                    </a>
                  </div>
                ))
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Default;
