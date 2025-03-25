import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoSearchOutline } from "react-icons/io5";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";
import { productsApi } from "../../../redux/api/productsApi";
import filterRouteLinkGenerate from "./filterRouterLink";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { filterProducts } = useSelector(({ filterProducts }) => filterProducts);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    text: filterProducts.text || "",
  });

  useEffect(() => {
    setState({ text: filterProducts.text || "" });
  }, [filterProducts.text]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(productsApi.util.resetApiState());
    dispatch(filterProducts_r({ ...filterProducts, text: state.text, page: 1 }));
    filterRouteLinkGenerate({ ...filterProducts, text: state.text, page: 1 });
  };

  const handleChange = (e) => {
    setState((prevState) => ({ ...prevState, text: e.target.value }));
  };

  return (
    <div className="py-2 mb-4">
      <h6 className="text-sm font-semibold">Search</h6>
      <form onSubmit={handleSearch} className="flex gap-2 mt-2">
        <div className="relative flex-grow">
          <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Enter text..."
            value={state.text}
            onChange={handleChange}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="default">
          Search
        </Button>
      </form>
    </div>
  );
};

export default Page;