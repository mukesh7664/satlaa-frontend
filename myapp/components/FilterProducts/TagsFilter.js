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
  const { tags } = useSelector(({ tags }) => tags);
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [state, setState] = useState({
    tags: [],
    selectedTags: [],
  });

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (tags.length > 0) {
      const formattedTags = tags.map((tag) => ({
        label: tag.title,
        value: tag.seo,
      }));

      setState((prev) => ({
        ...prev,
        tags: formattedTags,
        selectedTags: filterProducts.tags || [],
      }));
    }
  }, [tags, filterProducts.tags]);

  const handleSelection = (value) => {
    setState((prev) => {
      const updatedTags = prev.selectedTags.includes(value)
        ? prev.selectedTags.filter((tag) => tag !== value)
        : [...prev.selectedTags, value];

      dispatch(productsApi.util.resetApiState());
      dispatch(filterProducts_r({ ...filterProducts, tags: updatedTags, page: 1 }));
      filterRouteLinkGenerate({ ...filterProducts, tags: updatedTags, page: 1 });

      return { ...prev, selectedTags: updatedTags };
    });
  };

  return (
    <div>
      {isMobile ? (
        <div className="flex flex-col">
          {state.tags.map((tag) => (
            <FormControlLabel
              key={tag.value}
              control={
                <Checkbox
                  checked={state.selectedTags.includes(tag.value)}
                  onChange={() => handleSelection(tag.value)}
                  sx={{
                    transform: "scale(1)",
                    "& .MuiSvgIcon-root": { fontSize: 16 },
                  }}
                />
              }
              label={tag.label}
              sx={{ fontSize: "12px" }}
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
            className="w-full border text-black px-2 py-1 bg-white text-[12px]"
            sx={{
              border: "1px solid black",
              boxShadow: "none",
              fontSize: "12px",
              ":hover": { borderColor: "#4690ff", color: "#4690ff", boxShadow: "none" },
            }}
          >
            Tags
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            keepMounted
            sx={{
              "& .MuiPaper-root": {
                minWidth: "150px",
              },
            }}
            MenuListProps={{
              onMouseLeave: () => setAnchorEl(null),
            }}
          >
            {state.tags.length > 0 ? (
              state.tags.map((tag) => (
                <MenuItem
                  key={tag.value}
                  onClick={(e) => e.stopPropagation()}
                  sx={{ padding: "1px 12px" }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.selectedTags.includes(tag.value)}
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
              ))
            ) : (
              <MenuItem disabled sx={{ fontSize: "11px", padding: "4px 12px" }}>
                No tags available
              </MenuItem>
            )}
          </Menu>
        </div>
      )}
    </div>
  );
};

export default Page;