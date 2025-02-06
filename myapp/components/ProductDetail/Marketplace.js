import { Divider } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const Marketplace = ({data}) => {
  return (
    <div className="my-4">
    <p className="text-base font-semibold">
      You can also purchase this product from below Online Store.
    </p>
    <div className="flex flex-row gap-y-2 gap-x-2 mt-2 my-2">
      {data.marketplaceLinks?.amazon &&
        data.marketplaceLinks?.amazon !== "NA" && (
          <a
            href={data.marketplaceLinks?.amazon}
            target="_blank"
            rel="noopener"
            className="flex content-center items-center gap-x-2"
          >
            <Image
              className=""
              src="/images/brands/amazon.png"
              width="40"
              height="40"
              quality={100}
              alt="amazon icon"
            />{" "}
            <p className="text-lg font-semibold">
              Buy on{" "}
              <span className="text-blue-600 underline">Amazon</span>
            </p>
          </a>
        )}
      {data.marketplaceLinks?.flipkart &&
        data.marketplaceLinks?.flipkart !== "NA" && (
          <a
            href={data.marketplaceLinks?.flipkart}
            target="_blank"
            rel="noopener"
            className="flex content-center items-center gap-x-2"
          >
            <Image
              className=""
              src="/images/brands/flipkart.png"
              width="40"
              height="40"
              quality={100}
              alt="flipkart icon"
            />
            <p className="text-lg font-semibold">
              Buy on{" "}
              <span className="text-blue-600 underline">Flipkart</span>
            </p>
          </a>
        )}
      {data.marketplaceLinks?.myntra && 
        data.marketplaceLinks?.myntra !== "NA" && (
          <a
            href={data.marketplaceLinks?.myntra}
            target="_blank"
            rel="noopener"
            className="flex content-center items-center gap-x-2"
          >
            <Image
              className=""
              src="/images/brands/myntra.png"
              width="40"
              height="40"
              quality={100}
              alt="myntra icon"
            />
            <p className="text-lg font-semibold">
              Buy on{" "}
              <span className="text-blue-600 underline">Myntra</span>
            </p>
          </a>
        )}
    
      {data.marketplaceLinks?.meesho && (
        <a
          href={data.marketplaceLinks?.meesho}
          target="_blank"
          rel="noopener"
        >
          <Image
            className=""
            src="/images/brands/meesho.png"
            width="60"
            height="60"
            quality={100}
            alt="meesho icon"
          />
        </a>
      )}
    </div>

    <Divider />
  </div>
  )
}

export default Marketplace