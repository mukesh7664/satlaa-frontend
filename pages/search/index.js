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
  // const { filterProducts } = useSelector(
  //   ({ filterProducts }) => filterProducts
  // );
  // const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  // const callUrltoRedux = async () => {
  //   const urlToRedux = {};
  //   for await (const [key, value] of Object.entries(router.query)) {
  //     const arr = '["' + value.replaceAll(",", '","') + '"]';
  //     urlToRedux[key] = JSON.parse(arr);
  //   }
  //   await dispatch(
  //     filterProducts_r({ ...filterProducts, ...urlToRedux, page: 1, perPage: 12 })
  //   );
  // };

  // useEffect(() => {
  //   callUrltoRedux();
  // }, [router.router?.asPath]);
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

        <div
          className={`w-full hidden md:flex md:flex-row p-2 gap-x-3 shadow-sm border-top md:relative md:top-auto md:right-auto md:left-auto md:bottom-auto md:visible`}
        >
          {/* <TextFilter /> */}
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
          closable={true}
          onClose={onClose}
          open={visible}
          bodyStyle={{ padding: "0px" }}
          className=""
          width="80vw"
        >
          <Collapse
            collapsible="header"
            accordion="true"
            bordered={false}
            className="bg-white"
            expandIconPosition="end"
          >
            <Panel className="text-base" header="Categories" key="1">
              <CategoriesFilter isMobile={true} />
            </Panel>

            <Panel className="text-base" header="Prices" key="2">
              <PriceFilter isMobile={true} />
            </Panel>
            <Panel className="text-base" header="Tags" key="3">
              <TagsFilter isMobile={true} />
            </Panel>
            <Panel className="text-base" header="Sub Categories" key="4">
              <SubCategoryFilter isMobile={true} />
            </Panel>
            <Panel className="text-base" header="Colors" key="5">
              <ColorFilter isMobile={true} />
            </Panel>
            <Panel className="text-base" header="Styles" key="5">
              <StyleFilter isMobile={true} />
            </Panel>
          </Collapse>
        </Drawer>

        <div className=" md:col-span-10  col-span-12  ">
          <div className=" fixed bottom-0 left-0 z-10 w-full flex flex-row bg-white">
            <div className="w-full">
              <button
                className="flex items-center justify-between px-4 py-2 w-full z-10 bg-white border rounded-sm p-0.3 text-base  md:hidden font-bold"
                onClick={showDrawer}
              >
                Filter By <BiFilterAlt className="text-lg mr-2]" />
              </button>
            </div>
            <div className="w-full md:w-6/12 z-12 md:hidden">
              <SortProducts />
            </div>
          </div>
          <div className="w-full float-left   pb-0">
            <FilterSelectedTop />
          </div>

          <div className="w-full mt-3 float-left">
            <FilterProductArea initialData={productData} category="search" />
          </div>
        </div>
      </div>
    </div>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { query } = context;
    // const { category } = query;
    await fetchData(store.dispatch);
    const axios = axiosInstance(context);
    const auth = await authservice.isAuthenticated(context);

    if (auth.isAuthenticated) {
      await store.dispatch(cartFetch(auth.userCart));
      await store.dispatch(setLogin(auth.user));
      await store.dispatch(setIsAuthenticated(true));
    }
    const urlToRedux = {};

    for await (const [key, value] of Object.entries(query)) {
      const arr = '["' + value.replaceAll(",", '","') + '"]';
      urlToRedux[key] = JSON.parse(arr);
    }
    // urlToRedux["categories"] = [category];
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