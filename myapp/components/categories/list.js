import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { IMG_URL } from "../../../config";
import Image from "next/image";

const Default = () => {
  const { categories } = useSelector((state) => state.categories) || {};
  const [categoriesData, setCategoriesData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (categories && Array.isArray(categories)) {
      setCategoriesData(categories);
    }
  }, [categories]);

  const onClickCard = (seo) => {
    if (seo) router.push(`/${seo}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categoriesData.length > 0 ? (
        categoriesData.map((val) => (
          <div key={val.seo} className="cursor-pointer" onClick={() => onClickCard(val.seo)}>
            <Card className="overflow-hidden shadow-lg transition-transform hover:scale-105">
              <Image
                alt={val.title || "Default Title"}
                width={300}
                height={200}
                src={val.image ? `${IMG_URL}${val.image}` : "/images/default.jpg"}
                className="w-full h-48 object-cover"
                priority
              />
              <CardContent className="p-4 text-center">
                <h3 className="text-lg font-semibold uppercase">{val.title || "Unnamed Category"}</h3>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center">
          <h3 className="text-lg font-semibold">No categories available</h3>
        </div>
      )}
    </div>
  );
};

export default Default;