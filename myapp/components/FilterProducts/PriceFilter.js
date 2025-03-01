import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Stack, TextField, Button, Popover, Divider } from "@mui/material";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { FiSearch } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";

const Page = ({ isMobile }) => {
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    minPrice: filterProducts.minPrice || "",
    maxPrice: filterProducts.maxPrice || "",
  });
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setState({
      minPrice: filterProducts.minPrice || "",
      maxPrice: filterProducts.maxPrice || "",
    });
  }, [filterProducts]);

  const handleFilter = (e) => {
    e.preventDefault();

    const updatedFilters = {
      ...filterProducts,
      minPrice: state.minPrice !== "" ? Number(state.minPrice) : undefined,
      maxPrice: state.maxPrice !== "" ? Number(state.maxPrice) : undefined,
      page: 1,
    };

    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r(updatedFilters));
    filterRouteLinkGenerate(updatedFilters);

    setAnchorEl(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value ? Number(value) : "",
    }));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isMobile ? (
        // Mobile Layout
        (<Box className="p-2 bg-white border rounded-md">
          <form onSubmit={handleFilter}>
            <Stack spacing={2}>
              <TextField
                name="minPrice"
                label="Min Price"
                type="number"
                variant="outlined"
                size="small"
                value={state.minPrice}
                onChange={handleChange}
              />
              <TextField
                name="maxPrice"
                label="Max Price"
                type="number"
                variant="outlined"
                size="small"
                value={state.maxPrice}
                onChange={handleChange}
              />
              <Button type="submit" variant="contained" startIcon={<FiSearch />}>
                Apply
              </Button>
            </Stack>
          </form>
          <Divider className="mt-2" />
        </Box>)
      ) : (
        //  Desktop Layout with Popover
        (<>
          <Button
            className="flex justify-center items-center text-black h-[31px] px-2 text-[12px]"
            sx={{border: "1px solid black", boxShadow: "none", ":hover" : {borderColor: "#4690ff", color: '#4690ff'}}}
            onClick={handleMenuOpen}
            endIcon={<BiChevronDown />}
          >
            Price Filter
          </Button>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <Box p={2} className="bg-white shadow-md border rounded-md">
              <form onSubmit={handleFilter}>
                <Stack spacing={2}>
                  <TextField
                    name="minPrice"
                    label="Min Price"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={state.minPrice}
                    onChange={handleChange}
                  />
                  <TextField
                    name="maxPrice"
                    label="Max Price"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={state.maxPrice}
                    onChange={handleChange}
                  />
                  <Button type="submit" variant="contained" startIcon={<FiSearch />} sx={{backgroundColor: "#e76e81"}}>
                    Apply
                  </Button>
                </Stack>
              </form>
            </Box>
          </Popover>
        </>)
      )}
    </>
  );
};

export default Page;