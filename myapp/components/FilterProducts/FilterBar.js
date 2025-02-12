import React from "react";
import PriceFilter from "./PriceFilter";
import TagsFilter from "./TagsFilter";
import SubCategoryFilter from "./SubCategoryFilter";
import ColorFilter from "./ColorFilter";
import StyleFilter from "./StyleFilter";
import SortProducts from "./SortProducts";
const FilterBar = () => {
  return (
    <div
      className={`w-full hidden md:flex md:flex-row p-2 gap-x-3 border-top md:relative md:top-auto md:right-auto md:left-auto md:bottom-auto md:visible`}
    >
      {/* <TextFilter /> */}
      {/* <CategoriesFilter /> */}
      <PriceFilter />
      <TagsFilter />
      <SubCategoryFilter />
      <ColorFilter />
      <StyleFilter />
      <div className="flex-grow" />

      <div className="w-32 self-end hidden md:block">
        {/* <SortProducts /> */}
      </div>
    </div>
  );
};

export default FilterBar;