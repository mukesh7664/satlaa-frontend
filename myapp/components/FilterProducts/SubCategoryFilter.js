import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { useMediaQuery } from "react-responsive";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BiChevronDown } from "react-icons/bi";
import filterRouteLinkGenerate from "./filterRouterLink";

const Page = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Redux state
  const { subcategory } = useSelector((state) => state.subcategory);
  const { filterProducts } = useSelector((state) => state.filterProducts);

  // ✅ Local state (syncs with Redux)
  const [state, setState] = useState({
    subcategory: [],
    selectedSubcategory: filterProducts.subcategory || [],
  });

  // ✅ Sync subcategory list when `subcategory` updates
  useEffect(() => {
    if (subcategory.length > 0) {
      setState((prev) => ({
        ...prev,
        subcategory: subcategory.map((subcat) => ({
          label: subcat.title,
          value: subcat.seo,
        })),
      }));
    }
  }, [subcategory]);

  // ✅ Sync `selectedSubcategory` when Redux filter state updates
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      selectedSubcategory: filterProducts.subcategory || [],
    }));
  }, [filterProducts.subcategory]);

  const handleSelection = (value) => {
    const updatedSubcategory = state.selectedSubcategory.includes(value)
      ? state.selectedSubcategory.filter((subcat) => subcat !== value)
      : [...state.selectedSubcategory, value];

    // ✅ Immediately dispatch Redux update
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, subcategory: updatedSubcategory, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, subcategory: updatedSubcategory, page: 1 });
  };

  return (
    <div>
      {isMobile ? (
        <div className="flex flex-col">
          {state.subcategory.map((subcat) => (
            <label key={subcat.value} className="flex items-center space-x-2 text-sm">
              <Checkbox
                checked={state.selectedSubcategory.includes(subcat.value)}
                onCheckedChange={() => handleSelection(subcat.value)}
              />
              <span>{subcat.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full text-black bg-white px-2 py-1 text-[12px] flex items-center justify-between">
              Sub Category <BiChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[180px]">
            {state.subcategory.length > 0 ? (
              state.subcategory.map((tag) => (
                <DropdownMenuItem key={tag.value} className="flex items-center space-x-2 py-2 px-3">
                  <Checkbox
                    checked={state.selectedSubcategory.includes(tag.value)}
                    onCheckedChange={() => handleSelection(tag.value)}
                  />
                  <span className="text-sm">{tag.label}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled className="text-sm text-gray-500">
                No subcategories available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default Page;