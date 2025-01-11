"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/AdminComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="flex-none w-16">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto ">
          <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-8 border-b border-black">
            <h3 className="font-medium">Admin</h3>
            <img src={"/images/blueLogo.png"} width={40} alt="" />
          </div>
          {children}
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
