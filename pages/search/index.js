import { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { filterProducts as filterProducts_r } from "../../redux/reducers/FilterProducts";
import { Drawer, Collapse } from "@mui/material";
import { wrapper } from "../../redux/store";
import axiosInstance from "../../util/axios";
import authservice from "../../util/services/authservice";
import { setIsAuthenticated, setLogin } from "../../redux/reducers/Login";
import { cartFetch } from "../../redux/reducers/Cart";

const { Panel } = Collapse;
import Head from "../../myapp/core/Head";
import FilterSelectedTop from "../../myapp/components/FilterProducts/FilterSelectedTop";
import TagsFilter from "../../myapp/components/FilterProducts/TagsFilter";
import CategoriesFilter from "../../myapp/components/FilterProducts/CategoriesFilter";
import PriceFilter from "../../myapp/components/FilterProducts/PriceFilter";
import FilterProductArea from "../../myapp/components/FilterProducts/FilterProductArea";
import TextFilter from "../../myapp/components/FilterProducts/TextFilter";
import SortProducts from "../../myapp/components/FilterProducts/SortProducts";
import SubCategoryFilter from "../../myapp/components/FilterProducts/SubCategoryFilter";
import ColorFilter from "../../myapp/components/FilterProducts/ColorFilter";
import StyleFilter from "../../myapp/components/FilterProducts/StyleFilter";
import { fetchData } from "../../util/fetchData";
import { API_URL } from "../../config";

const Search = ({ productData }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="container-custom">
      <div className="flex flex-col h-full my-2 py-2 bg-white">
        <Head title="Search" />

        <div className="w-full hidden md:flex flex-row p-2 gap-x-3 shadow-sm border-top">
          <CategoriesFilter />
          <TagsFilter />
          <SubCategoryFilter />
          <ColorFilter />
          <StyleFilter />
          <PriceFilter />
          <div className="flex-grow" />
          <div className="w-32 self-end hidden md:block">
            <SortProducts />
          </div>
        </div>

        <Drawer
          title="Filter By"
          placement="left"
          open={visible}
          onClose={onClose}
          bodyStyle={{ padding: "0px" }}
          width="80vw"
        >
          <Collapse accordion className="bg-white">
            <Panel header="Categories" key="1">
              <CategoriesFilter isMobile={true} />
            </Panel>
            <Panel header="Prices" key="2">
              <PriceFilter isMobile={true} />
            </Panel>
            <Panel header="Tags" key="3">
              <TagsFilter isMobile={true} />
            </Panel>
            <Panel header="Sub Categories" key="4">
              <SubCategoryFilter isMobile={true} />
            </Panel>
            <Panel header="Colors" key="5">
              <ColorFilter isMobile={true} />
            </Panel>
            <Panel header="Styles" key="6">
              <StyleFilter isMobile={true} />
            </Panel>
          </Collapse>
        </Drawer>

        <div className="fixed bottom-0 left-0 z-10 w-full flex flex-row bg-white">
          <button
            className="flex items-center justify-center px-4 py-2 w-full bg-white border rounded-sm text-base md:hidden font-bold"
            onClick={showDrawer}
          >
            <BiFilterAlt className="text-lg mr-2" />
            Filter By
          </button>
          <div className="w-full md:w-6/12 md:hidden">
            <SortProducts />
          </div>
        </div>

        <div className="w-full pb-0">
          <FilterSelectedTop showText={true} />
        </div>

        <div className="w-full mt-3">
          <FilterProductArea initialData={productData} category="search" />
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { query } = context;
    await fetchData(store.dispatch);
    const axios = axiosInstance(context);
    const auth = await authservice.isAuthenticated(context);

    if (auth.isAuthenticated) {
      await store.dispatch(cartFetch(auth.userCart));
      await store.dispatch(setLogin(auth.user));
      await store.dispatch(setIsAuthenticated(true));
    }

    const urlToRedux = {};
    for (const [key, value] of Object.entries(query)) {
      const arr = `["${value.replaceAll(",", '","')}"]`;
      urlToRedux[key] = JSON.parse(arr);
    }

    const { filterProducts } = store.getState().filterProducts;
    await store.dispatch(
      filterProducts_r({
        ...filterProducts,
        ...urlToRedux,
        page: 1,
        perPage: 12,
      })
    );

    const productData = await axios.post(
      `${API_URL}/productspublic/search`,
      filterProducts
    );

    return {
      props: {
        productData: productData.data ?? {},
      },
    };
  }
);

export default Search;