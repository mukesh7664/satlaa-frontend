import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Button, Checkbox } from "antd";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { BiChevronDown } from "react-icons/bi";


const Page = ({ isMobile }) => {
  const { subcategory } = useSelector(({ subcategory }) => subcategory);
  const { filterProducts } = useSelector(
    ({ filterProducts }) => filterProducts
  );
  const [state, seTstate] = useState({
    subcategory: [],
    allData: [],
    selectedSubcategory: filterProducts.subcategory,
  });
  const dispatch = useDispatch();

  const getSubcategory = () => {
    const dataManipulate = [];
    for (const i in subcategory) {
      dataManipulate.push({
        label: subcategory[i].title,
        value: subcategory[i].seo,
      });
    }
    seTstate({
      ...state,
      subcategory: dataManipulate,
      allData: dataManipulate,
    });
  };

  useEffect(() => {
    getSubcategory();
    seTstate((prevState) => ({
      ...prevState,
      selectedSubcategory: filterProducts.subcategory,
    }));
  }, [filterProducts.subcategory]);

  const handleMenuClick = (e) => {
    e.preventDefault();

    let selectedSubcategory = [...state.selectedSubcategory];

    if (selectedSubcategory.includes(e.target.value)) {
      selectedSubcategory = selectedSubcategory.filter(
        (tag) => tag !== e.target.value
      );
    } else {
      selectedSubcategory.push(e.target.value);
    }

    seTstate({ ...state, selectedSubcategory });
    dispatch(productsApi.util.resetApiState());

    dispatch(
      filterProducts_r({
        ...filterProducts,
        subcategory: selectedSubcategory,
        page: 1,
      })
    );
    filterRouteLinkGenerate({
      ...filterProducts,
      subcategory: selectedSubcategory,
      page: 1,
    });
  };
  const menuProps = {
    items: state.subcategory.map((tag) => ({
      label: (
        <Checkbox
          checked={state.selectedSubcategory.includes(tag.value)}
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
      {isMobile && state.subcategory ? (
        // Mobile layout

        <div className="text-base flex flex-col">
          {state.subcategory.map((subcat) => (
            <div key={subcat.value}>
              <Checkbox
                checked={state.selectedSubcategory.includes(subcat.value)}
                onChange={handleMenuClick}
                value={subcat.value}
                style={{ borderRadius: "0px", fontSize: "15px" }}
              >
                {subcat.label}
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
            <span>Sub Category</span>
            <BiChevronDown className="ml-1 text-lg"/>
          </Button>
        </Dropdown>
      )}
    </>
  );
};

export default Page;
