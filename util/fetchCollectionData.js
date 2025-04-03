import axiosInstance from "@/util/axios";
import { API_URL } from "@/config";

export async function fetchCollectionData(collection) {
  console.log("API_URL:", API_URL); // Debugging line
  if (!API_URL) throw new Error("API_URL is undefined. Check environment variables.");

  try {
    const axios = axiosInstance();
    const { data } = await axios.get(`${API_URL}/collectionspublic/${collection}`);
    return data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return { collection: {}, products: [], pagination: { hasMorePages: false }, faqs: [] };
  }
}