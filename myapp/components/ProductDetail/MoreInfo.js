import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const MoreInfo = ({ path }) => {
  return (
    <>
      <div className="flex flex-col gap-3 mt-2">
        {/* WhatsApp Chat Button */}
        <Button
          asChild
          className="flex items-center gap-2 px-6 py-3 text-white bg-[#25D366] rounded-lg text-lg transition hover:bg-white hover:text-[#25D366] border border-transparent hover:border-[#25D366]"
        >
          <a
            href={`https://api.whatsapp.com/send?phone=919257120925&text=I%20want%20to%20know%20about%20https://satlaa.com${path}`}
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp />
            Chat for More Info
          </a>
        </Button>

        {/* Call Info */}
        <p className="text-lg">
          Or call us on{" "}
          <a href="tel:+919257120925" className="underline text-blue-600">
            +91 925-7120-925
          </a>
        </p>
      </div>

      <div className="border-t my-4"></div>

      {/* Instagram Community */}
      <div className="flex items-center">
        <p className="text-lg">Join 120K+ Insta Community</p>
        <Button asChild variant="link" className="ml-2 text-[#E1306C] text-lg">
          <a href="https://instagram.com/satlaa.in" target="_blank" rel="noreferrer">
            <FaInstagram />
            SATLAA.in
          </a>
        </Button>
      </div>
    </>
  );
};

export default MoreInfo;