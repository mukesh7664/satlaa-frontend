import { useSelector, useDispatch } from "react-redux";
import { Tag } from "@mui/material";
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

  const changeTagsClose = (removedTag) => {
    const tags = filterProducts.tags.filter((tag) => tag !== removedTag);
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, tags: tags, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, tags: tags, page: 1 });
  };
  const changeColorsClose = (removedTag) => {
    const tags = filterProducts.colors.filter((tag) => tag !== removedTag);
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, colors: tags, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, colors: tags, page: 1 });
  };
  const changeStylesClose = (removedTag) => {
    const tags = filterProducts.styles.filter((tag) => tag !== removedTag);
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, styles: tags, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, styles: tags, page: 1 });
  };
  const changeSubCategoryClose = (removedTag) => {
    const tags = filterProducts.subcategory.filter((tag) => tag !== removedTag);
    dispatch(productsApi.util.resetApiState());
    dispatch(
      filterProducts_r({ ...filterProducts, subcategory: tags, page: 1 })
    );
    filterRouteLinkGenerate({ ...filterProducts, subcategory: tags, page: 1 });
  };

  const changeCategoriesClose = (removedTag) => {
    const tags = filterProducts.categories.filter((tag) => tag !== removedTag);
    dispatch(productsApi.util.resetApiState());
    dispatch(
      filterProducts_r({ ...filterProducts, categories: tags, page: 1 })
    );
    filterRouteLinkGenerate({ ...filterProducts, categories: tags, page: 1 });
  };

  const changeMinPriceClose = () => {
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, minPrice: null, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, minPrice: null, page: 1 });
  };

  const changeMaxPriceClose = () => {
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, maxPrice: null, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, maxPrice: null, page: 1 });
  };

  const changeTextClose = () => {
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, text: "", page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, text: "", page: 1 });
  };

  return (
    <div className=" flex flex-wrap gap-y-2 ">
      {filterProducts.text != "" ? (
        <span key="text" style={{ display: "inline-block" }}>
          <Tag
            closeIcon={<FiX className="text-base" />}
            className="text-black py-1 px-2 flex items-center justify-center "
            closable
            onClose={(e) => {
              e.preventDefault();
              changeTextClose();
            }}
          >
            Text: {filterProducts.text}
          </Tag>
        </span>
      ) : (
        ""
      )}

      {filterProducts.tags.map((val) => (
        <span className="pl-1 py-1" key={val} style={{ display: "inline-block" }}>
          <Tag
            closeIcon={<FiX className="text-base" />}
            className="text-black py-1 px-2 flex items-center justify-center bg-gray-100"
            closable
            onClose={(e) => {
              e.preventDefault();
              changeTagsClose(val);
            }}
          >
            {tags.find((find) => find.seo == val).title}
          </Tag>
        </span>
      ))}
      {filterProducts.colors.map((val) => (
        <span className="pl-1 py-1" key={val} style={{ display: "inline-block" }}>
          <Tag
            closeIcon={<FiX className="text-base" />}
            className="text-black py-1 px-2 flex items-center justify-center bg-gray-100"
            closable
            onClose={(e) => {
              e.preventDefault();
              changeColorsClose(val);
            }}
          >
            {colors.find((find) => find.seo == val).title}
          </Tag>
        </span>
      ))}
      {filterProducts.styles.map((val) => (
        <span className="pl-1 py-1" key={val} style={{ display: "inline-block" }}>
          <Tag
            closeIcon={<FiX className="text-base" />}
            className="text-black py-1 px-2 flex items-center justify-center bg-gray-100"
            closable
            onClose={(e) => {
              e.preventDefault();
              changeStylesClose(val);
            }}
          >
            {styles.find((find) => find.seo == val).title}
          </Tag>
        </span>
      ))}
      {filterProducts.subcategory.map((val) => (
        <span className="pl-1 py-1" key={val} style={{ display: "inline-block" }}>
          <Tag
            closeIcon={<FiX className="text-base" />}
            className="text-black py-1 px-2 flex items-center justify-center bg-gray-100"
            closable
            onClose={(e) => {
              e.preventDefault();
              changeSubCategoryClose(val);
            }}
          >
            {subcategory.find((find) => find.seo == val).title}
          </Tag>
        </span>
      ))}

      {filterProducts.minPrice > 0 ? (
        <span key="minprice" style={{ display: "inline-block" }}>
          <Tag
            closeIcon={<FiX className="text-base" />}
            className="text-black py-1 px-2 flex items-center justify-center bg-gray-100"
            closable
            onClose={(e) => {
              e.preventDefault();
              changeMinPriceClose();
            }}
          >
            Min Price: {filterProducts.minPrice}
          </Tag>
        </span>
      ) : (
        ""
      )}
      {filterProducts.maxPrice > 0 ? (
        <span key="maxprice" style={{ display: "inline-block" }}>
          <Tag
            closeIcon={<FiX className="text-base" />}
            className="text-black py-1 px-2 flex items-center justify-center bg-gray-100"
            closable
            onClose={(e) => {
              e.preventDefault();
              changeMaxPriceClose();
            }}
          >
            Max Price: {filterProducts.maxPrice}
          </Tag>
        </span>
      ) : (
        ""
      )}

      {!category &&
        filterProducts.categories.map((val) => (
          <span className="pl-1 py-1" key={val} style={{ display: "inline-block" }}>
            <Tag
              closeIcon={<FiX className="text-base" />}
              className="text-black py-1 px-2 flex items-center justify-center bg-gray-100"
              closable
              onClose={(e) => {
                e.preventDefault();
                changeCategoriesClose(val);
              }}
            >
              {categories.find((find) => find.seo == val).title}
            </Tag>
          </span>
        ))}
    </div>
  );
};

export default Page;
