import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  IconButton,
} from "@mui/material";
import SortByAlphaOutlinedIcon from "@mui/icons-material/SortByAlphaOutlined";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import filterRouteLinkGenerate from "./filterRouterLink";
import { productsApi } from "../../../redux/api/productsApi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useMediaQuery } from "react-responsive";

const Page = () => {
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const sortItem = (data) => {
    const newData = JSON.parse(data);
    dispatch(productsApi.util.resetApiState());

    dispatch(filterProducts_r({ ...filterProducts, sort: newData, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, sort: newData, page: 1 });

    handleClose();
  };

  return (
    <div className="w-full">
      {isMobile ? (
        <IconButton onClick={handleClick} className="w-full bg-white border rounded-sm">
          <Typography className="font-bold">Sort By</Typography>
          {open ? <FiChevronUp className="ml-1 text-xl" /> : <FiChevronDown className="ml-1 text-xl" />}
        </IconButton>
      ) : (
        <Button
          onClick={handleClick}
          variant="contained"
          endIcon={<FiChevronDown />}
          className="w-full bg-white text-black px-2 text-[12px]"
          sx={{border: "1px solid black", boxShadow: "none"}}
        >
          Sort By
        </Button>
      )}

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <MenuItem
          onClick={() => sortItem(JSON.stringify({ "variant_products.price": -1, price: -1 }))}
        >
          <ListItemIcon>
            <SortByAlphaOutlinedIcon />
          </ListItemIcon>
          <Typography>Increased Price</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => sortItem(JSON.stringify({ "variant_products.price": 1, price: 1 }))}
        >
          <ListItemIcon>
            <SortByAlphaOutlinedIcon />
          </ListItemIcon>
          <Typography>Decreasing Price</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Page;