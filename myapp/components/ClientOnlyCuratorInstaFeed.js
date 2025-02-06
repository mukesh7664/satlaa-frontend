import { useEffect } from "react";

const ClientOnlyCuratorFeed = () => {
  useEffect(() => {
    const script = document.createElement("script");

    script.async = true;
    script.charset = "UTF-8";
    script.src =
      "https://cdn.curator.io/published/610d1d24-e88f-47b7-8c70-bd2b57a32141.js";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div className="flex flex-col w-full justify-center items-center container-custom gap-y-3 px-2">
      <p className="text-3xl font-bold font-Montserrat mt-8">
        Our Insta Feed
      </p>
      <p className="">
        Dive into our vibrant Instagram feed to see the latest masterpieces from
        our workshop and the joy they bring to our cherished customers. Follow us for daily
        doses of sparkle and inspiration.
      </p>
      <div id="curator-feed-default-feed-layout"></div>
    </div>
  );
};

export default ClientOnlyCuratorFeed;
