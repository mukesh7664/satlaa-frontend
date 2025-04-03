import axiosInstance from "@/util/axios";
import { API_URL, WEBSITE_URL } from "@/config";

export async function GET() {
  const axios = axiosInstance();

  try {
    const resDataProducts = await axios.get(`${API_URL}/productspublic/all`);
    const categories = await axios.get(`${API_URL}/categories/list`);

    function escapeHtml(text) {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return WEBSITE_URL + text.replace(/[&<>"']/g, (m) => map[m]);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
        <url>
          <loc>${WEBSITE_URL}/pages/about</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
        </url>
        <url>
          <loc>${WEBSITE_URL}/pages/blogs</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
        </url>
        <url>
          <loc>${WEBSITE_URL}/pages/warranty</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
        </url>
        <url>
          <loc>${WEBSITE_URL}/pages/contact-us</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.5</priority>
        </url>

        ${resDataProducts.data
          .map(
            (product) => `
              <url>
                <loc>${WEBSITE_URL}/products/${escapeHtml(product.seo)}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>1.0</priority>
              </url>
            `
          )
          .join("")}

        ${categories.data
          .map(
            (category) => `
              <url>
                <loc>${WEBSITE_URL}/${escapeHtml(category.seo)}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.8</priority>
              </url>
            `
          )
          .join("")}
    </urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("<error>Unable to generate sitemap</error>", {
      headers: { "Content-Type": "text/xml" },
      status: 500,
    });
  }
}