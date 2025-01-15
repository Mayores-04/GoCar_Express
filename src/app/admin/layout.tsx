"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/AdminComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Get the token from the URL query parameter
      const token = new URLSearchParams(window.location.search).get("token");
      // Access the secret key from environment variables
      const SECRET_KEY =
        process.env.NEXT_PUBLIC_SECRET_KEY || "fallback_secret_key";

      // If token is invalid or missing, redirect to the forbidden page
      if (token !== SECRET_KEY) {
        router.push("/forbidden");
      }
    }
  }, [isClient, router]);

  if (!isClient) return null;

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-none w-16">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto ">
          <div className="flex mb-[60px] items-center z-50 bg-white justify-between w-screen py-3 pr-24 fixed h-[60px]  px-8 border-b border-black">
            <h3 className="font-medium">Admin</h3>
            <Link href={"/#Home"}>
              <img src={"/images/blueLogo.png"} width={40} alt="Home" />
            </Link>
          </div>
          <div className="mt-[60px]">{children}</div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
