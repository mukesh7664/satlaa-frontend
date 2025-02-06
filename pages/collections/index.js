import React from "react";
import Head from "../../myapp/core/Head";
import CollectionsList from "../../myapp/components/collections/list";

import { wrapper } from "@/redux/store";
import { fetchData } from "@/util/fetchData";
const Collections = () => {
  return (
    <div className="container-custom h-full ">
      <Head title="Collections" />

      <div className=" bg-white">
        <CollectionsList />
      </div>
    </div>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await fetchData(store.dispatch);

    return {
      props: {},
    };
  }
);
export default Collections;
