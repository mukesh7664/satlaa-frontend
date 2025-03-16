"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Profile from "@/myapp/components/Profile";
import ProfileLeftMenu from "@/myapp/components/Profile/LeftMenu";

export const metadata = {
  title: "Profile - SATLAA",
  description: "Manage your profile information and account settings.",
};

const ProfilePage = () => {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.login);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container-custom">
      <div className="grid shadow-lg p-4 grid-cols-12 my-8 sm:gap-9 bg-white">
        <div className="col-span-12 order-2 lg:order-1 lg:col-span-3">
          <ProfileLeftMenu />
        </div>
        <div className="col-span-12 order-1 lg:order-2 lg:col-span-9">
          <div className="text-2xl font-semibold text-primary mb-5">
            Profile Info
          </div>
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;