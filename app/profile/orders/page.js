import axiosInstance from "@/util/axios";
const axios = axiosInstance();
import { API_URL } from "../../../config";
import Breadcrumbs from "../../../myapp/components/Utils/BreadCrumbs";
import Link from "next/link";
import authservice from "../../../util/services/authservice";
import { cartFetch } from "../../../redux/reducers/Cart";
import { setIsAuthenticated, setLogin } from "../../../redux/reducers/Login";
import { wrapper } from "../../../redux/store";
import Head from "../../../myapp/core/Head";
import Orders from "../../../myapp/components/Profile/Orders";
import ProfileLeftMenu from "../../../myapp/components/Profile/LeftMenu";
import { fetchData } from "../../../util/fetchData";

const Default = ({ initialData }) => {
  return (
    <>
      <Head title="Orders" />
      <div className="container-custom ">
        <Breadcrumbs
          items={[
            {
              path: "/",
              title: "Home",
            },
            {
              path: "/profile",
              title: "Profile",
            },
            {
              title: "Orders",
            },
          ]}
        />
        <div className="grid  p-4 grid-cols-12 my-8 sm:gap-9 bg-white">
          {initialData.length > 0 ? (
            <div className=" col-span-12 order-1 lg:order-2 lg:col-span-9 ">
              <div className="text-2xl font-semibold col-span-12 text-primary  mb-5">
                Orders{" "}
              </div>
              <Orders ordersData={initialData} />
            </div>
          ) : (
            <div className="col-span-12 order-1 lg:order-2 lg:col-span-9 ">
              <div className="flex flex-wrap items-center space-x-4 bg-white p-4 rounded shadow md:space-x-0 md:flex-col md:items-start">
                <p className="text-gray-800 text-lg mb-2 md:mb-4">
        No Orders
                </p>
                <Link
                  href="/"
                  className="bg-indigo-500 hover:bg-indigo-600 hover:text-white px-4 py-2 text-white inline-block rounded transition duration-200 ease-in-out w-full md:w-auto"
                >
                 Let&apos;s Buy Some
                </Link>
              </div>
            </div>
          )}
        </div>{" "}
      </div>
    </>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
  const { req } = context;
  await fetchData(store.dispatch);
  // Add authentication check here
  if (!req.cookies.token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let data = [];
  const axios = axiosInstance(context);
  const auth = await authservice.isAuthenticated(context);

  if (auth.isAuthenticated) {
    await store.dispatch(cartFetch(auth.userCart));
    await store.dispatch(setLogin(auth.user));
    await store.dispatch(setIsAuthenticated(true));
  }
  try {
    const res = await axios.get(API_URL + "/orders", {
      headers: {
        Cookie: req.headers.cookie,
      },
    });
    if (res.data.length > 0) {
      data = res.data;
    }
  } catch (err) {
    console.log(err);
  }

  return { props: { initialData: data } };
})

export default Default;
