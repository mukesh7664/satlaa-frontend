import { useSelector, useDispatch } from "react-redux";
import Chip from "@mui/material/Chip";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";

import filterRouteLinkGenerate from "./filterRouterLink";
import { productsApi } from "../../../redux/api/productsApi";
import { FiX } from "react-icons/fi";

const Page = ({ category }) => {
  const { filterProducts } = useSelector(
    ({ filterProducts }) => filterProducts
  );
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

  const renderChip = (label, onDelete) => (
    <Chip
      label={label}
      onDelete={onDelete}
      color="default"
      className="m-1"
      sx={{
        backgroundColor: "#f0f0f0",
        color: "black",
        border: "1px solid #ccc",
        height: "25px",
        "& .MuiChip-deleteIcon": {
          color: "rgba(1, 0, 0, 0.6)",
          "&:hover": {
            color: "rgba(0, 0, 0, 0.9)",
          }
        }
      }}
    />
  );

  return (
    <div className="flex flex-wrap gap-2">
      {filterProducts.text && renderChip(`Text: ${filterProducts.text}`, handleTextClose)}

      {filterProducts.tags.map((val) =>
        renderChip(
          tags.find((find) => find.seo === val)?.title,
          () => handleClose("tags", val)
        )
      )}

      {filterProducts.colors.map((val) =>
        renderChip(
          colors.find((find) => find.seo === val)?.title,
          () => handleClose("colors", val)
        )
      )}

      {filterProducts.styles.map((val) =>
        renderChip(
          styles.find((find) => find.seo === val)?.title,
          () => handleClose("styles", val)
        )
      )}

      {filterProducts.subcategory.map((val) =>
        renderChip(
          subcategory.find((find) => find.seo === val)?.title,
          () => handleClose("subcategory", val)
        )
      )}

      {filterProducts.minPrice > 0 &&
        renderChip(`Min Price: ${filterProducts.minPrice}`, () => handlePriceClose("minPrice"))}

      {filterProducts.maxPrice > 0 &&
        renderChip(`Max Price: ${filterProducts.maxPrice}`, () => handlePriceClose("maxPrice"))}

      {!category &&
        filterProducts.categories.map((val) =>
          renderChip(
            categories.find((find) => find.seo === val)?.title,
            () => handleClose("categories", val)
          )
        )}
    </div>
  );
};

export default Page;