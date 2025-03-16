"use client";

import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { filterProducts as filterProducts_r } from "@/redux/reducers/FilterProducts";
import { Drawer, Collapse } from "@mui/material";
import { setIsAuthenticated, setLogin } from "@/redux/reducers/Login";
import { cartFetch } from "@/redux/reducers/Cart";
import axiosInstance from "@/util/axios";
import authservice from "@/util/services/authservice";
import { API_URL } from "@/config";
import { fetchData } from "@/util/fetchData";

import FilterSelectedTop from "@/components/FilterProducts/FilterSelectedTop";
import TagsFilter from "@/components/FilterProducts/TagsFilter";
import CategoriesFilter from "@/components/FilterProducts/CategoriesFilter";
import PriceFilter from "@/components/FilterProducts/PriceFilter";
import FilterProductArea from "@/components/FilterProducts/FilterProductArea";
import TextFilter from "@/components/FilterProducts/TextFilter";
import SortProducts from "@/components/FilterProducts/SortProducts";
import SubCategoryFilter from "@/components/FilterProducts/SubCategoryFilter";
import ColorFilter from "@/components/FilterProducts/ColorFilter";
import StyleFilter from "@/components/FilterProducts/StyleFilter";

const { Panel } = Collapse;

const Search = () => {
  const searchParams = useSearchParams(); // ✅ Correct way to access searchParams in a client component
  const [visible, setVisible] = useState(false);
  const [productData, setProductData] = useState([]);
  const dispatch = useDispatch();
  const filterProducts = useSelector((state) => state.filterProducts.filterProducts);

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData(dispatch);
      const auth = await authservice.isAuthenticated();

      if (auth.isAuthenticated) {
        dispatch(cartFetch(auth.userCart));
        dispatch(setLogin(auth.user));
        dispatch(setIsAuthenticated(true));
      }

      const urlToRedux = {};
      searchParams.forEach((value, key) => {
        const arr = `["${value.replaceAll(",", '","')}"]`;
        urlToRedux[key] = JSON.parse(arr);
      });

      dispatch(filterProducts_r({ ...filterProducts, ...urlToRedux, page: 1, perPage: 12 }));

      try {
        const axios = axiosInstance();
        const response = await axios.post(`${API_URL}/productspublic/search`, filterProducts);
        setProductData(response.data ?? []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchDataAsync();
  }, [dispatch, searchParams]);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <div className="container-custom">
      <div className="flex flex-col h-full my-2 py-2 bg-white">
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

export default Search;