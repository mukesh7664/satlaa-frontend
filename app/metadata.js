export const metadata = {
    title: "SATLAA Jewellery",
    description: "Premium Jewellery Store",
    icons: {
      icon: [
        { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "SATLAA Jewellery",
        url: "https://satlaa.com",
        logo: "https://satlaa.com/_next/image?url=https%3A%2F%2Fapi.satlaa.com%2Fimages%2Fuploads%2Flogo%2F1693052064906.png&w=256&q=75",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+919257120925",
          contactType: "Customer Service",
        },
        sameAs: [
          "https://www.facebook.com/satlaa.in",
          "https://www.instagram.com/satlaa.in",
          "https://www.twitter.com/SatlaaJewellery",
          "https://www.pinterest.com/satlaaonline",
          "https://www.linkedin.com/company/satlaa",
        ],
      }),
    },
  };
  
  // ✅ Move themeColor here instead of metadata
  export const viewport = {
    themeColor: "#e26f83",
  };