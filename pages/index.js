import func from "../util/helpers/func";
import { wrapper } from "../redux/store";
import { API_URL } from "../../config";
import Head from "../myapp/core/Head";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import authservice from "../util/services/authservice";
import axiosInstance from "../util/axios";
import dynamic from "next/dynamic";
import { cartFetch } from "../redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "../redux/reducers/Login";

import HomeProductsFirst from "../myapp/components/Home/HomeProductsFirst";
import Categories from "../myapp/components/Tags";
import HomeSlider from "../myapp/components/Home/HomeSlider";
import Features from "../myapp/components/Home/Features";
import { fetchData } from "../util/fetchData";

const ClientOnlyCuratorFeed = dynamic(
  () => import("../myapp/components/ClientOnlyCuratorInstaFeed"),
  {
    ssr: false, // This will load the component only on client-side
  }
);
const Banners = dynamic(() => import("../myapp/components/Home/Banners"), {
  ssr: false, // This will load the component only on client-side
});
const HomeFirstBox = dynamic(
  () => import("../myapp/components/Home/HomeFirstBox"),
  {
    ssr: false, // This will load the component only on client-side
  }
);
const HomeSeccoundBoxs = dynamic(
  () => import("../myapp/components/Home/HomeSeccoundBoxs"),
  {
    ssr: false, // This will load the component only on client-side
  }
);
const HomeOfferList = dynamic(
  () => import("../myapp/components/Home/HomeOfferList"),
  {
    ssr: false, // This will load the component only on client-side
  }
);
const ColorSlider = dynamic(
  () => import("../myapp/components/Home/ColorSlider"),
  {
    ssr: false, // This will load the component only on client-side
  }
);

const homePage = ({
  resData = [],
  resProductFirst = [],
  // resProductPopular = [],
  resProductSeccond = [],
}) => {
  const homeSlider = func.getCategoriesTree(
    resData,
    "61535837020a748d51968ecc"
  );
  const colorSlider = func.getCategoriesTree(
    resData,
    "653fc9ef97d0b304b71eaab8"
  );
  const homeFirstBox = func.getCategoriesTree(
    resData,
    "61537c2d6464c09286494c63"
  );
  const homeOfferList = func.getCategoriesTree(
    resData,
    "6154640f79053f941d1b76c9"
  );
  const startup = resData.find((e) => e._id === "653fcb2f97d0b304b71eabc9");
  const homeOfferListtitle = {
    title: resData.filter((val) => val._id === "6154640f79053f941d1b76c9")
      ?.title,
    description: resData.filter((val) => val._id === "6154640f79053f941d1b76c9")
      ?.description,
  };

  const structuredData = {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "SATLAA Jewellery",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://satlaa.com/search?text={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    url: "https://satlaa.com",
  };
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Head />
      <div className="flex flex-col-reverse md:flex-col ">
        <HomeSlider state={homeSlider} />

        <div className="relative">
          <Categories />
        </div>
      </div>

      <Features />
      <HomeProductsFirst
        state={resProductFirst}
        title={{
          title: "Best Sellers",
        }}
      />
      <HomeFirstBox state={homeFirstBox} />

      <ColorSlider state={colorSlider} />
      <HomeSeccoundBoxs
        state={resProductSeccond}
        title={{
          title: "New Products",
          description: "We Added New Products For You",
        }}
      />
      {/* <HomeOfferList state={homeOfferList} title={homeOfferListtitle} /> */}
      <Banners state={startup} />

      <ClientOnlyCuratorFeed />
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    await fetchData(store.dispatch);
    const axios = axiosInstance(context);
    const response = await axios.get(`${API_URL}/homesliderpublic`);
    const auth = await authservice.isAuthenticated(context);

    if (auth.isAuthenticated) {
      await store.dispatch(cartFetch(auth.userCart));
      await store.dispatch(setLogin(auth.user));
      await store.dispatch(setIsAuthenticated(true));
    }
    // const filterObjectPopular = {
    //   sort: { createdAt: -1 },
    //   limit: 10,
    //   skip: 0,
    //   query: { "badges_id.$oid": "64c38289aebfc441c4398041" },
    // };

    const filterObjectFirst = {
      sort: { internal_rating: -1 },
      limit: 10,
      skip: 0,
      // query: { key: "badges_id", value: "64c3827baebfc441c439803c" },
    };
    const responseProductFirs = await axios.post(
      `${API_URL}/productspublic/home`,
      filterObjectFirst
    );

    const filterObjectSeccond = {
      sort: { createdAt: -1 },
      limit: 15,
      skip: 0,
    };

    const responseProductSeccond = await axios.post(
      `${API_URL}/productspublic/home`,
      filterObjectSeccond
    );

    return {
      props: {
        resData: response.data,
        resProductFirst: responseProductFirs.data,
        // resProductPopular: filterObjectPopular.data,
        resProductSeccond: responseProductSeccond.data,
      },
    };
  }
);

export default homePage;
