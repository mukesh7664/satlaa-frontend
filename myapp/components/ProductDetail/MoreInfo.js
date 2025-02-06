import { Divider } from 'antd'
import React from 'react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

const MoreInfo = ({path}) => {
  return (
   <>
     <div className="flex mt-2 flex-col gap-y-2">
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://api.whatsapp.com/send?phone=919257120925&text=I%20want%20to%20know%20about%20https://satlaa.com${path}`}
          className="flex items-center justify-center border px-4 py-2 text-base rounded bg-[#25D366] text-white hover:text-[#25D366] hover:bg-white transition duration-100"
        >
          <FaWhatsapp className="text-lg mr-2" /> Chat for More Info
        </a>{" "}
        <p>
          Or call us on{" "}
          <a className="underline text-blue-500" href={`tel:+919257120925`}>
            +91 925-7120-925
          </a>
        </p>
      </div>
      <Divider />

      <div className="flex">
        <p>Join 120K+ Insta Community </p>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://instagram.com/satlaa.in`}
          className=" text-base rounded ml-2 flex items-center justify-center text-primary underline"
        >
          <FaInstagram className="text-lg mr-1 " /> SATLAA.in
        </a>
      </div></>
  )
}

export default MoreInfo