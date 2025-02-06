import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Space, InputNumber, Button, Dropdown, Divider } from "@mui/material";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { FiSearch } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";

const Page = ({ isMobile }) => {
  const { filterProducts } = useSelector(
    ({ filterProducts }) => filterProducts
  );
  const [state, seTstate] = useState(filterProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    seTstate(filterProducts);
  }, [filterProducts]);

  const handleFilter = (data) => {
    if (data) {
      seTstate({
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
      });
      dispatch(productsApi.util.resetApiState());

      dispatch(
        filterProducts_r({
          ...filterProducts,
          minPrice: data.minPrice,
          maxPrice: data.maxPrice,
          page: 1,
        })
      );
      filterRouteLinkGenerate({
        ...filterProducts,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        page: 1,
      });
    }
  };

  const formElement = (
    <Form
      onFinish={handleFilter}
      initialValues={{ minPrice: state.minPrice, maxPrice: state.maxPrice }}
      className="bg-white p-2 shadow border"
    >
      <Space>
        <Form.Item name="minPrice">
          <InputNumber placeholder="Minimum" min={0} />
        </Form.Item>
        <Form.Item name="maxPrice">
          <InputNumber placeholder="Maximum" min={0} />
        </Form.Item>
        <Form.Item>
          <button type="submit" className="bg-white p-2 hover:text-gray-500">
            <FiSearch className="text-2xl" />
          </button>
        </Form.Item>
      </Space>
    </Form>
  );

  return (
    <>
      {isMobile ? (
        // Mobile layout
        <div className="text-base flex flex-col">
          {formElement}
          <Divider className="m-0" />
        </div>
      ) : (
        // Desktop layout
        <Dropdown overlay={formElement} trigger={["click"]}>
          <Button
            className=" flex justify-center items-center"
            onClick={(e) => e.preventDefault()}
          >
            Price Filter <BiChevronDown className="ml-1 text-lg"/>
          </Button>
        </Dropdown>
      )}
    </>
  );
};

export default Page;
