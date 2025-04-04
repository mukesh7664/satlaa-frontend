"use client";

import Image from "next/image";

const Startup = () => {
  return (
    <div className="flex flex-col justify-center items-center container-custom gap-y-4 px-4 text-center">
      <p className="text-3xl font-bold font-Montserrat">
        Proudly Certified by Government Of India
      </p>
      <p className="max-w-3xl text-lg leading-relaxed">
        We are thrilled to announce that we have been recognized and certified
        by Start-Up India, a flagship initiative of the Government of India.
        This certification reflects our commitment to providing high-quality,
        authentic silver jewelry while contributing to the Indian economy.
        Explore our certified collection and experience the excellence and
        craftsmanship we bring to every piece.
      </p>
      <Image
        className="object-cover rounded-lg shadow-lg"
        height={400}
        width={600}
        quality={100}
        alt="Startup India Certificate"
        src="/images/startup_cert.png"
      />
      <p>
        You can verify the certificate{" "}
        <a
          className="underline text-blue-600 hover:text-blue-800"
          href="https://www.startupindia.gov.in/content/sih/en/startupgov/validate-startup-recognition.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Click Here
        </a>
      </p>
      <p>
        Official Website download link{" "}
        <a
          className="underline text-blue-600 hover:text-blue-800"
          href="https://recognition-be.startupindia.gov.in/s3/download/document/RECOGNITION_CERTIFICATE/c7420775-79ed-4d8f-b4a9-c368245890aa.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Click Here
        </a>
      </p>
    </div>
  );
};

export default Startup;