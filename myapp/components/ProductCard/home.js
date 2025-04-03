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
      <div className={className} key={data._id}>
         <div className="relative float-left h-full cursor-pointer">
            <Link href={`/products/${data.seo}`} legacyBehavior>
               <div className="w-full float-left">
                  <div className="w-5/12 float-left relative">
                     <Image
                        className="w-full bg-cover bg-center rounded-l-lg group-hover:scale-110 transition-all"
                        src={img}
                        width="143"
                        height="143"
                        alt={data.title || "Default Title"}
                     />
                  </div>
                  <div className="text-center float-left w-7/12">
                     <div className="text-center text-md relative">
                        <p className="w-full text-center float-left h-12 font-semibold overflow-hidden px-1 mt-2 pb-2">
                           {data.title}
                        </p>
                        <span className="font-semibold mt-4">
                           {data.type ? getVariantPrice(data.variant_products) : <Price data={data.price} />}
                        </span>
                        <span className="line-through text-xs w-full float-left">
                           {!data.type && data.before_price !== 0 ? <Price data={data.before_price} /> : ""}
                        </span>
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