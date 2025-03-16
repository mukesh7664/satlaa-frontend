"use client";

import { useState } from "react";
import { Button, Drawer, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { MdExpandMore } from "react-icons/md";
import parse from "html-react-parser";
import ProductCard from "@/myapp/components/ProductCard";
import SkeletonProductCard from "@/myapp/components/ProductCard/skeleton";
import SortProducts from "@/myapp/components/FilterProducts/SortProducts";
import FilterSelectedTop from "@/myapp/components/FilterProducts/FilterSelectedTop";
import InfiniteScroll from "react-infinite-scroll-component";
import { API_URL } from "@/config";
import axiosInstance from "@/util/axios";

const CollectionClient = ({ collectionData, collection }) => {
  const axios = axiosInstance();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(collectionData.products || []);
  const [hasMore, setHasMore] = useState(collectionData.pagination.hasMorePages || false);
  const [visible, setVisible] = useState(false);

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
    <>
      <div className="fixed bottom-0 left-0 z-10 w-full flex flex-row bg-white">
        <Button variant="contained" color="primary" className="w-full md:hidden" onClick={() => setVisible(true)}>
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
          loader={<div className="col-span-4"><SkeletonProductCard /></div>}
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
              <AccordionSummary expandIcon={<MdExpandMore />}>{faq.question}</AccordionSummary>
              <AccordionDetails><p>{faq.answer}</p></AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}

      <Drawer anchor="left" open={visible} onClose={() => setVisible(false)}>
        <div className="p-4">Filter Options Here</div>
      </Drawer>
    </>
  );
};

export default CollectionClient;