import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { FaMinus, FaPlus } from "react-icons/fa";

const CustomExpandIcon = ({ isExpanded }) => (isExpanded ? <FaMinus /> : <FaPlus />);

const FAQs = ({ categoryData }) => {
  return (
    <div className="px-4 mt-4">
      <Typography variant="h6" fontWeight="bold">
        FAQs
      </Typography>
      {categoryData?.faqs?.map((faq, i) => (
        <Accordion key={i}>
          <AccordionSummary
            expandIcon={<CustomExpandIcon isExpanded />}
            aria-controls={`faq-content-${i}`}
            id={`faq-header-${i}`}
          >
            <Typography variant="body1">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default FAQs;