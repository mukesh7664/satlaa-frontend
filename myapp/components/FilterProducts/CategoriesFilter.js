import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, MenuItem, Button, Checkbox, FormControlLabel, ListItemText } from "@mui/material";
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
    anchorEl: null,
  });

  useEffect(() => {
    if (categories) {
      const formattedCategories = categories.map((cat) => ({
        label: cat.title,
        value: cat.seo,
      }));
      setState((prevState) => ({ ...prevState, categories: formattedCategories }));
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
        <div onMouseLeave={handleMenuClose}>
          <Button
            className="flex items-center justify-between px-3 py-1 border text-black shadow-sm text-[12px]"
            onMouseEnter={handleMenuOpen}
            sx={{ border: "1px solid black", boxShadow: "none", ":hover": { borderColor: "#4690ff", color: "#4690ff", boxShadow: "none" } }}
          >
            <span>Categories</span>
            <BiChevronDown className="ml-1 text-lg" />
          </Button>

          <Menu
            anchorEl={state.anchorEl}
            open={Boolean(state.anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{ onMouseLeave: handleMenuClose }}
            PaperProps={{
              sx: {
                maxHeight: 200, // Reduced size of the dropdown list
                width: 180, // Adjust width to fit content neatly
              },
            }}
          >
            {state.categories.map((category) => (
              <MenuItem key={category.value} onClick={(e) => e.stopPropagation()} sx={{ padding: "1px 29px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.selectedCategories.includes(category.value)}
                      onChange={handleCheckboxChange}
                      value={category.value}
                      sx={{
                        transform: "scale(1)",
                        "& .MuiSvgIcon-root": { fontSize: 16 },
                      }}
                    />
                  }
                  label={<ListItemText primary={category.label} sx={{ fontSize: "10px" }} />}
                />
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </>
  );
};

export default Page;