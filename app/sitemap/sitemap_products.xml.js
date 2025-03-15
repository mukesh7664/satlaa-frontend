import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL, WEBSITE_URL } from "../../config";

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const resDataProducts = await axios.get(`${API_URL}/productspublic/all`);
  const categories = await axios.get(`${API_URL}/categories/list`);
  function escapeHtml(text) {
    var map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return (WEBSITE_URL + text.replace(/[&<>"']/g, function (m) {
      return map[m];
    }));
  }


  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">
          <url>
          <loc>https://satlaa.com/pages/about</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
          </url>
          <url>
          <loc>https://satlaa.com/pages/blogs</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
          </url>
          <url>
          <loc>https://satlaa.com/pages/warranty</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
          </url>
          <url>
          <loc>https://satlaa.com/pages/contact-us</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
          </url>

            ${resDataProducts.data
              .map((url) => {
                return `
                          <url>
                            <loc>${WEBSITE_URL}/products/${url.seo}</loc>
                            <lastmod>${new Date().toISOString()}</lastmod>
                            <changefreq>daily</changefreq>
                            <priority>1</priority>
                          </url>
                        `;
              })
              .join("")}

      ${categories.data
        .map((url) => {
          return `
                <url>
                  <loc>${WEBSITE_URL}/${url.seo}</loc>
                  <lastmod>${new Date().toISOString()}</lastmod>
                  <changefreq>daily</changefreq>
                  <priority>0.8</priority>
                </url>
              `;
        })
        .join("")}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
