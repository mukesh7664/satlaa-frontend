import React from 'react';
import { Drawer, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton } from '@mui/material';
import { MdOutlineExpandMore } from "react-icons/md";
import TagsFilter from "@/myapp/components/FilterProducts/TagsFilter";
import PriceFilter from "@/myapp/components/FilterProducts/PriceFilter";
import SubCategoryFilter from "@/myapp/components/FilterProducts/SubCategoryFilter";
import ColorFilter from "@/myapp/components/FilterProducts/ColorFilter";
import StyleFilter from "@/myapp/components/FilterProducts/StyleFilter";

const CategoryDrawer = ({ onClose, visible }) => {
  return (
    <Drawer
      anchor="left"
      open={visible}
      onClose={onClose}
      sx={{ width: "80vw", '& .MuiDrawer-paper': { width: "80vw" } }}
    >
      <div style={{ padding: "16px" }}>
        <Typography variant="h6">Filter By</Typography>
      </div>
      
      <Accordion>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />}>
          <Typography>Prices</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PriceFilter isMobile={true} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />}>
          <Typography>Tags</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TagsFilter isMobile={true} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />}>
          <Typography>Sub Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SubCategoryFilter isMobile={true} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />}>
          <Typography>Colors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ColorFilter isMobile={true} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />}>
          <Typography>Styles</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StyleFilter isMobile={true} />
        </AccordionDetails>
      </Accordion>
    </Drawer>
  );
};

export default CategoryDrawer;