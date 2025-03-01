import React, { useEffect, useState } from "react";
import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../config";
import { DateTime } from "luxon";
import Head from "../myapp/core/Head";
const Liverate = ({ rates }) => {
  const dateInUTC = DateTime.fromISO(rates.updatedAt);
  const dateInIST = dateInUTC.setZone("Asia/Kolkata");
  const lastUpdated = dateInIST.toFormat("dd LLL yyyy, h:mm a");

  const data = Object.keys(rates)
    .filter(
      (key) =>
        key !== "_id" &&
        key !== "updatedAt" &&
        key !== "createdAt" &&
        key !== "__v"
    )
    .map((key) => ({
      title: rates[key].title,
      beforeTax: rates[key].beforeTax,
      afterTax: rates[key].afterTax,
    }));

  return (
    <div className="container-custom text-center items-center py-14">
      <Head
        title="Gold & Silver rate today, Today’s gold and silver rate, Gold and silver price today, 10 gram gold rate today, Gold Price in India"
        keywords="Gold rate today, Today’s gold rate, Gold price today, 1 gram gold rate today, GOLD rates/price Live, GOLD rate/price in India Live, GOLD price, GOLD rate today Live, gold price today, GOLD rates India, gold price per gram, GOLD chart, GOLD price per gram, GOLD funds, bullion stocks, GOLD Price India, GOLD Price Forecast"
        description="Get the latest gold rate today in India. Know today’s gold rate in Mumbai, Delhi, Chennai, Kerala and Bengaluru. Live gold price today in India and  1 gram gold rate today"
      />
      <h2 className="">Gold & Silver Price in Rajasthan</h2>
      <p className="mb-2"> Last update: {lastUpdated}</p>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Metal
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price (Before tax)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                     Actual Price (After Tax)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((rate, rateIdx) => (
                    <tr key={rateIdx}>
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
      <p className="mt-4">Disclaimer: Before tax price is showing purposes. Gold is bought with Actual Price.</p>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${API_URL}/liverate`);
    const rates = response.data;

    return {
      props: {
        rates,
      },
    };
  } catch (error) {
    console.error("Failed to fetch live rates:", error);

    return {
      notFound: true,
    };
  }
}

export default Liverate;
