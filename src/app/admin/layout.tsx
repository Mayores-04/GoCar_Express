"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/AdminComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { AdminSettings } from "../components/AdminComponents/AdminSettings";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);  
  const router = useRouter();

  useEffect(() => {
    const validateToken = () => {
      const token = new URLSearchParams(window.location.search).get("token");
      const SECRET_KEY =
        process.env.NEXT_PUBLIC_SECRET_KEY || "fallback_secret_key";

      if (token === SECRET_KEY) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/forbidden");
      }
    };

    validateToken();
  }, [router]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-none w-16 z-50">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto">
          <div className="flex mb-[60px] items-center z-40 bg-white justify-between w-screen py-3 pr-24 fixed h-[60px] px-8 border-b border-black">
            <h3 className="font-medium">Admin</h3>

            {/* <Link href={"/#Home"}> */}
              {/* <img src={"/images/blueLogo.png"} width={40} alt="Home" /> */}
              <AdminSettings />
            {/* </Link> */}
          </div>
          <div className="mt-[60px]">{children}</div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;