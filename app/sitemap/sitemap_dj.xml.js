import axiosInstance from "@/util/axios";

export async function GET() {
  try {
    const axios = axiosInstance();
    const response = await axios.get("https://satlaa.com/dj/api/sitemap");

    return new Response(response.data, {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Error fetching sitemap:", error);
    return new Response("<error>Unable to fetch sitemap</error>", {
      headers: {
        "Content-Type": "text/xml",
      },
      status: 500,
    });
  }
}