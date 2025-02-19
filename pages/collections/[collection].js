import { useCallback, useState } from "react";
import { Drawer, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import { MdExpandMore } from "react-icons/md";
import parse from "html-react-parser";
import ProductCard from "@/myapp/components/ProductCard";

import { filterProducts as filterProducts_r } from "@/redux/reducers/FilterProducts";
import { wrapper } from "@/redux/store";
import { getRunningQueriesThunk, getProducts } from "@/redux/api/productsApi";

import { useRouter } from "next/router";
import FilterSelectedTop from "@/myapp/components/FilterProducts/FilterSelectedTop";
import { API_URL, IMG_URL } from "../../config";
import authservice from "@/util/services/authservice";
import { cartFetch } from "@/redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";

import Head from "@/myapp/core/Head/index.js";
import SortProducts from "@/myapp/components/FilterProducts/SortProducts";
import Image from "next/image";
import { fetchData } from "@/util/fetchData";
import Breadcrumbs from "@/myapp/components/Utils/BreadCrumbs";
import SkeletonProductCard from "../../myapp/components/ProductCard/skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import axiosInstance from "@/util/axios";

const axios = axiosInstance();

const Collection = ({ collectionData = [] }) => {
  const router = useRouter();
  const collection = router.query.collection;
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(collectionData.products || []);
  const [hasMore, setHasMore] = useState(collectionData.pagination.hasMorePages || false);
  const [visible, setVisible] = useState(false);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  const generateSkeletons = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <div key={index} className="xl:col-span-3 lg:col-span-4 col-span-6">
        <SkeletonProductCard />
      </div>
    ));
  };

  const fetchMoreData = async () => {
    const nextPage = currentPage + 1;
    try {
      const { data } = await axios.get(`${API_URL}/collectionspublic/${collection}?page=${nextPage}&limit=8`);
      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.pagination.hasMorePages);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <div className="w-full">
      {collectionData.collection.banner_mobile && (
        <Image
          src={`${IMG_URL}${collectionData.collection.banner_mobile}`}
          height={500}
          width={1680}
          className="w-full block md:hidden"
          priority
          alt={collectionData.collection.seo_title || "Default Title"}
        />
      )}
      {collectionData.collection.banner_web && (
        <Image
          src={`${IMG_URL}${collectionData.collection.banner_web}`}
          height={500}
          width={1680}
          className="w-full md:block hidden"
          priority
          alt={collectionData.collection.seo_title || "Default Title"}
        />
      )}

      <div className="flex flex-col my-2 py-2 md:px-16 container">
        <Head
          title={collectionData.collection.seo_title}
          description={collectionData.collection.short_description}
          canonical={`https://satlaa.com/collections/${collection}`}
          image={collectionData.collection.image}
        />

        <div className="ml-2 md:ml-4">
          <Breadcrumbs
            items={[
              { path: "/", title: "Home" },
              { path: "/collections", title: "Collections" },
              { title: collection },
            ]}
          />
        </div>

        <div className="fixed bottom-0 left-0 z-10 w-full flex flex-row bg-white">
          <Button
            variant="contained"
            color="primary"
            className="w-full md:hidden"
            onClick={showDrawer}
          >
            Filter Products
          </Button>
          <div className="w-full md:w-6/12">
            <SortProducts />
          </div>
        </div>

        <FilterSelectedTop category="true" />

        <div className="mt-3">
          <InfiniteScroll
            dataLength={products.length}
            scrollThreshold="0.5"
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className="col-span-4">{generateSkeletons(1)}</div>}
            className="grid grid-cols-12 pb-16"
          >
            {products.map((data, i) => (
              <ProductCard
                key={i}
                data={data}
                className="xl:col-span-3 lg:col-span-4 border col-span-6 m-2 md:m-3 bg-gray-100"
              />
            ))}
          </InfiniteScroll>
        </div>

        <div className="px-4">
          <h1 className="mb-4 text-2xl">{collectionData.h1tag}</h1>
          {parse(collectionData.description || "")}
        </div>

        {collectionData.faqs && (
          <div className="px-4 mt-4">
            <p className="text-lg font-bold">FAQs</p>
            {collectionData.faqs.map((faq, i) => (
              <Accordion key={i}>
                <AccordionSummary expandIcon={<MdExpandMore />}>
                  {faq.question}
                </AccordionSummary>
                <AccordionDetails>
                  <p>{faq.answer}</p>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        )}
      </div>

      <Drawer anchor="left" open={visible} onClose={onClose}>
        <div className="p-4">Filter Options Here</div>
      </Drawer>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
  await fetchData(store.dispatch);
  const axios = axiosInstance(context);
  const auth = await authservice.isAuthenticated(context);

  if (auth.isAuthenticated) {
    await store.dispatch(cartFetch(auth.userCart));
    await store.dispatch(setLogin(auth.user));
    await store.dispatch(setIsAuthenticated(true));
  }

  const { query } = context;
  const { collection } = query;

  const urlToRedux = {};
  for (const [key, value] of Object.entries(query)) {
    const arr = '["' + value.replaceAll(",", '","') + '"]';
    urlToRedux[key] = JSON.parse(arr);
  }

  const { filterProducts } = store.getState().filterProducts;
  await store.dispatch(filterProducts_r({ ...filterProducts, ...urlToRedux, page: 1, perPage: 8 }));
  await Promise.all(store.dispatch(getRunningQueriesThunk()));

  const { data } = await axios.get(`${API_URL}/collectionspublic/${collection}`);
  return { props: { initialData: null, collectionData: data } };
});

export default Collection;