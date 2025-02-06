import { fetchAPI } from "@/util/strapi-fetch-api";
import Post from "@/components/Blogs/Post";
import Head from "@/myapp/core/Head";
import { wrapper } from "@/redux/store";

import { fetchData } from "../../../util/fetchData";
async function getPostBySlug(slug) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const urlParamsObject = {
    filters: { slug },
    populate: {
      cover: { fields: ["url"] },
      authorsBio: { populate: "*" },
      category: { fields: ["name"] },
      blocks: { populate: "*" },
    },
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response;
}
async function getMetaData(slug) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const urlParamsObject = {
    filters: { slug },
    populate: { seo: { populate: "*" } },
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const response = await fetchAPI(path, urlParamsObject, options);
  return response.data;
}
function PostRoute({ post }) {
  if (!post) return <h2>No post found</h2>;
  return (
    <>
      <Head
        title={post.attributes.title}
        description={post.attributes.description}
        image={post.attributes.shareImage}
       
      />
      <div className="">
        <Post data={post} />
      </div>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { slug } = context.params;
    await fetchData(store.dispatch);
    const data = await getPostBySlug(slug);

    if (!data.data || data.data.length === 0) {
      return {
        props: { post: null },
      };
    }

    return {
      props: {
        post: data.data[0],
      },
    };
  }
);

export async function generateStaticPaths() {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const path = `/articles`;
  const options = { headers: { Authorization: `Bearer ${token}` } };
  const articleResponse = await fetchAPI(
    path,
    {
      populate: ["category"],
    },
    options
  );

  const paths = articleResponse.data.map((article) => ({
    params: { slug: article.attributes.slug },
  }));

  return {
    paths,
    fallback: false, // See note below
  };
}

export default PostRoute;
