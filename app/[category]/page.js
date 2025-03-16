import Category from "@/myapp/components/Category/Category"; // Client Component
import { fetchCategoryData } from "@/util/fetchCategory";

export default async function CategoryPage({ params }) {
  const { category } = await params;

  // Fetch data on the server
  const { categoryData, productData } = await fetchCategoryData(category);

  if (!categoryData) {
    return <p>Category not found</p>;
  }

  return <Category category={category} categoryData={categoryData} productData={productData} />;
}