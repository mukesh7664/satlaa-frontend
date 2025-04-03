import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Marketplace = ({ data }) => {
  return (
    <div className="my-4 space-y-4">
      <p className="font-bold text-lg">
        You can also purchase this product from the following online stores:
      </p>

      <div className="flex flex-wrap gap-4">
        {data.marketplaceLinks?.amazon && data.marketplaceLinks?.amazon !== "NA" && (
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 border rounded-lg"
          >
            <a href={data.marketplaceLinks.amazon} target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/brands/amazon.png"
                width={40}
                height={40}
                quality={100}
                alt="Amazon"
              />
              <span className="font-bold">
                Buy on <span className="text-blue-600 underline">Amazon</span>
              </span>
            </a>
          </Button>
        )}

        {data.marketplaceLinks?.flipkart && data.marketplaceLinks?.flipkart !== "NA" && (
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 border rounded-lg"
          >
            <a href={data.marketplaceLinks.flipkart} target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/brands/flipkart.png"
                width={40}
                height={40}
                quality={100}
                alt="Flipkart"
              />
              <span className="font-bold">
                Buy on <span className="text-blue-600 underline">Flipkart</span>
              </span>
            </a>
          </Button>
        )}

        {data.marketplaceLinks?.myntra && data.marketplaceLinks?.myntra !== "NA" && (
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 border rounded-lg"
          >
            <a href={data.marketplaceLinks.myntra} target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/brands/myntra.png"
                width={40}
                height={40}
                quality={100}
                alt="Myntra"
              />
              <span className="font-bold">
                Buy on <span className="text-blue-600 underline">Myntra</span>
              </span>
            </a>
          </Button>
        )}

        {data.marketplaceLinks?.meesho && (
          <Button asChild variant="outline" className="p-2 border rounded-lg">
            <a href={data.marketplaceLinks.meesho} target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/brands/meesho.png"
                width={60}
                height={60}
                quality={100}
                alt="Meesho"
              />
            </a>
          </Button>
        )}
      </div>

      <div className="border-t mt-4"></div>
    </div>
  );
};

export default Marketplace;