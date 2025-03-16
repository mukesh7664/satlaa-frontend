// components/FilterProducts/StyleFilter.js 

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
  const { styles } = useSelector(({ styles }) => styles);
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [state, setState] = useState({
    styles: [],
    selectedStyles: filterProducts.styles || [],
  });

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const formattedStyles = styles.map((style) => ({
      label: style.title,
      value: style.seo,
    }));
    setState((prev) => ({
      ...prev,
      styles: formattedStyles,
      selectedStyles: filterProducts.styles || [],
    }));
  }, [styles, filterProducts.styles]);

  const handleSelection = (value) => {
    const updatedStyles = state.selectedStyles.includes(value)
      ? state.selectedStyles.filter((tag) => tag !== value)
      : [...state.selectedStyles, value];

    // Update local state first
    setState((prev) => ({ ...prev, selectedStyles: updatedStyles }));

    // Dispatch Redux actions separately
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, styles: updatedStyles, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, styles: updatedStyles, page: 1 });
  };

  return (
    <div>
      {isMobile ? (
        <div className="flex flex-col">
          {state.styles.map((subcat) => (
            <FormControlLabel
              key={subcat.value}
              control={
                <Checkbox
                  checked={state.selectedStyles.includes(subcat.value)}
                  onChange={() => handleSelection(subcat.value)}
                />
              }
              label={subcat.label}
            />
          ))}
        </div>
      ) : (
        <div
          onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
          onMouseLeave={() => setAnchorEl(null)}
        >
          <Button
            variant="contained"
            endIcon={<BiChevronDown />}
            className="w-full bg-white text-black px-2 py-1 text-[12px]"
            sx={{
              border: "1px solid black",
              boxShadow: "none",
              ":hover": {
                borderColor: "#4690ff",
                color: "#4690ff",
                boxShadow: "none",
              },
            }}
          >
            Styles
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            keepMounted
            MenuListProps={{
              onMouseLeave: () => setAnchorEl(null),
            }}
          >
            {state.styles.map((tag) => (
              <MenuItem key={tag.value} sx={{ padding: "1px 29px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.selectedStyles.includes(tag.value)}
                      onChange={() => handleSelection(tag.value)}
                      sx={{
                        transform: "scale(1)",
                        "& .MuiSvgIcon-root": { fontSize: 16 },
                      }}
                    />
                  }
                  label={<ListItemText primary={tag.label} sx={{ fontSize: "10px" }} />}
                />
              </MenuItem>
            ))}
          </Menu>
        </div>
      )}
    </div>
  );
};

export default Page;