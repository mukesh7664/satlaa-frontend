"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
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
      {/* Filter & Sort Buttons (Mobile & Desktop) */}
      <div className="fixed bottom-0 left-0 z-10 w-full flex flex-row bg-white border-t shadow-lg">
        <Button variant="default" className="w-full md:hidden" onClick={() => setVisible(true)}>
          Filter Products
        </Button>
        <div className="w-full md:w-6/12 p-2">
          <SortProducts />
        </div>
      </div>

      {/* Selected Filters */}
      <FilterSelectedTop category="true" />

      {/* Products List with Infinite Scroll */}
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

      {/* Collection Description */}
      <div className="px-4">
        <h1 className="mb-4 text-2xl font-bold">{collectionData.h1tag}</h1>
        {parse(collectionData.description || "")}
      </div>

      {/* FAQs Section */}
      {collectionData.faqs && (
        <div className="px-4 mt-6">
          <p className="text-lg font-bold">FAQs</p>
          <Accordion type="single" collapsible className="mt-2">
            {collectionData.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b">
                <AccordionTrigger className="flex items-center justify-between">
                  {faq.question} <ChevronDown className="w-4 h-4" />
                </AccordionTrigger>
                <AccordionContent>
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Drawer for Mobile Filters */}
      <Drawer open={visible} onClose={() => setVisible(false)}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Filter Options</h2>
          {/* Add filter options here */}
        </div>
      </Drawer>
    </>
  );
};

export default CollectionClient;