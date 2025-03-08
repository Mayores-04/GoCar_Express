"use client";

import React from "react";
import AdminHome from "./AdminDashboard/page";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminDashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      router.push("/forbidden");  
    }
  }, []);

  return <AdminHome />;
};

export default AdminDashboardPage;
