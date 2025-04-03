"use client";

import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { filterProducts as filterProducts_r } from "@/redux/reducers/FilterProducts";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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
import { Button } from "@/components/ui/button";

const Search = () => {
  const searchParams = useSearchParams();
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

  return (
    <div className="container-custom">
      <div className="flex flex-col h-full my-2 py-2 bg-white">
        {/* Desktop Filter Bar */}
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

        {/* Mobile Filter Drawer */}
        <Sheet open={visible} onOpenChange={setVisible}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filter By</SheetTitle>
            </SheetHeader>
            <Accordion type="multiple" className="bg-white">
              <AccordionItem value="categories">
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <CategoriesFilter isMobile={true} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="prices">
                <AccordionTrigger>Prices</AccordionTrigger>
                <AccordionContent>
                  <PriceFilter isMobile={true} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tags">
                <AccordionTrigger>Tags</AccordionTrigger>
                <AccordionContent>
                  <TagsFilter isMobile={true} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="subcategories">
                <AccordionTrigger>Sub Categories</AccordionTrigger>
                <AccordionContent>
                  <SubCategoryFilter isMobile={true} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="colors">
                <AccordionTrigger>Colors</AccordionTrigger>
                <AccordionContent>
                  <ColorFilter isMobile={true} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="styles">
                <AccordionTrigger>Styles</AccordionTrigger>
                <AccordionContent>
                  <StyleFilter isMobile={true} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SheetContent>
        </Sheet>

        {/* Mobile Bottom Bar */}
        <div className="fixed bottom-0 left-0 z-10 w-full flex flex-row bg-white">
          <Button
            variant="outline"
            className="flex items-center justify-center px-4 py-2 w-full md:hidden font-bold"
            onClick={() => setVisible(true)}
          >
            <BiFilterAlt className="text-lg mr-2" />
            Filter By
          </Button>
          <div className="w-full md:w-6/12 md:hidden">
            <SortProducts />
          </div>
        </div>

        {/* Selected Filters */}
        <div className="w-full pb-0">
          <FilterSelectedTop showText={true} />
        </div>

        {/* Product List */}
        <div className="w-full mt-3">
          <FilterProductArea initialData={productData} category="search" />
        </div>
      </div>
    </div>
  );
};

export default Search;