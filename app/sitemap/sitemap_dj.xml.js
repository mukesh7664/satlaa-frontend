import axiosInstance from "@/util/axios";
const axios = axiosInstance();

const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const djData = await axios.get("https://satlaa.com/dj/api/sitemap");

  const sitemap = djData.data;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
