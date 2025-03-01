import axiosInstance from "@/util/axios";
const axios = axiosInstance();

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const sitemap = `
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://satlaa.com/sitemap_products.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://satlaa.com/sitemap_dj.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://satlaa.com/blogs/sitemap_index.xml</loc>
      </sitemap>
    </sitemapindex>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;

