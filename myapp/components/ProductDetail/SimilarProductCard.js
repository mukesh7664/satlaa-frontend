import Image from "next/image";
import Link from "next/link";

const SimilarProductCard = ({ product }) => {
  return (
    <div className="flex flex-col items-center justify-center max-w-sm mx-auto my-4 p-4 bg-white shadow-lg rounded-lg">
      <div className="w-64">
        <Link href={`/product/${product.seo}`}>
          <Image
            width={200}
            height={200}
            className="h-64 w-full rounded-lg object-cover"
            src={
              product.allImages[0].image
                ? product.allImages[0].image
                : "/images/nofoto.jpg"
            }
            alt={product.title? product.title : "Default Title"}
          />
        </Link>
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
        <div className="flex justify-center">
          <p className="text-red-600 font-bold line-through mr-2">
            ₹{product.before_price}
          </p>
          <p className="text-green-600 font-bold">₹{product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default SimilarProductCard;
