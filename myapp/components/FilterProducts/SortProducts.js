import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import filterRouteLinkGenerate from "./filterRouterLink";
import { productsApi } from "../../../redux/api/productsApi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdOutlineSortByAlpha } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Page = () => {
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const sortItem = (data) => {
    const newData = JSON.parse(data);
    dispatch(productsApi.util.resetApiState());

    dispatch(filterProducts_r({ ...filterProducts, sort: newData, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, sort: newData, page: 1 });

    setOpen(false);
  };

  return (
    <div className="w-full">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          {isMobile ? (
            <Button variant="outline" className="w-full flex items-center justify-between">
              <span className="font-bold">Sort By</span>
              {open ? <FiChevronUp className="text-xl" /> : <FiChevronDown className="text-xl" />}
            </Button>
          ) : (
            <Button variant="outline" className="w-full flex items-center justify-between">
              Sort By <FiChevronDown className="ml-2 text-lg" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={() => sortItem(JSON.stringify({ "variant_products.price": -1, price: -1 }))}>
            <MdOutlineSortByAlpha className="mr-2" />
            Increased Price
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => sortItem(JSON.stringify({ "variant_products.price": 1, price: 1 }))}>
            <MdOutlineSortByAlpha className="mr-2" />
            Decreasing Price
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Page;