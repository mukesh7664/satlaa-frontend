
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React from "react";
dayjs.extend(relativeTime);

const OrderItem = ({ order }) => {


  return (
    <div className="border rounded-md p-4 mb-4">
      <div className="flex items-center mb-2">
        <strong className="mr-2">Order Number:</strong>
        <Link href={`/profile/orders/${order.ordernumber}`} className="text-blue-600">{order.ordernumber}
        </Link>
      </div>
      <div className="flex items-center mb-2">
        <strong className="mr-2">Date:</strong>
        <span title={dayjs(order.createdAt).fromNow()}>
          {dayjs(order.createdAt).format("DD/MM/YY")}
        </span>
      </div>
      <div className="flex items-center mb-2">
        <strong className="mr-2">Status:</strong>
        <span>{order.status}</span>
      </div>
      <div className="flex items-center mb-2">
        <strong className="mr-2">Total Price:</strong>
        <span>{order.total_price}</span>
      </div>
      <div>
        <Link
          href={`/profile/orders/${order.ordernumber}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          View Order
        </Link>
      </div>
    </div>
  );
};

const Default = ({ ordersData = [] }) => {
  return (
    <div className="flex flex-col">
      {ordersData.map((order, idx) => (
        <OrderItem key={idx} order={order} />
      ))}
    </div>
  );
};

export default Default;
