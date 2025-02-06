import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Button, Checkbox } from "@mui/material";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { BiChevronDown } from "react-icons/bi";

const Page = ({ isMobile }) => {
  const { colors } = useSelector(({ colors }) => colors);
  const { filterProducts } = useSelector(
    ({ filterProducts }) => filterProducts
  );
  const [state, seTstate] = useState({
    colors: [],
    allData: [],
    selectedColors: filterProducts.colors,
  });
  const dispatch = useDispatch();

  const getColors = () => {
    const dataManipulate = [];
    for (const i in colors) {
      dataManipulate.push({
        label: colors[i].title,
        value: colors[i].seo,
      });
    }
    seTstate({ ...state, colors: dataManipulate, allData: dataManipulate });
  };


  useEffect(() => {
    getColors();
    seTstate((prevState) => ({
      ...prevState,
      selectedColors: filterProducts.colors,
    }));
  }, [filterProducts.colors]);
  const handleMenuClick = (e) => {
    e.preventDefault();

    let selectedColors = [...state.selectedColors];

    if (selectedColors.includes(e.target.value)) {
      selectedColors = selectedColors.filter(
        (tag) => tag !== e.target.value
      );
    } else {
      selectedColors.push(e.target.value);
    }

    seTstate({ ...state, selectedColors });
    dispatch(productsApi.util.resetApiState());

    dispatch(
      filterProducts_r({ ...filterProducts, colors: selectedColors, page: 1 })
    );
    filterRouteLinkGenerate({
      ...filterProducts,
      colors: selectedColors,
      page: 1,
    });
  };

  const menuProps = {
    items: state.colors.map((tag) => ({
      label: (
        <Checkbox
          checked={state.selectedColors.includes(tag.value)}
          onChange={handleMenuClick}
          value={tag.value}
        >
          {tag.label}
        </Checkbox>
      ),
      key: tag.value,
    })),
  };

  return (
    <>
      {isMobile ? (
        // Mobile layout
       
          <div className="flex flex-col">
            {state.colors.map((color) => (
              <div key={color.value}>
                <Checkbox
                  checked={state.selectedColors.includes(color.value)}
                  onChange={handleMenuClick}
                  value={color.value}
                  style={{ borderRadius: "0px", fontSize: "15px" }}
                >
                  {color.label}
                </Checkbox>
              </div>
            ))}
          </div>
    
      ) : (
        // Desktop layout
        <Dropdown menu={menuProps} trigger={["click","hover"]}>
          <Button
            className="flex items-center justify-between px-3 py-2 border border-gray-300 bg-white shadow-sm"
            onClick={(e) => e.preventDefault()}
          >
            <span>Colors</span>
            <BiChevronDown className="ml-1 text-lg"/>
          </Button>
        </Dropdown>
      )}
    </>
  );
};

export default Page;
