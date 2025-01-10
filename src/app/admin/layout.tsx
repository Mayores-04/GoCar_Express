"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; 
import Sidebar from "../components/AdminComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
      const token = new URLSearchParams(window.location.search).get('token');
      // Access the secret key from environment variables
      const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || 'fallback_secret_key';  

      // If token is invalid or missing, redirect to the forbidden page
      if (token !== SECRET_KEY) {
        router.push('/forbidden');
      }
    }
  }, [isClient, router]);

  if (!isClient) return null;   

  return (
    <>
      <div className="flex">
        <ToastContainer theme="dark" />
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
            <h3 className="font-medium">Admin</h3>
            <img src={"/images/blueLogo.png"} width={40} alt="" />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
