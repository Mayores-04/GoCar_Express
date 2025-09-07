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

// "use client";

// import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import AdminHome from "./AdminDashboard/page";

// const AdminPage = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = Cookies.get("adminToken");
//     if (!token) {
//       router.push("/forbidden");
//     } else {
//       setIsAuthenticated(true);
//     }
//   }, [router]);

//   if (!isAuthenticated) {
//     return <div>Loading...</div>;
//   }

//   return <AdminHome />;
// };

// export default AdminPage;

