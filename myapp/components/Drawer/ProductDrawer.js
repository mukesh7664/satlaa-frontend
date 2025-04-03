import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { MdOutlineExpandMore } from "react-icons/md";
import dynamic from "next/dynamic";

const HTMLParser = dynamic(() => import("../../components/Utils/HtmlParser"), { ssr: false });

const ProductDrawer = ({ contentDescription, state }) => {
  return (
    <div>
      <Accordion sx={{boxShadow: "none"}}>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />}>
          <Typography variant="h6" className="font-bold">DESCRIPTION</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component='div'>
            <HTMLParser html={contentDescription} />
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{boxShadow: "none"}}>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />}>
          <Typography variant="h6" className="font-bold" >DETAILS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="grid grid-cols-2 gap-2 text-base">
            <Typography variant="body1" fontWeight="bold">Category:</Typography>
            <Typography variant="body2">{state.categories.join(", ")}</Typography>

            <Typography variant="body1" fontWeight="bold">SKU:</Typography>
            <Typography variant="body2">{state.sku}</Typography>

            <Typography variant="body1" fontWeight="bold">Metal:</Typography>
            <Typography variant="body2">
              {state.silver_purity}% <strong>Silver</strong> + {100 - state.silver_purity}% Alloy
            </Typography>

            {state.weight && (
              <>
                <Typography variant="body1" fontWeight="bold">Gross Weight:</Typography>
                <Typography variant="body2">{state.weight.gross ? `${state.weight.gross} gm` : "NA"}</Typography>

                <Typography variant="body1" fontWeight="bold">Net Weight:</Typography>
                <Typography variant="body2">{state.weight.net ? `${state.weight.net} gm` : "NA"}</Typography>
              </>
            )}

            {state.colors.length > 0 && (
              <>
                <Typography variant="body1" fontWeight="bold">Color:</Typography>
                <Typography variant="body2">{state.colors.join(", ")}</Typography>
              </>
            )}

            {state.styles.length > 0 && (
              <>
                <Typography variant="body1" fontWeight="bold">Style:</Typography>
                <Typography variant="body2">{state.styles.join(", ")}</Typography>
              </>
            )}

            {state.subcategory.length > 0 && (
              <>
                <Typography variant="body1" fontWeight="bold">Subcategory:</Typography>
                <Typography variant="body2">{state.subcategory.join(", ")}</Typography>
              </>
            )}

            {state.tags.length > 0 && (
              <>
                <Typography variant="body1" fontWeight="bold">Tags:</Typography>
                <Typography variant="body2">{state.tags.join(", ")}</Typography>
              </>
            )}
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{boxShadow: "none"}}>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />}>
          <Typography variant="h6" className="font-bold" >OTHER INFO</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="text-base list-disc list-inside font-normal">
            <li>Free express shipping on Prepaid Orders.</li>
            <li>7 days return policy</li>
            <li>6 month warranty</li>
          </ul>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{boxShadow: "none"}}>
        <AccordionSummary expandIcon={<MdOutlineExpandMore />}>
          <Typography variant="h6" className="font-bold" >Why SATLAA is So Affordable</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We have been in the jewelry business for generations, manufacturing many of our products right in our own facilities and maintaining direct connections with other manufacturers. Unlike other brands that invest heavily in marketing and buy products from distributors while marking up their prices by as much as 400%, we operate differently. By focusing on a larger customer base and keeping our margins low, we stay ahead of the competition. This approach not only sets us apart but also keeps our jewelry accessible and affordable.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ProductDrawer;