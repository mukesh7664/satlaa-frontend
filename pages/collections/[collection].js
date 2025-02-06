import { useCallback, useState } from "react";
import { Drawer, Collapse } from "antd";

import { FilterOutlined } from "@ant-design/icons";
import parse from "html-react-parser";
import ProductCard from "@/myapp/components/ProductCard";

import { filterProducts as filterProducts_r } from "@/redux/reducers/FilterProducts";
const { Panel } = Collapse;
import { wrapper } from "@/redux/store";
import { getRunningQueriesThunk, getProducts } from "@/redux/api/productsApi";

import { useRouter } from "next/router";
import FilterSelectedTop from "@/myapp/components/FilterProducts/FilterSelectedTop";
import { API_URL, IMG_URL } from "../../../config";
import authservice from "@/util/services/authservice";
import { cartFetch } from "@/redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";

import Head from "@/myapp/core/Head";
import TagsFilter from "@/myapp/components/FilterProducts/TagsFilter";
import PriceFilter from "@/myapp/components/FilterProducts/PriceFilter";
import SubCategoryFilter from "@/myapp/components/FilterProducts/SubCategoryFilter";
import ColorFilter from "@/myapp/components/FilterProducts/ColorFilter";
import StyleFilter from "@/myapp/components/FilterProducts/StyleFilter";
import FilterProductArea from "@/myapp/components/FilterProducts/FilterProductArea";
import SortProducts from "@/myapp/components/FilterProducts/SortProducts";
import Image from "next/image";
import { fetchData } from "@/util/fetchData";
import Breadcrumbs from "@/myapp/components/Utils/BreadCrumbs";
import { FaMinus, FaPlus } from "react-icons/fa";
import SkeletonProductCard from "../../myapp/components/ProductCard/skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
const CustomExpandIcon = ({ isActive }) =>
  isActive ? <FaMinus /> : <FaPlus />;
const Collection = ({ collectionData = [] }) => {
  const router = useRouter();
  const collection = router.query.collection;
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(collectionData.products || []);
  const [hasMore, setHasMore] = useState(
    collectionData.pagination.hasMorePages || false
  );

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const replaceStyle = (dataHtml) => {
    return dataHtml;
    // .replaceAll(
    //   "<pre>",
    //   "<pre  style='min-height:30px; background-color:#dbdbdb; padding:15px' >"
    // )
    // .replaceAll("<img ", "<img class='w-full sm:w-auto' ")
    // .replaceAll(
    //   '<div class="media-wrap image-wrap ',
    //   '<div class="media-wrap image-wrap  w-full sm:w-auto '
    // );
  };
  const generateSkeletons = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className="xl:col-span-3 lg:col-span-4 col-span-6 group overflow-hidden pb-0"
      >
        <SkeletonProductCard />
      </div>
    ));
  };

  const fetchMoreData = async () => {
    const nextPage = currentPage + 1;
    try {
      const { data } = await axios.get(
        `${API_URL}/collectionspublic/${collection}?page=${nextPage}&limit=8`
      );

      setProducts((prevProducts) => [...prevProducts, ...data.products]);
      setHasMore(data.pagination.hasMorePages);
      setCurrentPage(nextPage); // Update the current page.
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <div className="w-full">
      {collectionData.collection.banner_mobile && (
        <Image
          src={
            collectionData.collection.banner_mobile
              ? `${IMG_URL + collectionData.collection.banner_mobile}`
              : "/images/nofoto.jpg"
          }
          height="500"
          width="1680"
          className="w-full block md:hidden"
          priority="true"
          style={{ width: "100%" }}
          alt={
            collectionData.collection.seo_title
              ? collectionData.collection.seo_title
              : "Default Title"
          }
        />
      )}
      {collectionData.collection.banner_web && (
        <Image
          src={
            collectionData.collection.banner_web
              ? `${IMG_URL + collectionData.collection.banner_web}`
              : "/images/nofoto.jpg"
          }
          height="500"
          width="1680"
          className="w-full md:block hidden"
          priority="true"
          style={{ width: "100%" }}
          alt={
            collectionData.collection.seo_title
              ? collectionData.collection.seo_title
              : "Default Title"
          }
        />
      )}

      <div className="flex flex-col h-full my-2 py-2 md:px-16 container">
        <Head
          title={collectionData.collection.seo_title}
          description={collectionData.collection.short_description}
          canonical={`https://satlaa.com/collections/${collection}`}
          image={collectionData.collection.image}
        />

        <div className="ml-2 md:ml-4">
          <Breadcrumbs
            items={[
              {
                path: "/",
                title: "Home",
              },
              {
                path: `/collections`,
                title: "Collections",
              },

              {
                title: collection,
              },
            ]}
          />
        </div>

        <div className=" md:col-span-10 col-span-12">
          <div className=" fixed bottom-0 left-0 z-10 w-full flex flex-row bg-white">
            <div className="w-full">
              <button
                className="items-center py-2 w-full z-10 bg-white border rounded-sm p-0.3 text-base block md:hidden font-bold"
                onClick={showDrawer}
              >
                Filter By <FilterOutlined />
              </button>
            </div>
            <div className="w-full md:w-6/12 z-12 md:hidden">
              <SortProducts />
            </div>
          </div>

          <div className="w-full float-left pb-0">
            <FilterSelectedTop category="true" />
          </div>
          <div className="w-full mt-3 float-left">
            <div className="container">
              <InfiniteScroll
                dataLength={products.length}
                scrollThreshold="0.5"
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <div className="col-span-4">{generateSkeletons(1)}</div>
                }
                className="grid grid-cols-12 pb-16"
              >
                {products &&
                  products.map((data, i) => (
                    <ProductCard
                      key={i}
                      data={data}
                      className=" xl:col-span-3 lg:col-span-4 border col-span-6 m-2 md:m-3  bg-gray-100  group  overflow-hidden pb-0"
                    />
                  ))}
              </InfiniteScroll>
            </div>
          </div>

          <div className="px-4">
            <h1 className="mb-4 text-2xl">{collectionData.h1tag}</h1>
            {parse(replaceStyle(collectionData.description || ""))}
          </div>
          {collectionData.faqs && (
            <div className="px-4 mt-4">
              <p className="text-lg font-bold">FAQs</p>
              <Collapse
                expandIconPosition="start"
                ghost
                expandIcon={({ isActive }) => (
                  <CustomExpandIcon isActive={isActive} />
                )}
                bordered={false}
              >
                {/* <Panel className="text-2xl font" header="Offers on Sale" key="1">
          <div className="text-base"></div>
        </Panel> */}
                {collectionData.faqs.map((faq, i) => {
                  return (
                    <Panel className="" header={faq.question} key={i}>
                      <p>{faq.answer}</p>
                    </Panel>
                  );
                })}
              </Collapse>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
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

    for await (const [key, value] of Object.entries(query)) {
      const arr = '["' + value.replaceAll(",", '","') + '"]';
      urlToRedux[key] = JSON.parse(arr);
    }

    const { filterProducts } = store.getState().filterProducts;
    await store.dispatch(
      filterProducts_r({
        ...filterProducts,
        ...urlToRedux,
        page: 1,
        perPage: 8,
      })
    );
    await Promise.all(store.dispatch(getRunningQueriesThunk()));
    const { data } = await axios.get(
      `${API_URL}/collectionspublic/${collection}`
    );

    // const { data } = await store.dispatch(
    //   getProducts.initiate({
    //     category: category,
    //     filter: finalFilter.payload,
    //   })

    return {
      props: {
        initialData: null,
        collectionData: data,
      },
    };
  }
);

export default Collection;
