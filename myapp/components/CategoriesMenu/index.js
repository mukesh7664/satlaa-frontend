import React, { useState, useEffect } from "react";
import { Menu } from "@mui/material";
import { useSelector } from "react-redux";
import router from "next/router";

const Page = () => {
  const { categories } = useSelector(({ categories }) => categories);
  const [categoriesData, seTcategoriesData] = useState([]);
  useEffect(() => {
    if (categories) seTcategoriesData(categories);
  }, [categories]);

  const onClickMenu = (data) => {
    router.push("/" + data.key);
  };

  return (
    <>
      {categoriesData?.length > 0 ? (
        <Menu mode="horizontal" className=" block" onClick={onClickMenu}>
          {categoriesData?.map((val) => (
            <Menu.Item key={val.seo}>
              <a className="uppercase mr-2">{val.title}</a>
            </Menu.Item>
          ))}
        </Menu>
      ) : (
        ""
      )}
    </>
  );
};

export default Page;
