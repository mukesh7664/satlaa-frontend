// app/collections/page.js
import Head from "../../myapp/core/Head";
import ClientCollections from "./ClientCollections"; // Import client component
import { API_URL } from "@/config";

async function getCollectionsData() {
  try {
    console.log("Fetching collections from:", `${API_URL}/collections`);
    const response = await fetch(`${API_URL}/collections`);

    if (!response.ok) {
      const errorText = await response.text();
      //console.error("Error fetching collections:", response.status, response.statusText, errorText);
      return { collections: [] }; // Return empty data instead of throwing an error
    }

    return await response.json();
  } catch (error) {
    console.error("Network error:", error);
    return { collections: [] }; // Prevent crashes
  }
}


const Collections = async () => {
  const collectionsData = await getCollectionsData();

  return (
    <div className="container-custom h-full">
      <Head title="Collections" />
      <div className="bg-white">
        <ClientCollections collectionsData={collectionsData} />
      </div>
    </div>
  );
};

export default Collections;