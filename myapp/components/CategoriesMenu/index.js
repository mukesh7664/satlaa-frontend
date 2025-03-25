import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
      {categoriesData?.length > 0 && (
        <div className="flex flex-wrap gap-2" onClick={onClickMenu}>
          {categoriesData.map((val) => (
            <Button
              key={val.seo}
              variant="ghost"
              className="uppercase mr-2"
            >
              {val.title}
            </Button>
          ))}
        </div>
      )}
    </>
  );
};

export default Page;
