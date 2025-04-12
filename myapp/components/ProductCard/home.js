import Link from "next/link";
import func from "../../../util/helpers/func";
import { useSelector } from "react-redux";
import Price from "../Price";
import { Button } from "@/components/ui/button";
import { IMG_URL } from "../../../config";
import Image from "next/image";

const Default = ({ data = null, className }) => {
   const { settings } = useSelector(({ settings }) => settings);

   const getVariantPrice = (data) => {
      if (data.length > 0) {
         const newData = data.sort((a, b) => a.price - b.price);
         return (
            <span>
               <Price data={newData[0].price} /> - <Price data={newData[data.length - 1].price} />
            </span>
         );
      }
   };

   const allImgData = data?.allImages?.sort((a, b) => a.order - b.order);
   const img = allImgData?.[0] ? IMG_URL + allImgData[0].image : "/images/nofoto.jpg";

   return (
      <div className={`${className} h-[200px] w-full`} key={data._id}>
         <div className="relative h-full w-full cursor-pointer">
            <Link href={`/products/${data.seo}`} legacyBehavior>
               <div className="flex h-full w-full overflow-hidden">
                  <div className="w-5/12 relative h-full">
                     <Image
                        className="object-cover h-full w-full rounded-l-lg group-hover:scale-110 transition-all"
                        src={img}
                        width="143"
                        height="143"
                        alt={data.title || "Default Title"}
                     />
                  </div>
                  <div className="w-7/12 flex flex-col justify-between relative h-full bg-white">
                     <div className="p-2">
                        <p className="text-sm font-semibold line-clamp-2 h-12 overflow-hidden">
                           {data.title}
                        </p>
                        <div className="mt-2">
                           <span className="font-semibold block">
                              {data.type ? getVariantPrice(data.variant_products) : <Price data={data.price} />}
                           </span>
                           <span className="line-through text-xs text-gray-500">
                              {!data.type && data.before_price !== 0 ? <Price data={data.before_price} /> : ""}
                           </span>
                        </div>
                     </div>
                     <Button variant="default" className="rounded-r bg-[#e76e81] rounded-t-none rounded-b-none absolute bottom-0 right-0 group-hover:text-white group-hover:shadow-lg">
                        Details
                     </Button>
                  </div>
               </div>
            </Link>
         </div>
      </div>
   );
};

export default Default;