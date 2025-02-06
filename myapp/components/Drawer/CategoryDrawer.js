import { Collapse, Drawer } from '@mui/material'
import React from 'react'
import TagsFilter from "@/myapp/components/FilterProducts/TagsFilter";
import PriceFilter from "@/myapp/components/FilterProducts/PriceFilter";
import SubCategoryFilter from "@/myapp/components/FilterProducts/SubCategoryFilter";
import ColorFilter from "@/myapp/components/FilterProducts/ColorFilter";
import StyleFilter from "@/myapp/components/FilterProducts/StyleFilter";
const CategoryDrawer = ({onClose, visible}) => {
  return (
    <Drawer
            title="Filter By"
            placement="left"
            closable={true}
            onClose={onClose}
            open={visible}
            bodyStyle={{ padding: "0px" }}
            Style={{ width: "80vw" }}
            width="80vw"
          >
            <Collapse
              collapsible="header"
              accordion="true"
              bordered={false}
              className="bg-white pl-4"
              expandIconPosition="end"
            >
              <Collapse.Panel className="text-base" header="Prices" key="2">
                <PriceFilter isMobile={true} />
              </Collapse.Panel>
              <Collapse.Panel className="text-base" header="Tags" key="3">
                <TagsFilter isMobile={true} />
              </Collapse.Panel>
              <Collapse.Panel
                className="text-base"
                header="Sub Categories"
                key="4"
              >
                <SubCategoryFilter isMobile={true} />
              </Collapse.Panel>
              <Collapse.Panel className="text-base" header="Colors" key="5">
                <ColorFilter isMobile={true} />
              </Collapse.Panel>
              <Collapse.Panel className="text-base" header="Styles" key="6">
                <StyleFilter isMobile={true} />
              </Collapse.Panel>
            </Collapse>
          </Drawer>
  )
}

export default CategoryDrawer