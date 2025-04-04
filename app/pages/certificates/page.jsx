

import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import NextJsImage from "@/myapp/components/Helper/FancyBox";

const certificates = [
  { title: "Startup India Certificate", img: "startup", link: "https://www.startupindia.gov.in/content/sih/en/startupgov/validate-startup-recognition.html" },
  { title: "Company Incorporation Certificate", img: "COI", link: "https://www.thecompanycheck.com/company/satlaa-jewel-private-limited/U32111RJ2023PTC088373" },
  { title: "GST Certificate", img: "GST", link: "https://services.gst.gov.in/services/searchtp" },
  { title: "BIS Hallmark Certificate", img: "BIS", link: "https://www.manakonline.in/MANAK/login" },
  { title: "Import Export Code", img: "IEC", link: "https://www.dgft.gov.in/CP/web?requestType=ApplicationRH&actionVal=service&screen=viewIec&screenId=9000012354&entityName=QUJMQ1MxNDcyTX5TQVRMQUEgSkVXRUwgUFJJVkFURSBMSU1JVEVE" },
  { title: "UDHYAM(MSME) Certificate", img: "UDHYAM", link: "https://udyamregistration.gov.in/Udyam_Verify.aspx" },
];

const Certificate = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = (imageSrc) => {
    setSelectedImage(imageSrc);
    setLightboxOpen(true);
  };

  return (
    <div className="flex flex-col justify-center items-center container-custom gap-y-3 px-2">
      <p className="text-3xl font-bold font-Montserrat mt-4">
        Our Documents & Certificates
      </p>
      <div className="flex flex-wrap justify-center">
        {certificates.map((cert, i) => (
          <div key={i} className="w-full sm:w-1/2 md:w-1/4 p-5 text-center">
            <p className="text-xl font-semibold mb-2">{cert.title}</p>
            <Image
              className="object-cover rounded-lg cursor-pointer"
              height={400}
              width={600}
              quality={100}
              alt={cert.title}
              src={`/images/cert/${cert.img}.jpg`}
              onClick={() => openLightbox(`/images/cert/${cert.img}.jpg`)}
            />
            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 underline">
              Click to Verify
            </a>
          </div>
        ))}
      </div>
      {selectedImage && (
        <Lightbox
          open={lightboxOpen}
          plugins={[Zoom, Download]}
          close={() => setLightboxOpen(false)}
          slides={certificates.map((image) => ({
            src: `/images/cert/${image.img}.jpg`,
            width: 500,
            height: 500,
          }))}
          initialSlide={certificates.findIndex(
            (img) => `/images/cert/${img.img}.jpg` === selectedImage
          )}
          render={{ slide: (props) => <NextJsImage {...props} /> }}
        />
      )}
    </div>
  );
};

export default Certificate;