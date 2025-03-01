import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

import { cartFetch } from "../../../redux/reducers/Cart";
import { setLogin, setIsAuthenticated } from "../../../redux/reducers/Login";
import { useRouter } from "next/router";
import AuthService from "../../../util/services/authservice";

import func from "../../../util/helpers/func";

const Footer = dynamic(() => import("../../components/Footer"), { ssr: true });
const Header = dynamic(() => import("../../components/Header"), { ssr: true });
import { hasCookie } from "cookies-next";
import AnnouncementHeader from "../../components/TopMenu/annoncements";
import { FaWhatsapp } from "react-icons/fa";
const haveCookie = hasCookie("token");

const AppLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { settings } = useSelector(({ settings }) => settings);
  const { errorFetch } = useSelector(({ settings }) => settings);
  const { isAuthenticated } = useSelector(({ login }) => login);
  const { topmenu } = useSelector(({ topmenu }) => topmenu);
  const loginControl = () => {
    if (!isAuthenticated) {
      AuthService.isAuthenticated().then((auth) => {
        if (auth.isAuthenticated) {
          dispatch(cartFetch(auth.userCart));
          dispatch(setLogin(auth.user));
          dispatch(setIsAuthenticated(true));
        }
      });
    }
  };

  const fetchError = () => {
    if (errorFetch) {
      // message.error(errorFetch);
    }
  };

  useEffect(() => {
    if (haveCookie) {
      loginControl();
    }
    fetchError();
  }, [isAuthenticated]);

  const isUnRestrictedRoute = (pathname) => {
    return pathname === "/sitemap.xml";
  };

  return isUnRestrictedRoute(router.pathname) ? (
    children
  ) : (
    <>
      {/* <CircularProgress className={!isLoaded ? "visible" : "hidden"} /> */}
      <div className="overflow-hidden">
        <div className="border-b sticky top-0 bg-white z-50 ">
          <div className="md:py-1 text-white bg-accent">
            <AnnouncementHeader announcements={settings.announcements} />
            {/* <p>{haveCookie}</p> */}
          </div>
          <div className="mx-2 md:mx-8">
            <Header className="" />
            {/* <div className="h-11">
                     <CategoriesMenu />
                  </div> */}
          </div>
        </div>
        <div className="min-h-[80vh] bg-white">{children}</div>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://api.whatsapp.com/send?phone=919257120925&text=I%20want%20to%20know%20about%20https://satlaa.com${router.asPath}`}
          className="fixed bottom-12 right-4 z-40 bg-green-500 p-2 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
        >
          <FaWhatsapp className="text-2xl md:text-4xl" />
        </a>
        <Footer
          footerMenu={func.getCategoriesTree(
            topmenu,
            "6154a5a279053f941d1b786c"
          )}
        />
      </div>
    </>
  );
};

export default AppLayout;
