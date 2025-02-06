import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Button, Menu } from "@mui/material";
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import filterRouteLinkGenerate from "./filterRouterLink";
import { productsApi } from "../../../redux/api/productsApi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useMediaQuery } from 'react-responsive';
const Page = () => {
  const { filterProducts } = useSelector(
    ({ filterProducts }) => filterProducts
  );
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const sortItem = (data) => {
    const newData = JSON.parse(data);
    dispatch(productsApi.util.resetApiState());

    dispatch(filterProducts_r({ ...filterProducts, sort: newData, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, sort: newData, page: 1 });
  };

  const menuProps = {
    items: [
      {
        key: 1,

        label: (
          <Menu.Item
            key="1"
            onClick={() =>
              sortItem(
                JSON.stringify({ "variant_products.price": -1, price: -1 })
              )
            }
          >
            <SortDescendingOutlined /> Increased Price
          </Menu.Item>
        ),
      },
      {
        key: 2,

        label: (
          <Menu.Item
            key="2"
            onClick={() =>
              sortItem(
                JSON.stringify({ "variant_products.price": 1, price: 1 })
              )
            }
          >
            <SortAscendingOutlined /> Decreasing Price
          </Menu.Item>
        ),
      },
    ],
  };

  return (
    <div className="w-full rounded-bottom">
      <Dropdown   placement={isMobile ? "top" : "bottomRight"}  menu={menuProps} trigger={["click"]}>
        <button
          className="flex items-center justify-between px-4 py-2 w-full z-10 bg-white border rounded-sm p-0.3 text-base  md:hidden font-bold"
          onClick={(e) => e.preventDefault()}
        >
          Sort By
          {isMobile ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
          
        </button>
      </Dropdown>
    </div>
  );
};

export default Page;
