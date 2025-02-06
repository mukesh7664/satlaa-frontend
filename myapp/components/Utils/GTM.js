import { setCookie } from "cookies-next";
import React from "react";
import TagManager from "react-gtm-module";

const GTM = ({router}) => {
  TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTAG_ID });
  const {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    fbclid,
  } = router.query;
  const utmParams = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    fbclid,
  };

  // Only set the cookie if there are UTM parameters in the URL
  if (Object.values(utmParams).some((param) => param !== undefined)) {
    setCookie("utm_params", JSON.stringify(utmParams), {
      maxAge: 7 * 24 * 60 * 60,
    }); // Expires in 7 days
  }
  return <></>;
};

export default GTM;
