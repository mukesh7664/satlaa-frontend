import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-2xl text-gray-800">Page Not Found</p>
      <p className="text-lg text-gray-600 mt-2">
        Sorry, the page you&lsquo;re looking for doesn&lsquo;t exist or has been
        moved.
      </p>
      <a
        href="/"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
