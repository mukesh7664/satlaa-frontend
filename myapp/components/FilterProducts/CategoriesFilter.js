import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown,  Button, Checkbox,  } from "@mui/material";
import filterRouteLinkGenerate from "./filterRouterLink";

import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { BiChevronDown } from "react-icons/bi";


const Page = ({ isMobile }) => {
  const { categories } = useSelector(({ categories }) => categories);
  const { filterProducts } = useSelector(
    ({ filterProducts }) => filterProducts
  );
  const [state, setState] = useState({
    categories: [],
    allData: [],
    selectedCategories: filterProducts.categories,
  });
  const dispatch = useDispatch();

  const getCategories = () => {
    const dataManipulate = [];
    for (const i in categories) {
      dataManipulate.push({
        label: categories[i].title,
        value: categories[i].seo,
      });
    }
    setState({ ...state, categories: dataManipulate, allData: dataManipulate });
  };

  useEffect(() => {
    getCategories();
    setState((prevState) => ({
      ...prevState,
      selectedCategories: filterProducts.categories,
    }));
  }, [filterProducts.categories]);

  const handleMenuClick = (e) => {
    let selectedCategories = [...state.selectedCategories];
    const categoryValue = e.target.value;

    if (selectedCategories.includes(categoryValue)) {
      selectedCategories = selectedCategories.filter(
        (category) => category !== categoryValue
      );
    } else {
      selectedCategories.push(categoryValue);
    }

    setState({ ...state, selectedCategories });
    dispatch(productsApi.util.resetApiState());
    dispatch(
      filterProducts_r({
        ...filterProducts,
        categories: selectedCategories,
        page: 1,
      })
    );
    filterRouteLinkGenerate({
      ...filterProducts,
      categories: selectedCategories,
      page: 1,
    });
  };

  const menuProps = {
    items: state.categories.map((tag) => ({
      label: (
        <Checkbox
          checked={state.selectedCategories.includes(tag.value)}
          onChange={handleMenuClick}
          value={tag.value}
        >
          {tag.label}
        </Checkbox>
      ),
      key: tag.value,
    })),
  };
  return (
    <>
      {isMobile ? (
        // Mobile layout

        <div className="text-base flex flex-col">
          {state.categories.map((subcat) => (
            <div key={subcat.value}>
              <Checkbox
                checked={state.selectedCategories.includes(subcat.value)}
                onChange={handleMenuClick}
                value={subcat.value}
                style={{ borderRadius: "0px", fontSize: "15px" }}
              >
                {subcat.label}
              </Checkbox>
            </div>
          ))}
       
        </div>
      ) : (
        <Dropdown menu={menuProps} trigger={["click","hover"]}>
          <Button
            className="flex items-center justify-between px-3 py-2 border border-gray-300 bg-white shadow-sm"
            onClick={(e) => e.preventDefault()}
          >
            <span>Categories</span>
            <BiChevronDown className="ml-1 text-lg"/>
          </Button>
        </Dropdown>
      )}
    </>
  );
};

export default Page;
