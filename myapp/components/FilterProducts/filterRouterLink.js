import router from "next/router";

const filterRouteLinkGenerate = (filterProducts, search) => {
  const currentPath = router.asPath.split("?")[0];
  const urlTags =
    filterProducts.tags.length > 0 ? `&tags=${filterProducts.tags}` : "";
  const urlColors =
    filterProducts.colors.length > 0 ? `&colors=${filterProducts.colors}` : "";
  const urlStyle =
    filterProducts.styles.length > 0 ? `&styles=${filterProducts.styles}` : "";
  const urlSubCategory =
    filterProducts.subcategory.length > 0
      ? `&subCategory=${filterProducts.subcategory}`
      : "";

  const urlMinPrice =
    filterProducts.minPrice > 0 ? `&minprice=${filterProducts.minPrice}` : "";
  const urlMaxPrice =
    filterProducts.maxPrice > 0 ? `&maxprice=${filterProducts.maxPrice}` : "";
  const urlText =
    filterProducts.text != "" ? `&text=${filterProducts.text}` : "";

  let totalUrl =
    urlText +
    urlTags +
    urlColors +
    urlStyle +
    urlSubCategory +
    urlMinPrice +
    urlMaxPrice;

  const urlCategory =
    filterProducts.categories.length > 0
      ? `&categories=${filterProducts.categories}`
      : "";
  if (urlCategory) {
    totalUrl = urlCategory + totalUrl;
  }

  router.push({}, `${currentPath}?${totalUrl}`, { shallow: true });
};

export default filterRouteLinkGenerate;