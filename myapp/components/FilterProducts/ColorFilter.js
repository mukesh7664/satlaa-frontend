import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import filterRouteLinkGenerate from "./filterRouterLink";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BiChevronDown } from "react-icons/bi";

const Page = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { colors } = useSelector(({ colors }) => colors);
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);

  // ✅ Local state that syncs with Redux
  const [state, setState] = useState({
    colors: [],
    selectedColors: filterProducts.colors || [],
  });

  // ✅ Sync available colors when `colors` updates
  useEffect(() => {
    if (colors) {
      setState((prevState) => ({
        ...prevState,
        colors: colors.map((color) => ({
          label: color.title,
          value: color.seo,
        })),
      }));
    }
  }, [colors]);

  // ✅ Sync `selectedColors` with Redux state
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      selectedColors: filterProducts.colors || [],
    }));
  }, [filterProducts.colors]);

  const handleCheckboxChange = (value) => {
    const updatedColors = state.selectedColors.includes(value)
      ? state.selectedColors.filter((color) => color !== value)
      : [...state.selectedColors, value];

    // ✅ Update local state first
    setState((prevState) => ({ ...prevState, selectedColors: updatedColors }));

    // ✅ Dispatch Redux updates
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, colors: updatedColors, page: 1 }));

    // ✅ Ensure URL updates correctly
    filterRouteLinkGenerate({ ...filterProducts, colors: updatedColors, page: 1 });
  };

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col space-y-2">
          {state.colors.map((color) => (
            <label key={color.value} className="flex items-center space-x-2 text-sm">
              <Checkbox
                checked={state.selectedColors.includes(color.value)}
                onCheckedChange={() => handleCheckboxChange(color.value)}
              />
              <span>{color.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center justify-between px-3 py-1 text-black">
              <span>Colors</span> <BiChevronDown className="ml-1 text-lg" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-[180px]">
            {state.colors.length > 0 ? (
              state.colors.map((color) => (
                <DropdownMenuItem key={color.value} className="flex items-center space-x-2 py-2 px-3">
                  <Checkbox
                    checked={state.selectedColors.includes(color.value)}
                    onCheckedChange={() => handleCheckboxChange(color.value)}
                  />
                  <span className="text-sm">{color.label}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled className="text-sm text-gray-500">
                No colors available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default Page;