import { CMS_URL } from "../../../config";
import { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "@/util/strapi-fetch-api";
import { wrapper } from "@/redux/store";
import { fetchData } from "@/util/fetchData";
import Loader from "@/components/Blogs/Loader";
import PostList from "@/components/Blogs/PostList";
import PageHeader from "@/components/Blogs/PageHeader";
import Head from "@/myapp/core/Head";
export default function Profile() {
    const [meta, setMeta] = useState();
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
                    authorsBio: {
                        populate: "*",
                    },
                },
                pagination: {
                    start: start,
                    limit: limit,
                },
            };
            const options = { headers: { Authorization: `Bearer ${token}` } };
            const responseData = await fetchAPI(path, urlParamsObject, options);

            if (start === 0) {
                setData(responseData.data);
            } else {
                setData(prevData => [...prevData, ...responseData.data]);
            }

            setMeta(responseData.meta);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    function loadMorePosts() {
        const nextPosts = meta.pagination.start + meta.pagination.limit;
        fetchData(nextPosts, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
    }

    useEffect(() => {
        fetchData(0, Number(process.env.NEXT_PUBLIC_PAGE_LIMIT));
    }, [fetchData]);

    if (isLoading) return <Loader />;

    return (
        <div>
               <Head
        title='Satlaa Blogs'
        description=''
        keywords=''
        image=''
      />
            <PageHeader heading="Our Blogs" text="Checkout Something Cool" />
            <PostList data={data}>
                {meta.pagination.start + meta.pagination.limit <
                    meta.pagination.total && (
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="px-6 py-3 text-sm rounded-lg hover:underline dark:bg-gray-900 dark:text-gray-400"
                            onClick={loadMorePosts}
                        >
                            Load more posts...
                        </button>
                    </div>
                )}
            </PostList>
        </div>
    );
}
export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async () => {
      await fetchData(store.dispatch);
  
      return {
        props: {},
      };
    }
  );
