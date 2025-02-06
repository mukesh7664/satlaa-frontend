import { Collapse } from 'antd';
import React from 'react'
import { FaMinus, FaPlus } from "react-icons/fa";
const CustomExpandIcon = ({ isActive }) =>
  isActive ? <FaMinus /> : <FaPlus />;
const FAQs = ({categoryData}) => {
  return (
    <div className="px-4 mt-4">
              <p className="text-lg font-bold">FAQs</p>
              <Collapse
                expandIconPosition="start"
                ghost
                expandIcon={({ isActive }) => (
                  <CustomExpandIcon isActive={isActive} />
                )}
                bordered={false}
              >
                {/* <Collapse.Panel className="text-2xl font" header="Offers on Sale" key="1">
          <div className="text-base"></div>
        </Collapse.Panel> */}
                {categoryData?.faqs?.map((faq, i) => {
                  return (
                    <Collapse.Panel className="" header={faq.question} key={i}>
                      <p>{faq.answer}</p>
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            </div>
  )
}

export default FAQs