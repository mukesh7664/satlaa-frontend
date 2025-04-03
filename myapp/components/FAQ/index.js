import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQs = ({ categoryData }) => {
  return (
    <div className="px-4 mt-4">
      <h2 className="text-lg font-bold">FAQs</h2>
      <Accordion type="multiple" className="w-full">
        {categoryData?.faqs?.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger>
              <span className="flex items-center justify-between w-full">
                {faq.question}
                <FaPlus className="accordion-open:hidden" />
                <FaMinus className="accordion-open:block hidden" />
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQs;