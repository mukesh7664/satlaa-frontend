export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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
  </sitemapindex>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}