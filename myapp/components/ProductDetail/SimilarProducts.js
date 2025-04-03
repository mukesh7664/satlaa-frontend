import SimilarProductCard from "./SimilarProductCard";
import ProductCard from "../ProductCard";
// Assume 'similarProducts' is the array of similar product data fetched from your API

const SimilarProducts = ({ similarProducts = [] }) => {
  return (
    <div className="flex flex-wrap justify-around items-start">
      {similarProducts.map((product) => (
        <div key={product._id} className="w-1/2 md:w-1/4 py-2 pb-4">
          <ProductCard
            data={product}
            className="rounded-lg overflow-hidden shadow-xl hover:shadow-md m-2 border"
          />
        </div>
      ))}
    </div>
  );
};

export default SimilarProducts;
