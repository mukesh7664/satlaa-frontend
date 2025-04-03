import PageHeader from "@/components/Blogs/PageHeader";
import { fetchAPI } from "@/util/strapi-fetch-api";
import PostList from "@/components/Blogs/PostList";

// ✅ Fetch posts from Strapi based on category (Runs on Server)
const fetchPostsByCategory = async (category) => {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const urlParamsObject = {
      sort: { createdAt: "desc" },
      filters: { category: { slug: category } },
      populate: {
        cover: { fields: ["url"] },
        category: { populate: "*" },
        authorsBio: { populate: "*" },
      },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const responseData = await fetchAPI(path, urlParamsObject, options);
    return responseData;
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return { data: [] };
  }
};

// ✅ Dynamic Metadata for SEO
export async function generateMetadata({ params }) {
  const category = params.category;
  const { data } = await fetchPostsByCategory(category);

  if (!data || data.length === 0) {
    return { title: "Category Not Found", description: "No posts available in this category." };
  }

  const { name, description } = data[0].attributes.category.data.attributes;
  return { title: name, description };
}

// ✅ Category Page Component (Server Component)
export default async function CategoryRoute({ params }) {
  const category = params.category;
  const { data } = await fetchPostsByCategory(category);

  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-gray-500">No Posts In This Category</div>;
  }

  const { name, description } = data[0].attributes.category.data.attributes;

  return (
    <div>
      <PageHeader heading={name} text={description} />
      <PostList data={data} />
    </div>
  );
}