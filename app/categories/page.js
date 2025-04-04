import CategoriesList from "@/components/categories/list";
import { API_URL } from "@/config";

// ✅ Fetch data on the server (if required)
async function fetchCategoriesData() {
  try {
    // Your actual fetch logic will go here
    const response = await fetch(`${API_URL}/categories/list`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {};
  }
}

// ✅ SEO Metadata (Replaces <Head>)
export async function generateMetadata() {
  return {
    title: "Categories",
    description: "Browse different categories available on our platform.",
  };
}

// ✅ Server Component Page
export default async function CategoriesPage() {
  const data = await fetchCategoriesData(); // Now we're using the returned data

  return (
    <div className="container-custom h-full">
      <p className="text-3xl w-full font-bold font-Montserrat mt-2 text-center">Categories</p>
      <div className="bg-white">
        <CategoriesList categoriesData={data} />
      </div>
    </div>
  );
}