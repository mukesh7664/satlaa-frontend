import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import filterRouteLinkGenerate from "./filterRouterLink";
import { FiSearch } from "react-icons/fi";
import { BiChevronDown } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const Page = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);

  // ✅ Ensure local state reflects Redux filters
  const [state, setState] = useState({
    minPrice: filterProducts.minPrice || "",
    maxPrice: filterProducts.maxPrice || "",
  });

  // ✅ Keep local state in sync when Redux updates
  useEffect(() => {
    setState({
      minPrice: filterProducts.minPrice || "",
      maxPrice: filterProducts.maxPrice || "",
    });
  }, [filterProducts.minPrice, filterProducts.maxPrice]);

  const handleFilter = (e) => {
    e.preventDefault();

    const updatedFilters = {
      ...filterProducts,
      minPrice: state.minPrice !== "" ? Number(state.minPrice) : undefined,
      maxPrice: state.maxPrice !== "" ? Number(state.maxPrice) : undefined,
      page: 1,
    };

    // ✅ Reset Redux state before updating
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r(updatedFilters));
    filterRouteLinkGenerate(updatedFilters);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value || "", // ✅ Allow empty values instead of forcing `0`
    }));
  };

  return (
    <>
      {isMobile ? (
        // Mobile Layout
        <div className="p-2 bg-white border rounded-md">
          <form onSubmit={handleFilter} className="space-y-3">
            <Input
              name="minPrice"
              placeholder="Min Price"
              type="number"
              value={state.minPrice}
              onChange={handleChange}
            />
            <Input
              name="maxPrice"
              placeholder="Max Price"
              type="number"
              value={state.maxPrice}
              onChange={handleChange}
            />
            <Button type="submit" className="w-full flex items-center gap-2">
              <FiSearch /> Apply
            </Button>
          </form>
          <Separator className="mt-3" />
        </div>
      ) : (
        // Desktop Layout with Popover
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Price Filter <BiChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[200px] p-4 bg-white shadow-md border rounded-md">
            <form onSubmit={handleFilter} className="space-y-3">
              <Input
                name="minPrice"
                placeholder="Min Price"
                type="number"
                value={state.minPrice}
                onChange={handleChange}
              />
              <Input
                name="maxPrice"
                placeholder="Max Price"
                type="number"
                value={state.maxPrice}
                onChange={handleChange}
              />
              <Button type="submit" className="w-full flex items-center gap-2 bg-[#e76e81] text-white">
                <FiSearch /> Apply
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default Page;