import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BiChevronDown } from "react-icons/bi";
import filterRouteLinkGenerate from "./filterRouterLink";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import { useMediaQuery } from "react-responsive";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const TagsFilter = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Redux state
  const { tags } = useSelector((state) => state.tags);
  const { filterProducts } = useSelector((state) => state.filterProducts);

  // ✅ Local state (syncs with Redux)
  const [state, setState] = useState({
    tags: [],
    selectedTags: filterProducts.tags || [],
  });

  // ✅ Sync tags list when `tags` updates
  useEffect(() => {
    if (tags.length > 0) {
      setState((prev) => ({
        ...prev,
        tags: tags.map((tag) => ({ label: tag.title, value: tag.seo })),
      }));
    }
  }, [tags]);

  // ✅ Sync `selectedTags` when Redux filter state updates
  useEffect(() => {
    setState((prev) => ({ ...prev, selectedTags: filterProducts.tags || [] }));
  }, [filterProducts.tags]);

  const handleSelection = (value) => {
    const updatedTags = state.selectedTags.includes(value)
      ? state.selectedTags.filter((tag) => tag !== value)
      : [...state.selectedTags, value];

    // ✅ Update local state
    setState((prev) => ({ ...prev, selectedTags: updatedTags }));

    // ✅ Immediately dispatch Redux update (no need for setTimeout)
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, tags: updatedTags, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, tags: updatedTags, page: 1 });
  };

  return (
    <div>
      {isMobile ? (
        <div className="flex flex-col space-y-2">
          {state.tags.map((tag) => (
            <label key={tag.value} className="flex items-center space-x-2 text-sm">
              <Checkbox
                checked={state.selectedTags.includes(tag.value)}
                onCheckedChange={() => handleSelection(tag.value)}
              />
              <span>{tag.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-between px-3 py-1 border text-black shadow-sm text-[12px]"
            >
              <span>Tags</span>
              <BiChevronDown className="ml-1 text-lg" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[150px] max-h-[200px] overflow-auto">
            {state.tags.length > 0 ? (
              state.tags.map((tag) => (
                <DropdownMenuItem key={tag.value} className="px-3 py-1">
                  <label className="flex items-center space-x-2 text-sm w-full">
                    <Checkbox
                      checked={state.selectedTags.includes(tag.value)}
                      onCheckedChange={() => handleSelection(tag.value)}
                    />
                    <span>{tag.label}</span>
                  </label>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled className="text-xs px-3 py-1">
                No tags available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default TagsFilter;