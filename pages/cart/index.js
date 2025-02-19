import Breadcrumbs from "../../myapp/components/Utils/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Head from "../../myapp/core/Head";
import { useEffect } from "react";
import { fetchData } from "../../util/fetchData";
import CartList from "../../myapp/components/Cart/CartList";
import DetailPrice from "../../myapp/components/Cart/DetailPrice";

const Page = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData(dispatch);
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4">
      <Head title="Cart" />

      {/* Breadcrumbs */}
      <div className="flex justify-center py-4">
        <Breadcrumbs
          items={[
            { path: "/", title: "Home" },
            { title: "Cart" },
          ]}
        />
      </div>

      {/* Main Cart Section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        {cart.products && cart.products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl">
            {/* Cart List */}
            <div className="lg:col-span-8 bg-white shadow-lg rounded-lg">
              <CartList />
            </div>

            {/* Price Details */}
            <div className="lg:col-span-4 bg-white shadow-lg rounded-lg">
              <DetailPrice />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <p className="text-gray-800 text-lg mb-4">Your Cart is Empty</p>
            <Link
              href="/"
              className="bg-primary text-white px-6 py-2 rounded-lg transition duration-200 hover:bg-opacity-80"
            >
              Add Some Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;