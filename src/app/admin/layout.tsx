"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "../components/AdminComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminSettings } from "../components/AdminComponents/AdminSettings";
import Cookies from "js-cookie";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("Dashboard");

  useEffect(() => {
    const routeToTitleMap: { [key: string]: string } = {
      "/admin": "Dashboard",
      "/admin/AddCars": "Car Management - Add Cars",
      "/admin/CarsList": "Car Management - Car List",
      "/admin/AddNews": "News Management",
      "/admin/ReservedList": "Reservation - Reserved List",
      "/admin/DashboardManagement": "Dashboard Management",
    };

    setPageTitle(routeToTitleMap[pathname] || "Unknown Page");
  }, [pathname]);

  useEffect(() => {
    const token = Cookies.get("adminToken");
  
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/forbidden"); // Redirect to Forbidden page
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
        </div>
      </div>
    );
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
            <h3 className="font-medium">Admin {pageTitle}</h3>
            <AdminSettings />
          </div>
          <div className="mt-[60px]">{children}</div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
