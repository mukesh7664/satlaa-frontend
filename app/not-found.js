'use client';

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { fetchData } from "../util/fetchData";

export default function NotFound() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch and store data client-side
    fetchData(dispatch);
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 py-10 mx-auto max-w-4xl text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-3xl text-gray-800 mb-2">Page Not Found</p>
      <p className="text-lg text-gray-600 mt-2 mb-6 max-w-lg">
        Sorry, the page you&lsquo;re looking for doesn&lsquo;t exist or has been
        moved.
      </p>
      <div className="bg-green-500 px-6 py-3 rounded-lg mt-4 hover:bg-green-600 transition-colors">
        <p>
          <Link href="/" className="text-white text-lg font-medium hover:text-white">Go Back Home</Link>
        </p>
      </div>
    </div>
  );
}