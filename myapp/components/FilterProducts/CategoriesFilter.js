import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { BiChevronDown } from "react-icons/bi";

const Page = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(({ categories }) => categories);
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);

  // ✅ Local state that syncs with Redux
  const [state, setState] = useState({
    categories: [],
    selectedCategories: filterProducts.categories || [],
  });

  // ✅ Sync available categories when `categories` updates
  useEffect(() => {
    if (categories) {
      setState((prevState) => ({
        ...prevState,
        categories: categories.map((cat) => ({
          label: cat.title,
          value: cat.seo,
        })),
      }));
    }
  }, [categories]);

  // ✅ Sync `selectedCategories` with Redux state
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      selectedCategories: filterProducts.categories || [],
    }));
  }, [filterProducts.categories]);

  const handleCheckboxChange = (categoryValue, checked) => {
    const updatedCategories = checked
      ? [...state.selectedCategories, categoryValue]
      : state.selectedCategories.filter((category) => category !== categoryValue);

    // ✅ First, update the local state
    setState((prevState) => ({ ...prevState, selectedCategories: updatedCategories }));

    // ✅ Dispatch Redux updates
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, categories: updatedCategories, page: 1 }));

    // ✅ Ensure URL updates correctly
    filterRouteLinkGenerate({ ...filterProducts, categories: updatedCategories, page: 1 });
  };

  return (
    <>
      {isMobile ? (
        <div className="text-base flex flex-col">
          {state.categories.map((subcat) => (
            <label key={subcat.value} className="flex items-center space-x-2">
              <Checkbox
                checked={state.selectedCategories.includes(subcat.value)}
                onCheckedChange={(checked) => handleCheckboxChange(subcat.value, checked)}
              />
              <span>{subcat.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-between px-3 py-1 border text-black shadow-sm text-[12px] hover:border-blue-500 hover:text-blue-500"
            >
              <span>Categories</span>
              <BiChevronDown className="ml-1 text-lg" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-44 max-h-52 overflow-y-auto p-2 bg-white border">
            {state.categories.map((category) => (
              <label key={category.value} className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer">
                <Checkbox
                  checked={state.selectedCategories.includes(category.value)}
                  onCheckedChange={(checked) => handleCheckboxChange(category.value, checked)}
                />
                <span className="text-sm">{category.label}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default Page;