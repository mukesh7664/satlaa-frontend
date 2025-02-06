import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { Form, Input,Space, Button } from "@mui/material";
import filterRouteLinkGenerate from "./filterRouterLink";
// import { filterProducts_r } from "../../../redux/actions";
import { filterProducts as filterProducts_r } from "../../../redux/reducers/FilterProducts";


const Page = () => {
   const { filterProducts } = useSelector(
      ({ filterProducts }) => filterProducts
   );
   const [state, seTstate] = useState(filterProducts);
   const dispatch = useDispatch();

   useEffect(() => {
      seTstate(filterProducts);
   }, [filterProducts]);

   const onChange = () => {
      dispatch(
         filterProducts_r({ ...filterProducts, text: state.text, page: 1 })
      );
      filterRouteLinkGenerate({ ...filterProducts, text: state.text, page: 1 });
   };

   return (
      <>
         <div className="row py-2  mb-4">
            <h6>Search </h6>
            <Form onFinish={onChange}>
               <Space.Compact compact="true">
                  <Input
                     style={{ width: "84%" }}
                     placeholder="Enter text..."
                     min={0}
                     value={state.text}
                     onChange={(e) =>
                        seTstate({
                           ...state,
                           text: e.target.value,
                        })
                     }
                  />
                  <Button
                     style={{ width: "16%" }}
                     onClick={() => onChange()}
                     type="default" 
                     className="m-0 p-1 bg-primary"
                     htmlType="submit"
                  >
                     <SearchOutlined />
                  </Button>
               </Space.Compact>
            </Form>
         </div>
      </>
   );
};

export default Page;
