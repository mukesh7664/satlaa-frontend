import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import filterRouteLinkGenerate from "./filterRouterLink";
import { useMediaQuery } from "react-responsive";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BiChevronDown } from "react-icons/bi";

const Page = () => {
  const { styles } = useSelector(({ styles }) => styles);
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [state, setState] = useState({
    styles: [],
    selectedStyles: filterProducts.styles || [],
  });

  // ✅ Sync state properly when Redux updates
  useEffect(() => {
    const formattedStyles = styles.map((style) => ({
      label: style.title,
      value: style.seo,
    }));

    setState((prev) => ({
      ...prev,
      styles: formattedStyles,
      selectedStyles: filterProducts.styles || [],
    }));
  }, [styles, filterProducts.styles]); // ✅ Depend only on styles, filterProducts.styles

  const handleSelection = (value) => {
    const updatedStyles = state.selectedStyles.includes(value)
      ? state.selectedStyles.filter((tag) => tag !== value) // ✅ Remove filter
      : [...state.selectedStyles, value]; // ✅ Add new filter

    // ✅ Ensure Redux state updates first
    dispatch(productsApi.util.resetApiState());
    dispatch(
      filterProducts_r({
        ...filterProducts,
        styles: updatedStyles, // ✅ Ensure it updates correctly
        page: 1,
      })
    );

    filterRouteLinkGenerate({
      ...filterProducts,
      styles: updatedStyles,
      page: 1,
    });

    // ✅ Sync local state AFTER Redux updates
    setState((prev) => ({ ...prev, selectedStyles: updatedStyles }));
  };

  return (
    <div>
      {isMobile ? (
        <div className="flex flex-col space-y-2">
          {state.styles.map((subcat) => (
            <label key={subcat.value} className="flex items-center space-x-2 text-sm">
              <Checkbox
                checked={state.selectedStyles.includes(subcat.value)}
                onCheckedChange={() => handleSelection(subcat.value)}
              />
              <span>{subcat.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-between px-3 py-1 text-black">
              <span>Styles</span> <BiChevronDown className="ml-1 text-lg" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[200px]">
            {state.styles.length > 0 ? (
              state.styles.map((tag) => (
                <DropdownMenuItem key={tag.value} className="flex items-center space-x-2 py-2 px-3">
                  <Checkbox
                    checked={state.selectedStyles.includes(tag.value)}
                    onCheckedChange={() => handleSelection(tag.value)}
                  />
                  <span className="text-sm">{tag.label}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled className="text-sm text-gray-500">
                No styles available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default Page;