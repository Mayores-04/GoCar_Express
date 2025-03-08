"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
interface AdminAccount {
  AdminUser: string;
  AdminPassword: string;
}
import crypto from "crypto"; 

const ForbiddenPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminAccounts = async () => {
      try {
        const response = await axios.get("/api/AdminAccounts");
        setAdminAccounts(response.data);
      } catch (err: any) {
        console.error("Error fetching admin accounts:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminAccounts();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      router.replace(`/admin?token=${token}`);
    }
  }, [router]);



// const handleLogin = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     const response = await fetch("/api/AdminAccounts", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         AdminUser: email,
//         Password: password,
//       }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       // Generate a secure random token
//       const randomToken = crypto.randomBytes(32).toString("hex");

//       // Store the token securely in Cookies
//       Cookies.set("adminToken", randomToken, { expires: 1, secure: true });

//       // Also store it in localStorage
//       localStorage.setItem("adminToken", randomToken);

//       toast.success("Login successful!");
//       router.push("/admin"); // Redirect without exposing the token
//     } else {
//       toast.error(data.error || "Invalid credentials");
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     toast.error("Server error. Please try again.");
//   }
// };


  //Ayus to
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/AdminAccounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          AdminUser: email,
          Password: password,
        }),
      });

      const data = await response.json();
      const SECRET_KEY = process.env.JWT_KEY || process.env.NEXT_PUBLIC_SECRET_KEY;
      if (response.ok) {
        document.cookie = `token=${data.token}; path=/`;
        Cookies.set("adminToken", "valid_token", { expires: 1, secure: true });
        toast.success("Login successful!");

        localStorage.setItem("adminToken", data.token);

        router.push(`/admin?token=${SECRET_KEY}`);
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Server error. Please try again.");
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow dark:bg-gray-800">
        <h1 className="text-xl font-bold mb-4 text-center">
          {isAddingAccount ? "Add New Admin" : "Admin Login"}
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded mb-2"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForbiddenPage;
