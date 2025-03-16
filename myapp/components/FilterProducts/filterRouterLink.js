"use client";

const filterRouteLinkGenerate = (filterProducts = {}) => {
  if (typeof window === "undefined" || !filterProducts) return; // Ensure it runs only on the client

  const currentPath = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);

  // Update query parameters dynamically
  if (filterProducts.text) urlParams.set("text", filterProducts.text);
  if (filterProducts.tags?.length > 0) urlParams.set("tags", filterProducts.tags.join(","));
  if (filterProducts.colors?.length > 0) urlParams.set("colors", filterProducts.colors.join(","));
  if (filterProducts.styles?.length > 0) urlParams.set("styles", filterProducts.styles.join(","));
  if (filterProducts.subcategory?.length > 0) urlParams.set("subCategory", filterProducts.subcategory.join(","));
  if (filterProducts.minPrice) urlParams.set("minprice", filterProducts.minPrice);
  if (filterProducts.maxPrice) urlParams.set("maxprice", filterProducts.maxPrice);
  if (filterProducts.categories?.length > 0) urlParams.set("categories", filterProducts.categories.join(","));

  const queryString = urlParams.toString();
  const newUrl = queryString ? `${currentPath}?${queryString}` : currentPath;

  // Update URL without reloading the page
  window.history.pushState(null, "", newUrl);
};

export default filterRouteLinkGenerate;