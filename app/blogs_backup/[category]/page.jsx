import PageHeader from "@/components/Blogs/PageHeader";
import { fetchAPI } from "@/util/strapi-fetch-api";
import PostList from "@/components/Blogs/PostList";
import { fetchData } from "../../../util/fetchData";
import { wrapper } from "@/redux/store";
const fetchPostsByCategory = async ({ filter }) => {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
      sort: { createdAt: "desc" },
      filters: {
        category: {
          slug: filter,
        },
      },
      populate: {
        cover: { fields: ["url"] },
        category: {
          populate: "*",
        },
        authorsBio: {
          populate: "*",
        },
      },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const responseData = await fetchAPI(path, urlParamsObject, options);
    return responseData;
  } catch (error) {
    console.error(error);
  }
};

function CategoryRoute({ name, description, data }) {
  if (!data || data.length === 0) return <div>No Posts In this category</div>;

  return (
    <div>
      <PageHeader heading={name} text={description} />
      <PostList data={data} />
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const filter = context.params.category;
    const { data } = await fetchPostsByCategory(filter);
    await fetchData(store.dispatch);
    if (!data || data.length === 0) {
      return {
        props: { data: [] },
      };
    }

    const { name, description } = data[0].attributes.category.data.attributes;

    return {
      props: { name, description, data },
    };
  }
);

export default CategoryRoute;
