"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminHome from "./AdminDashboard/page";

const AdminDashboardPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  React.useEffect(() => {
    if (!token) {
      router.push("/forbidden");
    }
  }, [token, router]);

  if (!token) {
    return <div>Checking authentication...</div>; // prevents flicker
  }

  return <AdminHome />;
};

export default AdminDashboardPage;
