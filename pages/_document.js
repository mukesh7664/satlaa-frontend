import Document, { Head, Html, Main, NextScript } from "next/document";
import Image from "next/image";
import Script from "next/script";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
      
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />

        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#e26f83" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
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
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
