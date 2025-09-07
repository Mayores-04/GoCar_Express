// "use client";

// import React from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import AdminHome from "./AdminDashboard/page";

// const AdminDashboardPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   React.useEffect(() => {
//     if (!token) {
//       router.push("/forbidden");
//     }
//   }, [token, router]);

//   if (!token) {
//     return <div>Checking authentication...</div>; // prevents flicker
//   }

//   return <AdminHome />;
// };

// export default AdminDashboardPage;


"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import AdminHome from "./AdminDashboard/page";

const AdminDashboardPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("adminToken");
    if (!token) {
      router.push("/forbidden");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div>Checking authentication...</div>;
  }

  return <AdminHome />;
};

export default AdminDashboardPage;
