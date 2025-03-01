import Image from "next/image";
import React, { useState } from "react";
import { wrapper } from "@/redux/store";
import { fetchData } from "@/util/fetchData";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import NextJsImage from "@/myapp/components/Helper/FancyBox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import Head from "../../myapp/core/Head";
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
      <Head
        title="All Certificates of SATLAA"
        description="Check the SATLAA certificate obtained by Government of India"
      
        image="https://api.satlaa.com/images/uploads/custom/startup_cert.png"
      />
      <p className="text-3xl font-bold font-Montserrat mt-4">
        Our Documents & Certificates
      </p>
      <div className="flex flex-wrap ">
        {certificates.map((cert, i) => (
          <div key={i} className="w:1/2 md:w-1/4 p-5">
            <p className="text-2xl font-semibold">{cert.title}</p>
            <Image
              className="object-cover rounded-lg"
              height={400}
              width={600}
              quality={100}
              alt={cert.title}
              src={`/images/cert/${cert.img}.jpg`}
              onClick={() => openLightbox(`/images/cert/${cert.img}.jpg`)}
            />
            <a href={cert.link} className="underline">Click to Verify</a>
          </div>
        ))}
      </div>
      {selectedImage && (
        <Lightbox
          open={lightboxOpen}
          zoom={true}
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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await fetchData(store.dispatch);

    return {
      props: {},
    };
  }
);

export default Certificate;
