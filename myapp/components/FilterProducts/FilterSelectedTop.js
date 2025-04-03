import { useSelector, useDispatch } from "react-redux";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import filterRouteLinkGenerate from "./filterRouterLink";
import { productsApi } from "../../../redux/api/productsApi";
import { Badge } from "@/components/ui/badge";
import { IoMdClose } from "react-icons/io";

const Page = ({ category }) => {
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const { tags } = useSelector(({ tags }) => tags);
  const { colors } = useSelector(({ colors }) => colors);
  const { styles } = useSelector(({ styles }) => styles);
  const { subcategory } = useSelector(({ subcategory }) => subcategory);
  const { categories } = useSelector(({ categories }) => categories);
  const dispatch = useDispatch();

  const handleClose = (type, removedTag) => {
    const updatedTags = filterProducts[type].filter((tag) => tag !== removedTag);
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, [type]: updatedTags, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, [type]: updatedTags, page: 1 });
  };

  const handlePriceClose = (type) => {
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, [type]: null, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, [type]: null, page: 1 });
  };

  const handleTextClose = () => {
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, text: "", page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, text: "", page: 1 });
  };

  const renderBadge = (key, label, onDelete) => (
    <Badge key={key} variant="outline" className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-black border-gray-300">
      {label}
      <button onClick={onDelete} className="text-gray-500 hover:text-black">
        <IoMdClose className="w-4 h-4" />
      </button>
    </Badge>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {filterProducts.text && renderBadge("text-filter", `Text: ${filterProducts.text}`, handleTextClose)}

      {filterProducts.tags.map((val) =>
        renderBadge(
          `tag-${val}`,
          tags.find((find) => find.seo === val)?.title,
          () => handleClose("tags", val)
        )
      )}

      {filterProducts.colors.map((val) =>
        renderBadge(
          `color-${val}`,
          colors.find((find) => find.seo === val)?.title,
          () => handleClose("colors", val)
        )
      )}

      {filterProducts.styles.map((val) =>
        renderBadge(
          `style-${val}`,
          styles.find((find) => find.seo === val)?.title,
          () => handleClose("styles", val)
        )
      )}

      {filterProducts.subcategory.map((val) =>
        renderBadge(
          `subcategory-${val}`,
          subcategory.find((find) => find.seo === val)?.title,
          () => handleClose("subcategory", val)
        )
      )}

      {filterProducts.minPrice > 0 &&
        renderBadge(`min-price-${filterProducts.minPrice}`, `Min Price: ${filterProducts.minPrice}`, () => handlePriceClose("minPrice"))}

      {filterProducts.maxPrice > 0 &&
        renderBadge(`max-price-${filterProducts.maxPrice}`, `Max Price: ${filterProducts.maxPrice}`, () => handlePriceClose("maxPrice"))}

      {!category &&
        filterProducts.categories.map((val) =>
          renderBadge(
            `category-${val}`,
            categories.find((find) => find.seo === val)?.title,
            () => handleClose("categories", val)
          )
        )}
    </div>
  );
};

export default Page;