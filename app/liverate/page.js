"use client";

import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import {API_URL} from "@/config";

export const metadata = {
  title: "Gold & Silver rate today, Today’s gold and silver rate, Gold and silver price today, 10 gram gold rate today, Gold Price in India",
  keywords:
    "Gold rate today, Today’s gold rate, Gold price today, 1 gram gold rate today, GOLD rates/price Live, GOLD rate/price in India Live, GOLD price, GOLD rate today Live, gold price today, GOLD rates India, gold price per gram, GOLD chart, GOLD price per gram, GOLD funds, bullion stocks, GOLD Price India, GOLD Price Forecast",
  description:
    "Get the latest gold rate today in India. Know today’s gold rate in Mumbai, Delhi, Chennai, Kerala and Bengaluru. Live gold price today in India and 1 gram gold rate today",
};

const Liverate = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`${API_URL}/liverate`);
        if (!response.ok) throw new Error("Failed to fetch rates");
        const data = await response.json();
        setRates(data);
      } catch (error) {
        console.error("Failed to fetch live rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) {
    return <p className="text-center text-lg">Loading live rates...</p>;
  }

  if (!rates) {
    return <p className="text-center text-lg text-red-500">Failed to load rates.</p>;
  }

  const dateInUTC = DateTime.fromISO(rates.updatedAt);
  const dateInIST = dateInUTC.setZone("Asia/Kolkata");
  const lastUpdated = dateInIST.toFormat("dd LLL yyyy, h:mm a");

  const data = Object.keys(rates)
    .filter(
      (key) =>
        !["_id", "updatedAt", "createdAt", "__v"].includes(key)
    )
    .map((key) => ({
      title: rates[key].title,
      beforeTax: rates[key].beforeTax,
      afterTax: rates[key].afterTax,
    }));

  return (
    <div className="container-custom text-center items-center py-14">
      <h2>Gold & Silver Price in Rajasthan</h2>
      <p className="mb-2"> Last update: {lastUpdated}</p>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price (Before Tax)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actual Price (After Tax)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((rate, idx) => (
                    <tr key={idx}>
                      <td className="text-left px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rate.title}
                      </td>
                      <td className="text-left px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-bold">
                        ₹{rate.beforeTax}
                      </td>
                      <td className="text-left px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-bold">
                        ₹{rate.afterTax}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4">
        Disclaimer: Before tax price is for display purposes. Gold is bought with the Actual Price.
      </p>
    </div>
  );
};

export default Liverate;
