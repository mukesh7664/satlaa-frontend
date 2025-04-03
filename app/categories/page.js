import CategoriesList from "@/components/categories/list";

// ✅ Fetch data on the server (if required)
async function fetchCategoriesData() {
  try {
    // Your data-fetching logic here (if needed)
    return {};
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
  await fetchCategoriesData(); // Optional: Fetch data before rendering

  return (
    <div className="container-custom h-full">
      <p className="text-3xl w-full font-bold font-Montserrat mt-2 text-center">Categories</p>
      <div className="bg-white">
        <CategoriesList />
      </div>
    </div>
  );
}