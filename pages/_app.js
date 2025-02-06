import dynamic from "next/dynamic";
import { wrapper } from "../redux/store";
import { Provider } from "react-redux";
import "antd/dist/reset.css";
import "../assets/styles/global.scss";
import { fontVariables } from "../util/fonts";
import { useEffect } from "react";
import AppLayout from "../myapp/core/Layout";
// import * as fbq from "../lib/fbpixel";
import NextNProgress from "nextjs-progressbar";
import { useRouter } from "next/router";
import jsonConfig from "../config";
const GTM = dynamic(() => import("../myapp/components/Utils/GTM"), {
  ssr: false,
});
const HomeApp = ({ Component, ...rest }) => {
  if (process.env.NEXT_PUBLIC_CUSTOM_ENV === "uat") {
    jsonConfig.API_URL = "https://uat.satlaa.com";
    jsonConfig.WEBSITE_URL = "https://satlaa.vercel.app";
    jsonConfig.IMG_URL = "https://uat.satlaa.com";
  }
  const { store, props } = wrapper.useWrappedStore(rest);
  const router = useRouter();

  return (
    <main className={`${fontVariables.join(" ")} `}>
      <GTM router={router}/>
      <NextNProgress color="#29D" showOnShallow={true} height={4} />
      <Provider store={store}>
        <AppLayout>
          <Component {...props.pageProps} />
        </AppLayout>
      </Provider>
    </main>
  );
};
export default HomeApp;
