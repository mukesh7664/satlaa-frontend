import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard";
import InfiniteScroll from "react-infinite-scroll-component";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import SkeletonProductCard from "../ProductCard/skeleton";
import { API_URL } from "../../../config";

const FilterProductArea = ({ initialData, category }) => {
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const [productData, setProductData] = useState({
    products: initialData.products ?? [],
    pagination: initialData.pagination ?? {},
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProductData(initialData);
  }, [category, initialData]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/productspublic/${category}`,
        filterProducts
      );
      setProductData({
        products: response.data.products,
        pagination: response.data.pagination,
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [category, filterProducts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchMoreData = useCallback(async () => {
    if (productData.pagination?.hasMorePages) {
      const nextPage = productData.pagination.current_page + 1;
      try {
        const response = await axios.post(`${API_URL}/productspublic/${category}`, {
          ...filterProducts,
          page: nextPage,
        });
        setProductData((prevData) => ({
          products: [...prevData.products, ...response.data.products],
          pagination: response.data.pagination,
        }));
      } catch (error) {
        console.error("Failed to fetch more products:", error);
      }
    }
  }, [productData.pagination, filterProducts, category]);

  const generateSkeletons = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <div
        key={`skeleton-${index}`}
        className="xl:col-span-3 lg:col-span-4 col-span-6 group overflow-hidden pb-0"
      >
        <SkeletonProductCard />
      </div>
    ));
  };

  return (
    <div className="container">
      <InfiniteScroll
        dataLength={productData.products.length}
        scrollThreshold="0.5"
        next={fetchMoreData}
        hasMore={productData.pagination?.hasMorePages}
        loader={<div className="col-span-12">{generateSkeletons(1)}</div>}
        className="grid grid-cols-12 pb-16"
      >
        {productData.products.map((data, i) => (
          <ProductCard
            key={data._id ? `${data._id}-${i}` : `product-${i}`}
            data={data}
            category={category}
            className="xl:col-span-3 lg:col-span-4 border col-span-6 m-2 md:m-3 bg-gray-100 group overflow-hidden pb-0"
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default FilterProductArea;