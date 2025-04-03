"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation"; 
import { IMG_URL } from "../../../config";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Default = () => {
  const { collections } = useSelector((state) => state.collections);
  const [collectionsData, setCollectionsData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (collections) setCollectionsData(collections);
  }, [collections]);

  const onClickCard = (seo) => {
    router.push(`/collections/${seo}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {collectionsData.length > 0 ? (
        collectionsData.map((val) => (
          <Card 
            key={val.seo} 
            className="overflow-hidden shadow-md transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => onClickCard(val.seo)}
          >
            <div className="relative w-full h-48">
              <Image
                alt={val.title || "Default Title"}
                src={val.image ? `${IMG_URL}${val.image}` : "/images/default.jpg"}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <CardContent className="flex flex-col items-center p-4">
              <h2 className="text-lg font-semibold uppercase">{val.title}</h2>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center">
          <Skeleton className="w-32 h-32 mb-4 rounded-full" />
          <p className="text-gray-500">No collections available.</p>
        </div>
      )}
    </div>
  );
};

export default Default;