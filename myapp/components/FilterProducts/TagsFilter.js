import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Button, Checkbox } from "antd";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { BiChevronDown } from "react-icons/bi";


const Page = ({ isMobile }) => {
  const { tags } = useSelector(({ tags }) => tags);
  const { filterProducts } = useSelector(
    ({ filterProducts }) => filterProducts
  );
  const [state, seTstate] = useState({
    tags: [],
    allData: [],
    selectedTags: filterProducts.tags,
  });
  const dispatch = useDispatch();

  const getTags = () => {
    const dataManipulate = [];
    for (const i in tags) {
      dataManipulate.push({
        label: tags[i].title,
        value: tags[i].seo,
      });
    }
    seTstate({ ...state, tags: dataManipulate, allData: dataManipulate });
  };

  useEffect(() => {
    getTags();
    seTstate((prevState) => ({
      ...prevState,
      selectedTags: filterProducts.tags,
    }));
  }, [filterProducts.tags]);

  const handleMenuClick = (e) => {
    e.preventDefault();

    let selectedTags = [...state.selectedTags];

    if (selectedTags.includes(e.target.value)) {
      selectedTags = selectedTags.filter(
        (tag) => tag !== e.target.value
      );
    } else {
      selectedTags.push(e.target.value);
    }

    seTstate({ ...state, selectedTags });
    dispatch(productsApi.util.resetApiState());

    dispatch(
      filterProducts_r({ ...filterProducts, tags: selectedTags, page: 1 })
    );
    filterRouteLinkGenerate({
      ...filterProducts,
      tags: selectedTags,
      page: 1,
    });
  };

  return (
    <>
      {isMobile ? (
        // Mobile layout

        <div className="text-base flex flex-col">
          {state.tags.map((tag) => (
            <div key={tag.value}>
              <Checkbox
                checked={state.selectedTags.includes(tag.value)}
                onChange={handleMenuClick}
                value={tag.value}
              >
                {tag.label}
              </Checkbox>
            </div>
          ))}
        </div>
      ) : (
        // Desktop layout
        <Dropdown
          menu={{
            items: state.tags.map((tag) => ({
              label: (
                <Checkbox
                  checked={state.selectedTags.includes(tag.value)}
                  onChange={handleMenuClick}
                  value={tag.value}
                  style={{ borderRadius: "0px", fontSize: "15px" }}
                >
                  {tag.label}
                </Checkbox>
              ),
              key: tag.value,
            })),
          }}
          trigger={["click","hover"]}
        >
          <Button
            className="flex items-center justify-between px-3 py-2 border border-gray-300 bg-white shadow-sm"
            onClick={(e) => e.preventDefault()}
          >
            <span>Tags</span>
            <BiChevronDown className="ml-1 text-lg"/>
          </Button>
        </Dropdown>
      )}
    </>
  );
};

export default Page;
