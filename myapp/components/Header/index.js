"use client"; // Ensure this runs only on the client

import { useSelector } from "react-redux";
import Image from "next/image";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation"; // ✅ Correct import for Next.js 15
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // ShadCN Sheet

const Default = () => {
  const { settings } = useSelector(({ settings }) => settings);
  const [visible, setVisible] = useState(false);
  const router = useRouter(); // ✅ Use it directly

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it's running in the browser

    const handleRouteChange = () => {
      setVisible(false);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return (
    <div className="w-full flex justify-between py-2 md:py-3 z-10 sticky top-0">
      <header className="bg-white w-full flex justify-between py-1">
        <div className="w-5/12 md:w-2/12 md:mr-0 flex flex-row justify-center">
          <Link href="/" className="flex align-middle">
            <Image
              src={"https://api.satlaa.com/images/uploads/custom/logo.png"}
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

          <Sheet open={visible} onOpenChange={setVisible}>
            <SheetTrigger asChild>
              <button className="block text-black md:hidden text-2xl ml-1" aria-label="Menu">
                <FaBars />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <p className="text-2xl font-semibold mb-4">SATLAA</p>
              <LeftMenu mode="inline" />
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
};

export default Default;