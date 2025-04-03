// app/collections/[collection]/page.js

import { Suspense } from "react";
import { fetchCollectionData } from "@/util/fetchCollectionData";
import CollectionClient from "./CollectionClient";
import Head from "@/myapp/core/Head";
import Breadcrumbs from "@/myapp/components/Utils/BreadCrumbs";
import Image from "next/image";

export default async function CollectionPage({ params }) {
  const { collection } = params;
  const collectionData = await fetchCollectionData(collection);

  return (
    <div className="w-full">
      <Head
        title={collectionData.collection.seo_title}
        description={collectionData.collection.short_description}
        canonical={`https://satlaa.com/collections/${collection}`}
        image={collectionData.collection.image}
      />

      {collectionData.collection.banner_mobile && (
        <Image
          src={collectionData.collection.banner_mobile}
          height={500}
          width={1680}
          className="w-full block md:hidden"
          priority
          alt={collectionData.collection.seo_title || "Collection"}
        />
      )}

      {collectionData.collection.banner_web && (
        <Image
          src={collectionData.collection.banner_web}
          height={500}
          width={1680}
          className="w-full md:block hidden"
          priority
          alt={collectionData.collection.seo_title || "Collection"}
        />
      )}

      <div className="flex flex-col my-2 py-2 md:px-16 container">
        <div className="ml-2 md:ml-4">
          <Breadcrumbs
            items={[
              { path: "/", title: "Home" },
              { path: "/collections", title: "Collections" },
              { title: collection },
            ]}
          />
        </div>

        {/* Client-side functionalities */}
        <Suspense fallback={<p>Loading collection...</p>}>
          <CollectionClient collectionData={collectionData} collection={collection} />
        </Suspense>
      </div>
    </div>
  );
}