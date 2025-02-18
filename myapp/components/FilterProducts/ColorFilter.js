import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, MenuItem, Button, Checkbox, FormControlLabel, ListItemText } from "@mui/material";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { BiChevronDown } from "react-icons/bi";

const Page = ({ isMobile }) => {
  const { colors } = useSelector(({ colors }) => colors);
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    colors: [],
    selectedColors: filterProducts.colors || [],
    anchorEl: null,
  });

  useEffect(() => {
    if (colors) {
      const formattedColors = colors.map((color) => ({
        label: color.title,
        value: color.seo,
      }));
      setState((prevState) => ({ ...prevState, colors: formattedColors }));
    }
  }, [colors]);

  useEffect(() => {
    setState((prevState) => ({ ...prevState, selectedColors: filterProducts.colors || [] }));
  }, [filterProducts.colors]);

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    setState((prevState) => {
      const updatedColors = checked
        ? [...prevState.selectedColors, value]
        : prevState.selectedColors.filter((color) => color !== value);

      dispatch(productsApi.util.resetApiState());
      dispatch(filterProducts_r({ ...filterProducts, colors: updatedColors, page: 1 }));
      filterRouteLinkGenerate({ ...filterProducts, colors: updatedColors, page: 1 });

      return { ...prevState, selectedColors: updatedColors };
    });
  };

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col">
          {state.colors.map((color) => (
            <FormControlLabel
              key={color.value}
              control={
                <Checkbox
                  checked={state.selectedColors.includes(color.value)}
                  onChange={handleCheckboxChange}
                  value={color.value}
                />
              }
              label={color.label}
            />
          ))}
        </div>
      ) : (
        <div
          onMouseEnter={(e) => setState((prev) => ({ ...prev, anchorEl: e.currentTarget }))}
          onMouseLeave={() => setState((prev) => ({ ...prev, anchorEl: null }))}
        >
          <Button
            className="flex items-center justify-between px-2 py-1 border text-black shadow-sm text-[12px]"
            sx={{ border: "1px solid black", boxShadow: "none", ":hover": { borderColor: "#4690ff", color: '#4690ff' } }}
          >
            <span>Colors</span>
            <BiChevronDown className="ml-1 text-lg" />
          </Button>

          <Menu
            anchorEl={state.anchorEl}
            open={Boolean(state.anchorEl)}
            onClose={() => setState((prev) => ({ ...prev, anchorEl: null }))}
            MenuListProps={{
              onMouseLeave: () => setState((prev) => ({ ...prev, anchorEl: null })),
            }}
          >
            {state.colors.map((color) => (
              <MenuItem key={color.value} onClick={(e) => e.stopPropagation()} sx={{ padding: "1px 12px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.selectedColors.includes(color.value)}
                      onChange={handleCheckboxChange}
                      value={color.value}
                      sx={{
                        transform: "scale(1)",
                        "& .MuiSvgIcon-root": { fontSize: 16 },
                      }}
                    />
                  }
                  label={<ListItemText primary={color.label} sx={{ fontSize: "10px" }} />}
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