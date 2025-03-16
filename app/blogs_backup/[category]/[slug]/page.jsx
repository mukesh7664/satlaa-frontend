import { fetchAPI } from "@/util/strapi-fetch-api";
import Post from "@/components/Blogs/Post";

// ✅ Fetch a single post by slug (Runs on the server)
async function getPostBySlug(slug) {
  try {
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
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// ✅ Fetch metadata for SEO (Runs on the server)
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: "Post Not Found", description: "No post available." };
  }
  return {
    title: post.attributes.title,
    description: post.attributes.description,
    openGraph: {
      images: post.attributes.shareImage
        ? [{ url: post.attributes.shareImage }]
        : [],
    },
  };
}

// ✅ Blog Post Page (Server Component)
export default async function PostRoute({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return <h2 className="text-center py-10 text-gray-500">No post found</h2>;

  return (
    <div>
      <Post data={post} />
    </div>
  );
}

// ✅ Pre-generates static paths at build time
export async function generateStaticParams() {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/articles`;
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const articleResponse = await fetchAPI(path, { populate: ["category"] }, options);

    return articleResponse.data.map((article) => ({
      slug: article.attributes.slug,
    }));
  } catch (error) {
    console.error("Error generating static paths:", error);
    return [];
  }
}