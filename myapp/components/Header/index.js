import { useSelector } from "react-redux";
// import { login_r, isAuthenticated_r, logout_r } from "../../../redux/actions";

import {  Drawer } from "antd";

import { IMG_URL } from "../../../../config";
import Image from "next/image";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaBars } from "react-icons/fa";

const Default = () => {
  const { settings } = useSelector(({ settings }) => settings);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const showDrawer = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    const handleRouteChange = () => {
      setVisible(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);
  return (
    <div className="w-full flex justify-between py-2 md:py-3 z-10 sticky top-0">
      <header className="bg-white w-full flex justify-between py-1">
        <div className="w-5/12 md:w-2/12 md:mr-0 flex flex-row justify-center">
          <Link href="/" className="flex align-middle">
            <Image
             src={
              "https://api.satlaa.com/images/uploads/custom/logo.png"
            }
              width="130"
              height="44"
              className="w-full sm:w-10/12 sm:mt-0 object-contain"
              alt="Logo"
            />
          </Link>
        </div>
        <div className="flex-row w-full md:pl-5 lg:pl-0 justify-center hidden md:flex">
          <LeftMenu mode={"horizontal"} />
        </div>
        <div className="w-5/12 md:w-auto flex flex-row mr-2">
          <RightMenu mode={"horizontal"} />
          <button
            className="block text-black md:hidden text-2xl ml-1"
            onClick={showDrawer}
            aria-label="Menu"
          >
            <FaBars />
          </button>
        </div>

        <Drawer
          title={<p className="text-2xl font-Montserrat font-semibold">SATLAA</p>}
          placement="right"
          closable={true}
          onClose={showDrawer}
          open={visible}
          style={{ zIndex: 99999 }}
          width={"80vw"}
        >
          <LeftMenu mode="inline" />
          {/* <RightMenu mode={"vertical"} /> */}
        </Drawer>
      </header>
    </div>
  );
};

export default Default;
