"use client"

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useParams } from "next/navigation";
import { setIsAuthenticated, setLogin } from "../../../redux/reducers/Login";
import { cartFetch } from "../../../redux/reducers/Cart";
import authservice from "../../../util/services/authservice";
import parse from "html-react-parser";
import { fetchData } from "../../../util/fetchData";
import { API_URL
} from "../../../config";
//const API_URL = process.env.NEXT_PUBLIC_API_URL; // Use env variable for flexibility

const Page = () => {
  const { seo } = useParams();
  const dispatch = useDispatch();
  const { topmenu } = useSelector((state) => state.topmenu);

  const [resData, setResData] = useState(null);
  const [contentDescription, setContentDescription] = useState("<p></p>");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const res = await fetch(`${API_URL}/topmenupublic/${seo}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setResData(data[0]);
        setContentDescription(replaceStyle(data[0]?.description));

        const auth = await authservice.isAuthenticated();
        await fetchData(dispatch);
        if (auth.isAuthenticated) {
          dispatch(cartFetch(auth.userCart));
          dispatch(setLogin(auth.user));
          dispatch(setIsAuthenticated(true));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAsync();
  }, [seo, dispatch]);

  const replaceStyle = (dataHtml) => {
    return dataHtml
      ?.replaceAll("<p>", "<p style='min-height:25px'>")
      .replaceAll(
        "<pre>",
        "<pre style='min-height:30px; background-color:#dbdbdb; padding:15px'>"
      )
      .replaceAll("<img ", "<img class='w-full sm:w-auto' ")
      .replaceAll(
        '<div class="media-wrap image-wrap ',
        '<div class="media-wrap image-wrap w-full sm:w-auto '
      );
  };

  if (loading) return <p className="text-center text-lg">Loading content...</p>;
  if (!resData) return <p className="text-center text-lg text-red-500">Content not found.</p>;

  const content = topmenu.find((x) => x.seo === seo);
  const leftMenu = topmenu.filter((x) => x.categories_id === content?.categories_id);
  const leftMenuTitle = topmenu.find((x) => x._id === content?.categories_id);

  return (
    <div className="container-custom h-full">
      <div className="grid p-4 grid-cols-12 my-8 sm:gap-9 bg-white">
        {/* Left Sidebar Menu */}
        {/* Uncomment if needed */}
        {/* <div className="lg:col-span-3 col-span-12 sm:order-2 order-2">
          <div className="text-xl font-semibold text-primary mb-5 mt-5 sm:mt-0">
            {leftMenuTitle?.title}
          </div>
          {leftMenu.map((x, i) => (
            <Link
              key={i}
              href={`/pages/${x.seo}`}
              className="w-full py-3 border-b border-t -mt-0.1 hover:pl-1 transform-all"
            >
              {x.title}
            </Link>
          ))}
        </div> */}

        {/* Main Content */}
        <div className="lg:col-span-9 sm:order-2 order-1 prose lg:prose-xl col-span-12">
          <div className="text-2xl font-semibold text-primary mb-5">
            {content?.title}
          </div>
          {parse(contentDescription)}
        </div>
      </div>
    </div>
  );
};

export default Page;
