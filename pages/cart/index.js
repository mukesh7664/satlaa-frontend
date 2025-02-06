import Breadcrumbs from "../../myapp/components/Utils/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Head from "../../myapp/core/Head";
import { wrapper } from "../../redux/store";
import authservice from "../../util/services/authservice";
import { cartFetch, getCart } from "../../redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "../../redux/reducers/Login";
import DetailPrice from "../../myapp/components/Cart/DetailPrice";
import { fetchData } from "../../util/fetchData";
import { useEffect } from "react";
import CartList from "../../myapp/components/Cart/CartList";

const Page = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    // Fetch and store data client-side
    fetchData(dispatch);
  }, [dispatch]);
  return (
    <div className="container-custom ">
      <Head title="Cart" />
      <div className="flex justify-center">
        <Breadcrumbs
          items={[
            {
              path: "/",
              title: "Home",
            },
            {
              title: "Cart",
            },
          ]}
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        {cart.products && cart.products?.length > 0 ? (
          <div className="h-full grid grid-cols-12">
            <div className=" col-span-12 lg:col-span-9 shadow-lg m-0 sm:m-4 grid-cols-2 my-8 gap-9  bg-white">
              <CartList />
            </div>
            <div className=" col-span-12 lg:col-span-3 shadow-lg m-0 sm:m-4  grid-cols-2 bg-white my-8 gap-9">
              <DetailPrice />
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center space-x-4 bg-white p-4 rounded shadow md:space-x-0 md:flex-col md:items-start">
            <p className="text-gray-800 text-lg mb-2 md:mb-4">
              Your Cart is Empty
            </p>
            <Link
              href="/"
              className="bg-primary hover:text-white px-4 py-2 text-white inline-block rounded transition duration-200 ease-in-out w-full md:w-auto"
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
