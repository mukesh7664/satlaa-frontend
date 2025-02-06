import React from "react";
import Head from "../myapp/core/Head";
import CategoriesList from "../myapp/components/categories/list";

import { wrapper } from "@/redux/store";
import { fetchData } from "@/util/fetchData";
const Categories = () => {
  return (
    <div className="container-custom h-full ">
      <Head title="Categories" />
      <p className="text-3xl w-full font-bold font-Montserrat mt-2 text-center">Categories</p>

      <div className=" bg-white">
        <CategoriesList />
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
export default Categories;
