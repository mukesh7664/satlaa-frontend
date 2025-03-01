import React, { useEffect } from "react";
import { wrapper } from "../redux/store";
import { fetchData } from "../util/fetchData";
import { useDispatch } from "react-redux";
import Link from "next/link";

const NotFound = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch and store data client-side
    fetchData(dispatch);
  }, [dispatch]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[80VH] bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-2xl text-gray-800">Page Not Found</p>
      <p className="text-lg text-gray-600 mt-2">
        Sorry, the page you&lsquo;re looking for doesn&lsquo;t exist or has been
        moved.
      </p>
      <div className="bg-green-500">
        <p>
          <Link href="/" className="text-white hover:text-green-200">Go Back Home</Link>
        </p>
      </div>
      <Link
        href="/"
        className="mt-4 px-4 py-2 bg-primary text-white rounded  transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
