import Link from 'next/link';
import React from 'react';


const BreadcrumbItem = ({ path, title, isLast }) => {
  if(isLast) {
    return <span className="text-gray-500 capitalize">{title}</span>
  }

  return (
    <span>
      <Link href={path} className="text-black hover:text-blue-700">{title}</Link>
      <span className="mx-2 text-gray-500">/</span>
    </span>
  );
}

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="text-sm">
      {items.map((item, index) => (
        <BreadcrumbItem 
          key={index} 
          path={item.path} 
          title={item.title} 
          isLast={index === items.length - 1}
        />
      ))}
    </nav>
  );
};

export default Breadcrumbs;
