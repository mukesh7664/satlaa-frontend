import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Button, Checkbox } from "antd";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { BiChevronDown } from "react-icons/bi";

const Page = ({ isMobile }) => {
  const { styles } = useSelector(({ styles }) => styles);
  const { filterProducts } = useSelector(
    ({ filterProducts }) => filterProducts
  );
  const [state, seTstate] = useState({
    styles: [],
    allData: [],
    selectedStyles: filterProducts.styles,
  });
  const dispatch = useDispatch();

  const getStyles = () => {
    const dataManipulate = [];
    for (const i in styles) {
      dataManipulate.push({
        label: styles[i].title,
        value: styles[i].seo,
      });
    }
    seTstate({
      ...state,
      styles: dataManipulate,
      allData: dataManipulate,
    });
  };

  useEffect(() => {
    getStyles();
    seTstate((prevState) => ({
      ...prevState,
      selectedStyles: filterProducts.styles,
    }));
  }, [filterProducts.styles]);

  const handleMenuClick = (e) => {
    e.preventDefault();

    let selectedStyles = [...state.selectedStyles];

    if (selectedStyles.includes(e.target.value)) {
      selectedStyles = selectedStyles.filter(
        (tag) => tag !== e.target.value
      );
    } else {
      selectedStyles.push(e.target.value);
    }

    seTstate({ ...state, selectedStyles });
    dispatch(productsApi.util.resetApiState());

    dispatch(
      filterProducts_r({
        ...filterProducts,
        styles: selectedStyles,
        page: 1,
      })
    );
    filterRouteLinkGenerate({
      ...filterProducts,
      styles: selectedStyles,
      page: 1,
    });
  };
  const menuProps = {
    items: state.styles.map((tag) => ({
      label: (
        <Checkbox
         checked={state.selectedStyles.includes(tag.value)}
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
      {isMobile && state.styles ? (
        // Mobile layout

        <div className="text-base flex flex-col">
          {state.styles.map((subcat) => (
            <div key={subcat.value}>
              <Checkbox
               checked={state.selectedStyles.includes(subcat.value)}
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
            <span>Styles</span>
            <BiChevronDown className="ml-1 text-lg"/>
          </Button>
        </Dropdown>
      )}
    </>
  );
};

export default Page;
