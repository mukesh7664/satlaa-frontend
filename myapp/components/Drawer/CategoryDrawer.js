import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { MdOutlineExpandMore } from "react-icons/md";
import TagsFilter from "@/myapp/components/FilterProducts/TagsFilter";
import PriceFilter from "@/myapp/components/FilterProducts/PriceFilter";
import SubCategoryFilter from "@/myapp/components/FilterProducts/SubCategoryFilter";
import ColorFilter from "@/myapp/components/FilterProducts/ColorFilter";
import StyleFilter from "@/myapp/components/FilterProducts/StyleFilter";
import { Button } from "@/components/ui/button";

const CategoryDrawer = ({ onClose, visible }) => {
  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[80vw]">
        <SheetHeader>
          <SheetTitle>Filter By</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-2">
          <FilterSection title="Prices">
            <PriceFilter isMobile={true} />
          </FilterSection>

          <FilterSection title="Tags">
            <TagsFilter isMobile={true} />
          </FilterSection>

          <FilterSection title="Sub Categories">
            <SubCategoryFilter isMobile={true} />
          </FilterSection>

          <FilterSection title="Colors">
            <ColorFilter isMobile={true} />
          </FilterSection>

          <FilterSection title="Styles">
            <StyleFilter isMobile={true} />
          </FilterSection>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const FilterSection = ({ title, children }) => (
  <Collapsible>
    <CollapsibleTrigger asChild>
      <Button variant="ghost" className="w-full justify-between">
        {title}
        <MdOutlineExpandMore className="ml-2" />
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent className="p-2">{children}</CollapsibleContent>
  </Collapsible>
);

export default CategoryDrawer;