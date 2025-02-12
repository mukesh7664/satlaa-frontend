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
  const open = Boolean(anchorEl);

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelection = (value) => {
    setState((prev) => {
      const updatedStyles = prev.selectedStyles.includes(value)
        ? prev.selectedStyles.filter((tag) => tag !== value)
        : [...prev.selectedStyles, value];

      dispatch(productsApi.util.resetApiState());
      dispatch(filterProducts_r({ ...filterProducts, styles: updatedStyles, page: 1 }));
      filterRouteLinkGenerate({ ...filterProducts, styles: updatedStyles, page: 1 });

      return { ...prev, selectedStyles: updatedStyles };
    });
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
        <>
          <Button
            onClick={handleClick}
            variant="contained"
            endIcon={<BiChevronDown />}
            className="w-full bg-white text-black px-2 text-[12px]"
            sx={{border: "1px solid black", boxShadow: "none", ":hover" : {borderColor: "#4690ff", color: '#4690ff', boxShadow: "none"}}}
          >
            Styles
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            keepMounted
          >
            {state.styles.map((tag) => (
              <MenuItem key={tag.value} onClick={(e) => e.stopPropagation()} sx={{ padding: "1px 29px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.selectedStyles.includes(tag.value)}
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