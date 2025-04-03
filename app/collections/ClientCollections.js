"use client"; // ✅ Mark this as a client component

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchData } from "@/util/fetchData";
import CollectionsList from "../../myapp/components/collections/list";

const ClientCollections = ({ collectionsData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData(dispatch);
  }, [dispatch]);

  if (!collectionsData) {
    return <p>Error loading collections.</p>;
  }

  return <CollectionsList collections={collectionsData} />;
};

export default ClientCollections;
