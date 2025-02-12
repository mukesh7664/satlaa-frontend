import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  ListItemText,
} from "@mui/material";
import { BiChevronDown } from "react-icons/bi";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { useMediaQuery } from "react-responsive";

const Page = () => {
  const { subcategory } = useSelector(({ subcategory }) => subcategory);
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [state, setState] = useState({
    subcategory: [],
    selectedSubcategory: filterProducts.subcategory || [],
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (subcategory.length > 0) {
      const formattedSubcategories = subcategory.map((subcat) => ({
        label: subcat.title,
        value: subcat.seo,
      }));
      setState((prev) => ({
        ...prev,
        subcategory: formattedSubcategories,
        selectedSubcategory: filterProducts.subcategory || [],
      }));
    }
  }, [subcategory, filterProducts.subcategory]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelection = (value) => {
    setState((prev) => {
      const updatedSubcategory = prev.selectedSubcategory.includes(value)
        ? prev.selectedSubcategory.filter((tag) => tag !== value)
        : [...prev.selectedSubcategory, value];

      dispatch(productsApi.util.resetApiState());
      dispatch(filterProducts_r({ ...filterProducts, subcategory: updatedSubcategory, page: 1 }));
      filterRouteLinkGenerate({ ...filterProducts, subcategory: updatedSubcategory, page: 1 });

      return { ...prev, selectedSubcategory: updatedSubcategory };
    });
  };

  return (
    <div>
      {isMobile ? (
        <div className="flex flex-col">
          {state.subcategory.map((subcat) => (
            <FormControlLabel
              key={subcat.value}
              control={
                <Checkbox
                  checked={state.selectedSubcategory.includes(subcat.value)}
                  onChange={() => handleSelection(subcat.value)}
                />
              }
              label={subcat.label}
            />
          ))}
        </div>
      ) : (
        <>
          <Button
            onClick={handleClick}
            variant="contained"
            endIcon={<BiChevronDown />}
            className="w-full bg-white text-black px-2 text-[12px]"
            sx={{border: "1px solid black", boxShadow: "none", ":hover" : {borderColor: "#4690ff", color: '#4690ff', boxShadow: "none"}}}
          >
            Sub Category
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            keepMounted
          >
            {state.subcategory.map((tag) => (
              <MenuItem key={tag.value} onClick={(e) => e.stopPropagation()} sx={{ padding: "1px 29px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.selectedSubcategory.includes(tag.value)}
                      onChange={() => handleSelection(tag.value)}
                      sx={{
                        transform: "scale(1)", // Reduce checkbox size
                        "& .MuiSvgIcon-root": { fontSize: 16 }, // Smaller checkbox icon
                      }}
                    />
                  }
                  label={<ListItemText primary={tag.label} sx={{ fontSize: "10px" }} />}
                />
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </div>
  );
};

export default Page;