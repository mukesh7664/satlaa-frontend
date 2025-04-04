'use client'

import { CMS_URL } from "@/config";
import { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "@/util/strapi-fetch-api";
import Loader from "@/components/Blogs/Loader";
import PostList from "@/components/Blogs/PostList";
import PageHeader from "@/components/Blogs/PageHeader";
import Link from "next/link";

const Profile = () => {
  const [meta, setMeta] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchData = useCallback(async (start, limit) => {
    setLoading(true);
    try {
      const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
      const path = `/articles`;
      const urlParamsObject = {
        sort: { createdAt: "desc" },
        populate: {
          cover: { fields: ["url"] },
          category: { populate: "*" },
          authorsBio: { populate: "*" },
        },
        pagination: { start, limit },
      };
      const options = { headers: { Authorization: `Bearer ${token}` } };
      const responseData = await fetchAPI(path, urlParamsObject, options);

      setData((prevData) =>
        start === 0 ? responseData.data : [...prevData, ...responseData.data]
      );
      setMeta(responseData.meta);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(0, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
  }, [fetchData]);

  const loadMorePosts = () => {
    if (meta) {
      const nextPosts = meta.pagination.start + meta.pagination.limit;
      fetchData(nextPosts, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <PageHeader heading="Our Blogs" text="Checkout Something Cool" />
      <PostList data={data}>
        {meta &&
          meta.pagination.start + meta.pagination.limit < meta.pagination.total && (
            <div className="flex justify-center">
              <button
                type="button"
                className="px-6 py-3 text-sm rounded-lg hover:underline bg-gray-900 text-gray-400"
                onClick={loadMorePosts}
              >
                Load more posts...
              </button>
            </div>
          )}
      </PostList>
    </div>
  );
};

export default Profile;