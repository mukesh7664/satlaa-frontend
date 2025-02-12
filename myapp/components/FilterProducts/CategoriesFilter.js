import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, MenuItem, Button, Checkbox, FormControlLabel } from "@mui/material"; // ✅ Correct MUI imports
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { BiChevronDown } from "react-icons/bi";

const Page = ({ isMobile }) => {
  const { categories } = useSelector(({ categories }) => categories);
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    categories: [],
    selectedCategories: filterProducts.categories || [],
    anchorEl: null, // Dropdown anchor
  });

  useEffect(() => {
    if (categories) {
      const formattedCategories = categories.map((cat) => ({
        label: cat.title,
        value: cat.seo,
      }));
      setState((prevState) => ({
        ...prevState,
        categories: formattedCategories,
      }));
    }
  }, [categories]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      selectedCategories: filterProducts.categories || [],
    }));
  }, [filterProducts.categories]);

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    setState((prevState) => {
      const updatedCategories = checked
        ? [...prevState.selectedCategories, value]
        : prevState.selectedCategories.filter((category) => category !== value);

      dispatch(productsApi.util.resetApiState());
      dispatch(filterProducts_r({ ...filterProducts, categories: updatedCategories, page: 1 }));
      filterRouteLinkGenerate({ ...filterProducts, categories: updatedCategories, page: 1 });

      return { ...prevState, selectedCategories: updatedCategories };
    });
  };

  const handleMenuOpen = (event) => {
    setState((prevState) => ({ ...prevState, anchorEl: event.currentTarget }));
  };

  const handleMenuClose = () => {
    setState((prevState) => ({ ...prevState, anchorEl: null }));
  };

  return (
    <>
      {isMobile ? (
        // Mobile layout
        <div className="text-base flex flex-col">
          {state.categories.map((subcat) => (
            <FormControlLabel
              key={subcat.value}
              control={
                <Checkbox
                  checked={state.selectedCategories.includes(subcat.value)}
                  onChange={handleCheckboxChange}
                  value={subcat.value}
                />
              }
              label={subcat.label}
            />
          ))}
        </div>
      ) : (
        // Desktop layout with MUI Menu dropdown
        <>
          <Button
            className="flex items-center justify-between px-3 py-2 border text-black shadow-sm"
            onClick={handleMenuOpen}
            sx={{border: "1px solid black"}}
          >
            <span>Categories</span>
            <BiChevronDown className="ml-1 text-lg" />
          </Button>

          <Menu anchorEl={state.anchorEl} open={Boolean(state.anchorEl)} onClose={handleMenuClose}>
            {state.categories.map((category) => (
              <MenuItem key={category.value} onClick={(e) => e.stopPropagation()}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.selectedCategories.includes(category.value)}
                      onChange={handleCheckboxChange}
                      value={category.value}
                    />
                  }
                  label={category.label}
                />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </>
  );
};

export default Page;