import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonProductCard = () => {
    return (
      <div className="xl:col-span-3 lg:col-span-4 col-span-6 m-2 md:m-3 bg-gray-100 group overflow-hidden pb-0">
        <Skeleton height={320} />
        <div className="p-2">
          <Skeleton height={20} />
          <Skeleton height={20} className="mt-2" />
        </div>
      </div>
    );
  };
  
export default SkeletonProductCard;
