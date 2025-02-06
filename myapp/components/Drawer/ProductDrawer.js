import { Collapse } from "antd";
import dynamic from "next/dynamic";
const { Panel } = Collapse;
import {

    FaMinus,
    FaPlus,
  } from "react-icons/fa";
const CustomExpandIcon = ({ isActive }) =>
  isActive ? <FaMinus /> : <FaPlus />;
const HTMLParser = dynamic(
    () => import("../../components/Utils/HtmlParser"),
    {
      ssr: false, // Disable server-side rendering if needed
      // Optional loading component
    }
  );
const ProductDrawer = ({contentDescription, state}) => {
  return (
    <Collapse
      expandIconPosition="end"
      ghost
      expandIcon={({ isActive }) => <CustomExpandIcon isActive={isActive} />}
      bordered={false}
    >
      {/* <Panel className="text-2xl font" header="Offers on Sale" key="1">
          <div className="text-base"></div>
        </Panel> */}

      <Panel
        className="text-[16px] md:text-xl font-semibold font-Montserrat text-gray-500"
        header="DESCRIPTION"
        key="1"
      >
        <div className="text-base font-normal">
          <HTMLParser html={contentDescription} />
        </div>
      </Panel>
      <Panel
        className="text-[16px] md:text-xl font-semibold font-Montserrat font px-0 text-gray-500"
        header="DETAILS"
        key="2"
      >
        <div className="grid grid-cols-2 gap-2 text-base">
          <div className="font-bold">Category:</div>
          <div className="font-normal">{state.categories.join(", ")}</div>
          <div className="font-bold">SKU:</div>
          <div className="font-normal">{state.sku}</div>
          <div className="font-bold">Metal:</div>
          <div className="font-normal">
            {state.silver_purity}% <span className="font-semibold">Silver</span>{" "}
            + {100 - state.silver_purity}% Alloy
          </div>
          {state.weight && (
            <>
              <div className="font-bold">Gross Weight:</div>
              <div>
                {state.weight.gross ? state.weight.gross + " gm" : "NA"}
              </div>
              <div className="font-bold">Net Weight:</div>
              <div>{state.weight.net ? state.weight.net + " gm" : "NA"}</div>
            </>
          )}
          {state.colors.length < 0 && (
            <>
              <div className="font-bold">Color:</div>
              <div>{state.colors.join(", ")}</div>
            </>
          )}

          {state.styles.length < 0 && (
            <>
              <div className="font-bold">Style:</div>
              <div>{state.styles.join(", ")}</div>
            </>
          )}

          {state.subcategory.length < 0 && (
            <>
              <div className="font-bold">Subcategory:</div>
              <div>{state.subcategory.join(", ")}</div>
            </>
          )}
          {state.tags.length < 0 && (
            <>
              <div className="font-bold">Tags:</div>
              <div>{state.tags.join(", ")}</div>
            </>
          )}
        </div>
      </Panel>
      <Panel
        className="text-[16px] md:text-xl font-semibold font-Montserrat"
        header="OTHER INFO"
        key="3"
      >
        <ol className="text-base list-disc list-inside font-normal">
          <li>Free express shipping on Prepaid Orders.</li>
          <li>7 days return policy</li>
          <li>6 month warranty</li>
        </ol>
      </Panel>
      <Panel
        className="text-[16px] md:text-xl font-semibold font-Montserrat text-gray-500"
        header="Why SATLAA is So Affordable"
        key="0"
      >
        <div className="text-base font-normal">
          <p>
            We have been in the jewelry business for generations, manufacturing
            many of our products right in our own facilities and maintaining
            direct connections with other manufacturers. Unlike other brands
            that invest heavily in marketing and buy products from distributors
            while marking up their prices by as much as 400%, we operate
            differently. By focusing on a larger customer base and keeping our
            margins low, we stay ahead of the competition. This approach not
            only sets us apart but also keeps our jewelry accessible and
            affordable.
          </p>
        </div>
      </Panel>
    </Collapse>
  );
};

export default ProductDrawer;
