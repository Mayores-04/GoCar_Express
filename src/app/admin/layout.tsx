import React, { ReactNode } from "react";
import Sidebar from "../components/AdminComponents/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex">
        <ToastContainer theme="dark"/>
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
            <h3 className="font-medium">Admin Panel</h3>
            <img src={"/images/image1.png"} width={40} alt="" />
          </div>
          <div className=" ">{children}</div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
