import { API_URL } from "@/config";
import axios from "axios";

export async function fetchCategoryData(category) {
  try {
    const filterProducts = {
      tags: [],
      colors: [],
      subcategory: [],
      styles: [],
      categories: [],
      text: "",
      variants: [],
      minPrice: null,
      maxPrice: null,
      sort: "",
      perPage: 10,
      page: 1,
      category,
    };

    const response = await axios.post(`${API_URL}/productspublic/${category}`, filterProducts);

    return {
      categoryData: response.data.category || {},
      productData: {
        products: response.data.products || [],
        pagination: response.data.pagination || {},
      },
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return { categoryData: null, productData: null };
  }
}