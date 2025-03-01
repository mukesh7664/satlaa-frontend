import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoSearchOutline } from "react-icons/io5";
import { TextField, Button, InputAdornment, Stack } from "@mui/material";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";

const Page = () => {
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    text: filterProducts.text || "",
  });

  useEffect(() => {
    setState({ text: filterProducts.text || "" });
  }, [filterProducts.text]);

  const handleSearch = (e) => {
    e.preventDefault();

    // ✅ Ensure API state resets before dispatching new filters
    dispatch(productsApi.util.resetApiState());

    // ✅ Dispatch updated filter with correct text input
    dispatch(filterProducts_r({ ...filterProducts, text: state.text, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, text: state.text, page: 1 });
  };

  const handleChange = (e) => {
    setState((prevState) => ({ ...prevState, text: e.target.value }));
  };

  return (
    <div className="py-2 mb-4">
      <h6>Search</h6>
      <form onSubmit={handleSearch}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter text..."
            value={state.text}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoSearchOutline />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ minWidth: "64px" }}
          >
            Search
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default Page;